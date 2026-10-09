using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class CartTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public CartTests(EcommerceApiFactory factory) => _factory = factory;

        [Fact]
        public async Task Vendor_AddOwnProduct_Returns400WithMessage()
        {
            var (client, _) = await TestHelpers.VendorClientAsync(_factory);
            var created = await client.PostAsJsonAsync("/api/products", new
            {
                title = "vendor widget",
                price = 5m,
                description = "d",
                categoryId = 1,
                imageUrl = "https://example.com/x.png",
                rating = 4,
                ratingCount = 1
            });
            var product = await created.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var ownId = TestHelpers.IdOf(product!);

            var res = await client.PostAsJsonAsync("/api/cart",
                new { productId = ownId, quantity = 1 });

            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
            var body = await res.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.Contains("own product", body!["message"], StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task Vendor_AddOthersProduct_Returns200()
        {
            var (client, _) = await TestHelpers.VendorClientAsync(_factory);
            // Product 1 belongs to the admin, not this vendor.
            var res = await client.PostAsJsonAsync("/api/cart", new { productId = 1, quantity = 1 });
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task Admin_AddOwnSeededProduct_IsExempt_Returns200()
        {
            var admin = await TestHelpers.AdminClientAsync(_factory);
            // Admin owns all seeded products; the block must not apply.
            var res = await admin.PostAsJsonAsync("/api/cart", new { productId = 1, quantity = 1 });
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task Add_NonexistentProduct_Returns404()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var res = await client.PostAsJsonAsync("/api/cart", new { productId = 99999, quantity = 1 });
            Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
        }
    }
}
