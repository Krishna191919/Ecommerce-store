using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class VendorApplicationTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public VendorApplicationTests(EcommerceApiFactory factory) => _factory = factory;

        private static object Application(string storeName = "Test Store") => new
        {
            storeName,
            phoneNumber = "+91 9000000000",
            reason = "want to sell"
        };

        [Fact]
        public async Task Buyer_Applies_Returns201WithPendingBody()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var res = await client.PostAsJsonAsync("/api/vendor-applications", Application());

            Assert.Equal(HttpStatusCode.Created, res.StatusCode);
            var body = await res.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            Assert.Equal("pending", body!["status"].ToString());
        }

        [Fact]
        public async Task Buyer_AppliesTwiceWhilePending_Returns400()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var first = await client.PostAsJsonAsync("/api/vendor-applications", Application());
            Assert.Equal(HttpStatusCode.Created, first.StatusCode);

            var second = await client.PostAsJsonAsync("/api/vendor-applications", Application("Second"));
            Assert.Equal(HttpStatusCode.BadRequest, second.StatusCode);
        }

        [Fact]
        public async Task ListApplications_NonAdmin_Returns403()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var res = await client.GetAsync("/api/vendor-applications");
            Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
        }

        [Fact]
        public async Task Admin_Approves_PromotesApplicantToVendor()
        {
            var (buyer, email) = await TestHelpers.BuyerClientAsync(_factory);
            var apply = await buyer.PostAsJsonAsync("/api/vendor-applications", Application());
            var created = await apply.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var appId = TestHelpers.IdOf(created!);

            var admin = await TestHelpers.AdminClientAsync(_factory);
            var review = await admin.PutAsJsonAsync($"/api/vendor-applications/{appId}/review",
                new { status = "approved", note = "looks good" });
            Assert.Equal(HttpStatusCode.OK, review.StatusCode);

            // Next login must carry the vendor role.
            var fresh = _factory.CreateClient();
            var token = await TestHelpers.LoginAsync(fresh, email, "secret123");
            fresh.UseToken(token);
            var profile = await fresh.GetFromJsonAsync<Dictionary<string, string>>("/api/auth/profile");
            Assert.Equal("vendor", profile!["role"]);
        }

        [Fact]
        public async Task Rejected_Applicant_CanReapply()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var first = await client.PostAsJsonAsync("/api/vendor-applications", Application("First Try"));
            var created = await first.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var appId = TestHelpers.IdOf(created!);

            var admin = await TestHelpers.AdminClientAsync(_factory);
            var reject = await admin.PutAsJsonAsync($"/api/vendor-applications/{appId}/review",
                new { status = "rejected", note = "incomplete" });
            Assert.Equal(HttpStatusCode.OK, reject.StatusCode);

            var second = await client.PostAsJsonAsync("/api/vendor-applications", Application("Second Try"));
            Assert.Equal(HttpStatusCode.Created, second.StatusCode);
        }
    }
}
