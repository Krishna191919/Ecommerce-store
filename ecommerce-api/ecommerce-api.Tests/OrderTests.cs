using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class OrderTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public OrderTests(EcommerceApiFactory factory) => _factory = factory;

        private static async Task SeedCartAsync(HttpClient client, int productId = 1, int quantity = 1)
        {
            var res = await client.PostAsJsonAsync("/api/cart", new { productId, quantity });
            res.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task Checkout_EmptyCart_Returns400()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            var res = await client.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "nowhere" });
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }

        [Fact]
        public async Task Checkout_CreatesOrder_AndClearsCart()
        {
            var (client, _) = await TestHelpers.BuyerClientAsync(_factory);
            await SeedCartAsync(client);

            var checkout = await client.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "12 Test Lane" });
            Assert.Equal(HttpStatusCode.Created, checkout.StatusCode);

            var orders = await client.GetFromJsonAsync<List<Dictionary<string, object>>>("/api/orders");
            Assert.Single(orders!);

            var cart = await client.GetFromJsonAsync<List<Dictionary<string, object>>>("/api/cart");
            Assert.Empty(cart!);
        }

        [Fact]
        public async Task OrdersList_IsScopedToCurrentUser()
        {
            var (buyerA, _) = await TestHelpers.BuyerClientAsync(_factory);
            await SeedCartAsync(buyerA);
            var checkout = await buyerA.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "A Street" });
            Assert.Equal(HttpStatusCode.Created, checkout.StatusCode);

            var (buyerB, _) = await TestHelpers.BuyerClientAsync(_factory, "other");
            var ordersB = await buyerB.GetFromJsonAsync<List<Dictionary<string, object>>>("/api/orders");
            Assert.Empty(ordersB!);
        }

        [Fact]
        public async Task Admin_UpdateStatus_Valid_Returns200_Invalid_Returns400()
        {
            var (buyer, _) = await TestHelpers.BuyerClientAsync(_factory);
            await SeedCartAsync(buyer);
            var checkout = await buyer.PostAsJsonAsync("/api/orders/checkout",
                new { shippingAddress = "B Street" });
            var order = await checkout.Content.ReadFromJsonAsync<Dictionary<string, object>>();
            var orderId = TestHelpers.IdOf(order!);

            var admin = await TestHelpers.AdminClientAsync(_factory);

            var ok = await admin.PutAsJsonAsync($"/api/orders/{orderId}/status",
                new { status = "shipped" });
            Assert.Equal(HttpStatusCode.OK, ok.StatusCode);

            var bad = await admin.PutAsJsonAsync($"/api/orders/{orderId}/status",
                new { status = "exploded" });
            Assert.Equal(HttpStatusCode.BadRequest, bad.StatusCode);
        }

        [Fact]
        public async Task Category_DeleteWithProducts_Returns400()
        {
            var admin = await TestHelpers.AdminClientAsync(_factory);
            var res = await admin.DeleteAsync("/api/categories/1");
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }
    }
}
