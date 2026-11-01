using System.Net.Http.Json;
using Xunit;

namespace ecommerce_api.Tests
{
    public class SearchTests : IClassFixture<EcommerceApiFactory>
    {
        private readonly EcommerceApiFactory _factory;

        public SearchTests(EcommerceApiFactory factory) => _factory = factory;

        private async Task<Paged> SearchAsync(string query = "")
        {
            var client = _factory.CreateClient();
            var res = await client.GetAsync($"/api/products/search?{query}");
            res.EnsureSuccessStatusCode();
            return (await res.Content.ReadFromJsonAsync<Paged>())!;
        }

        [Fact]
        public async Task Search_ByTitle_FiltersResults()
        {
            var all = await SearchAsync("pageSize=50");
            var term = all.Items[0].Title.Split(' ')[0];

            var filtered = await SearchAsync($"search={Uri.EscapeDataString(term)}&pageSize=50");

            Assert.NotEmpty(filtered.Items);
            Assert.All(filtered.Items, p =>
                Assert.Contains(term, p.Title, StringComparison.OrdinalIgnoreCase));
            Assert.True(filtered.Total < all.Total);
        }

        [Fact]
        public async Task Search_ByCategory_FiltersResults()
        {
            var filtered = await SearchAsync("categoryId=4&pageSize=50");
            Assert.NotEmpty(filtered.Items);
            Assert.All(filtered.Items, p => Assert.Equal(4, p.CategoryId));
        }

        [Fact]
        public async Task Search_PriceAsc_ReturnsOrderedResults()
        {
            var filtered = await SearchAsync("sortBy=price&sortDir=asc&pageSize=50");
            var prices = filtered.Items.Select(p => p.Price).ToList();
            Assert.Equal(prices.OrderBy(p => p), prices);
        }

        [Fact]
        public async Task Search_Pagination_ReturnsPageEnvelope()
        {
            var page1 = await SearchAsync("pageSize=4&page=1");
            var page2 = await SearchAsync("pageSize=4&page=2");

            Assert.Equal(4, page1.Items.Count);
            Assert.Equal(1, page1.Page);
            Assert.Equal(page1.Total, page2.Total);
            Assert.True(page1.TotalPages >= 2);
            // Pages must not repeat the same product.
            var ids1 = page1.Items.Select(p => p.Id).ToHashSet();
            Assert.All(page2.Items, p => Assert.DoesNotContain(p.Id, ids1));
        }

        [Fact]
        public async Task Search_MinRating_FiltersResults()
        {
            var filtered = await SearchAsync("minRating=4&pageSize=50");
            Assert.NotEmpty(filtered.Items);
            Assert.All(filtered.Items, p => Assert.True(p.Rating.Rate >= 4));
        }

        private sealed class Paged
        {
            public List<Item> Items { get; set; } = new();
            public int Total { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
            public int TotalPages { get; set; }
        }

        private sealed class Item
        {
            public int Id { get; set; }
            public string Title { get; set; } = "";
            public decimal Price { get; set; }
            public int CategoryId { get; set; }
            public Rating Rating { get; set; } = new();
        }

        private sealed class Rating
        {
            public double Rate { get; set; }
            public int Count { get; set; }
        }
    }
}
