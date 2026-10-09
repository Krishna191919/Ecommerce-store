using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class AuthorizationTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public AuthorizationTests(EcommerceApiFactory factory) => _factory = factory;

        private static object NewProduct(string title) => new
        {
            title,
            price = 9.99m,
            description = "test product",
            categoryId = 1,
            imageUrl = "https://example.com/img.png",
            rating = 4,
            ratingCount = 1
        };

        [Fact]
        public async Task Anonymous_Cart_Returns401()
        {
            var client = _factory.CreateClient();
            var res = await client.GetAsync("/api/cart");
            Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
        }

        [Fact]
        public async Task Buyer_CreateProduct_Returns403()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var res = await client.PostAsJsonAsync("/api/products", NewProduct("buyer-item"));
            Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
        }

        [Fact]
        public async Task Vendor_CreateOwnProduct_ReturnsSuccess()
        {
            var (client, _) = await TestHelpers.VendorClientAsync(_factory);
            var res = await client.PostAsJsonAsync("/api/products", NewProduct("vendor-item"));
            Assert.True(res.StatusCode is HttpStatusCode.OK or HttpStatusCode.Created);
        }

        [Fact]
        public async Task Vendor_EditOwnProduct_Returns204()
        {
            var (client, _) = await TestHelpers.VendorClientAsync(_factory);
            var created = await client.PostAsJsonAsync("/api/products", NewProduct("own-edit"));
            var product = await created.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var id = TestHelpers.IdOf(product!);

            var res = await client.PutAsJsonAsync($"/api/products/{id}", NewProduct("own-edit-v2"));
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        [Fact]
        public async Task Vendor_EditForeignProduct_Returns403()
        {
            var (client, _) = await TestHelpers.VendorClientAsync(_factory);
            // Product 1 is seeded and owned by the admin.
            var res = await client.PutAsJsonAsync("/api/products/1", NewProduct("hacked"));
            Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
        }

        [Fact]
        public async Task Admin_EditAnyProduct_Returns204()
        {
            var admin = await TestHelpers.AdminClientAsync(_factory);
            var (vendorClient, _) = await TestHelpers.VendorClientAsync(_factory);
            var created = await vendorClient.PostAsJsonAsync("/api/products", NewProduct("admin-override"));
            var product = await created.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var id = TestHelpers.IdOf(product!);

            var res = await admin.PutAsJsonAsync($"/api/products/{id}", NewProduct("admin-override-v2"));
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        [Fact]
        public async Task Users_List_Anon401_Buyer403_Admin200()
        {
            var anon = _factory.CreateClient();
            var anonRes = await anon.GetAsync("/api/users");
            Assert.Equal(HttpStatusCode.Unauthorized, anonRes.StatusCode);

            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);
            var buyerRes = await buyer.GetAsync("/api/users");
            Assert.Equal(HttpStatusCode.Forbidden, buyerRes.StatusCode);

            var admin = await TestHelpers.AdminClientAsync(_factory);
            var adminRes = await admin.GetAsync("/api/users");
            Assert.Equal(HttpStatusCode.OK, adminRes.StatusCode);
        }

        [Fact]
        public async Task RoleChange_ToAdmin_Returns400()
        {
            var admin = await TestHelpers.AdminClientAsync(_factory);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);

            var users = await admin.GetFromJsonAsync<List<Dictionary<string, object>>>("/api/users");
            var buyerRow = users!.First(u => u["email"].ToString()!.Contains("@test.local"));

            var res = await admin.PutAsJsonAsync(
                $"/api/users/{TestHelpers.IdOf(buyerRow)}/role", new { role = "admin" });
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }

        [Fact]
        public async Task RoleChange_SelfDemote_Returns400()
        {
            var admin = await TestHelpers.AdminClientAsync(_factory);
            var res = await admin.PutAsJsonAsync("/api/users/999/role", new { role = "buyer" });
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }
    }
}
