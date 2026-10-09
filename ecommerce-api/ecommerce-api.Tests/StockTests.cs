using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class StockTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public StockTests(EcommerceApiFactory factory) => _factory = factory;

        // Vendor creates their own product with an explicit stock level.
        private async Task<(HttpClient Vendor, int ProductId)> VendorWithProductAsync(int stock)
        {
            var (vendor, _) = await TestHelpers.VendorClientAsync(_factory);
            var created = await vendor.PostAsJsonAsync("/api/products", new
            {
                title = $"stock widget {Guid.NewGuid():N}",
                price = 5m,
                description = "d",
                categoryId = 1,
                imageUrl = "https://example.com/x.png",
                rating = 4,
                ratingCount = 1,
                stock
            });
            created.EnsureSuccessStatusCode();
            var product = await created.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            return (vendor, TestHelpers.IdOf(product!));
        }

        private async Task<int> GetStockAsync(int productId)
        {
            var anon = _factory.CreateClient();
            var product = await anon.GetFromJsonAsync<Dictionary<string, object>>($"/api/products/{productId}");
            return int.Parse(product!["stock"].ToString()!);
        }

        [Fact]
        public async Task AddToCart_QuantityExceedsStock_Returns400()
        {
            var (_, productId) = await VendorWithProductAsync(2);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);

            var res = await buyer.PostAsJsonAsync("/api/cart",
                new { productId, quantity = 3 });

            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }

        [Fact]
        public async Task AddToCart_OutOfStock_Returns400WithMessage()
        {
            var (_, productId) = await VendorWithProductAsync(0);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);

            var res = await buyer.PostAsJsonAsync("/api/cart",
                new { productId, quantity = 1 });

            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
            var body = await res.Content.ReadFromJsonAsync<Dictionary<string, string>>();
            Assert.Contains("out of stock", body!["message"], StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task Checkout_InsufficientStock_Returns400_AndRollsBack()
        {
            var (vendor, productId) = await VendorWithProductAsync(5);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);
            var add = await buyer.PostAsJsonAsync("/api/cart", new { productId, quantity = 5 });
            add.EnsureSuccessStatusCode();

            // Shrink stock after the item is already in the cart.
            var shrink = await vendor.PutAsJsonAsync($"/api/products/{productId}", new
            {
                title = "stock widget",
                price = 5m,
                description = "d",
                categoryId = 1,
                imageUrl = "https://example.com/x.png",
                rating = 4,
                ratingCount = 1,
                stock = 2
            });
            shrink.EnsureSuccessStatusCode();

            var checkout = await buyer.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "12 Test Lane" });

            Assert.Equal(HttpStatusCode.BadRequest, checkout.StatusCode);
            Assert.Equal(2, await GetStockAsync(productId));

            var cart = await buyer.GetFromJsonAsync<List<Dictionary<string, object>>>("/api/cart");
            Assert.Single(cart!);
        }

        [Fact]
        public async Task Checkout_DecrementsStock()
        {
            var (_, productId) = await VendorWithProductAsync(3);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);
            await buyer.PostAsJsonAsync("/api/cart", new { productId, quantity = 2 });

            var checkout = await buyer.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "12 Test Lane" });

            Assert.Equal(HttpStatusCode.Created, checkout.StatusCode);
            Assert.Equal(1, await GetStockAsync(productId));
        }

        [Fact]
        public async Task CancelOrder_RestocksProduct()
        {
            var (_, productId) = await VendorWithProductAsync(1);
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);
            await buyer.PostAsJsonAsync("/api/cart", new { productId, quantity = 1 });

            var checkout = await buyer.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "12 Test Lane" });
            var order = await checkout.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var orderId = TestHelpers.IdOf(order!);
            Assert.Equal(0, await GetStockAsync(productId));

            var admin = await TestHelpers.AdminClientAsync(_factory);
            var cancel = await admin.PutAsJsonAsync($"/api/orders/{orderId}/status",
                new { status = "cancelled" });

            Assert.Equal(HttpStatusCode.OK, cancel.StatusCode);
            Assert.Equal(1, await GetStockAsync(productId));
        }
    }
}
