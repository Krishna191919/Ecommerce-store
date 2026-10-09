using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class AuthTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public AuthTests(EcommerceApiFactory factory) => _factory = factory;

        [Fact]
        public async Task Register_NewBuyer_CreatesBuyerRole()
        {
            var client = _factory.CreateClient();
            var email = TestHelpers.NewEmail("signup");

            var res = await client.PostAsJsonAsync("/api/auth/register", new
            {
                fullName = "New Buyer",
                email,
                password = "secret123",
                role = "vendor" // must be ignored — signup is always buyer
            });

            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
            var body = await res.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            Assert.Equal("buyer", body!["role"].ToString());
        }

        [Fact]
        public async Task Register_DuplicateEmail_Returns400()
        {
            var client = _factory.CreateClient();
            var email = TestHelpers.NewEmail("dupe");

            var first = await client.PostAsJsonAsync("/api/auth/register",
                new { fullName = "A", email, password = "secret123" });
            Assert.Equal(HttpStatusCode.OK, first.StatusCode);

            var second = await client.PostAsJsonAsync("/api/auth/register",
                new { fullName = "B", email, password = "secret123" });
            Assert.Equal(HttpStatusCode.BadRequest, second.StatusCode);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsToken()
        {
            var client = _factory.CreateClient();
            var token = await TestHelpers.LoginAsync(
                client, TestHelpers.AdminEmail, TestHelpers.AdminPassword);

            Assert.False(string.IsNullOrWhiteSpace(token));
        }

        [Fact]
        public async Task Login_WithWrongPassword_Returns401()
        {
            var client = _factory.CreateClient();
            var res = await client.PostAsJsonAsync("/api/auth/login",
                new { email = TestHelpers.AdminEmail, password = "not-the-password" });

            Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
        }

        [Fact]
        public async Task Profile_WithoutToken_Returns401()
        {
            var client = _factory.CreateClient();
            var res = await client.GetAsync("/api/auth/profile");

            Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
        }

        [Fact]
        public async Task Profile_WithToken_ReturnsRole()
        {
            var client = _factory.CreateClient();
            var token = await TestHelpers.LoginAsync(
                client, TestHelpers.AdminEmail, TestHelpers.AdminPassword);
            client.UseToken(token);

            var res = await client.GetAsync("/api/auth/profile");
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);

            var body = await res.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.Equal("admin", body!["role"]);
        }
    }
}
