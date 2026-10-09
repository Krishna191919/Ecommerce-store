using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace ecommerce_api.Tests
{
    public static class TestHelpers
    {
        public static readonly string AdminEmail = "admin@store.com";
        public static readonly string AdminPassword = "admin123";

        // Unique per call so tests never collide on registered emails.
        public static string NewEmail(string prefix = "user") =>
            $"{prefix}-{Guid.NewGuid():N}@test.local";

        public static async Task<string> RegisterAsync(
            HttpClient client, string email, string password = "secret123",
            string fullName = "Test User", string? role = null)
        {
            var res = await client.PostAsJsonAsync("/api/auth/register", new
            {
                fullName,
                email,
                password,
                role
            });
            res.EnsureSuccessStatusCode();
            var body = await res.Content.ReadFromJsonAsync<AuthResponse>();
            return body!.Token;
        }

        public static async Task<string> LoginAsync(
            HttpClient client, string email, string password)
        {
            var res = await client.PostAsJsonAsync("/api/auth/login", new { email, password });
            res.EnsureSuccessStatusCode();
            var body = await res.Content.ReadFromJsonAsync<AuthResponse>();
            return body!.Token;
        }

        // Fresh client authenticated as the seeded admin.
        public static async Task<HttpClient> AdminClientAsync(EcommerceApiFactory factory)
        {
            var client = factory.CreateClient();
            var token = await LoginAsync(client, AdminEmail, AdminPassword);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return client;
        }

        // Fresh client registered (and authenticated) as a brand-new buyer.
        public static async Task<(HttpClient Client, string Email)> BuyerClientAsync(
            EcommerceApiFactory factory, string prefix = "buyer")
        {
            var client = factory.CreateClient();
            var email = NewEmail(prefix);
            var token = await RegisterAsync(client, email);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return (client, email);
        }

        public static void UseToken(this HttpClient client, string token) =>
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Deserialized Dictionary<string, object> holds JsonElement values;
        // this extracts an int id without the compiler seeing JsonElement.
        public static int IdOf(Dictionary<string, object> row) =>
            int.Parse(row["id"].ToString()!);

        // Registers a new buyer, promotes them to vendor via the admin API,
        // then re-logs-in so the token carries the vendor role.
        public static async Task<(HttpClient Client, string Email)> VendorClientAsync(
            EcommerceApiFactory factory, string prefix = "vendor")
        {
            var client = factory.CreateClient();
            var email = NewEmail(prefix);
            var token = await RegisterAsync(client, email);
            client.UseToken(token);

            var admin = await AdminClientAsync(factory);
            var users = await admin.GetFromJsonAsync<List<UserRow>>("/api/users");
            var id = users!.Single(u => u.Email == email).Id;
            var res = await admin.PutAsJsonAsync($"/api/users/{id}/role", new { role = "vendor" });
            res.EnsureSuccessStatusCode();

            var vendor = factory.CreateClient();
            var vendorToken = await LoginAsync(vendor, email, "secret123");
            vendor.UseToken(vendorToken);
            return (vendor, email);
        }

        private sealed class AuthResponse
        {
            public string Token { get; set; } = "";
        }

        private sealed class UserRow
        {
            public int Id { get; set; }
            public string Email { get; set; } = "";
        }
    }
}
