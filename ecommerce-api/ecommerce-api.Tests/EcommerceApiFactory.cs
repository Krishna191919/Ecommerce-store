using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ecommerce_api.Data;

namespace ecommerce_api.Tests
{
    // Boots the real API pipeline (auth, rate limiting, migrations, seeds)
    // against a private SQLite in-memory database, so every test class gets
    // an isolated, fully-migrated store with the seeded admin/categories.
    public class EcommerceApiFactory : WebApplicationFactory<Program>
    {
        private readonly SqliteConnection _connection = new("DataSource=:memory:");

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            _connection.Open();

            // Hermetic: never depend on the gitignored local dev secret,
            // so the suite also runs on a clean CI checkout.
            builder.UseEnvironment("Development");
            builder.UseSetting("Jwt:Secret", "integration-test-signing-key-0123456789abcdef");
            // Lift per-IP budgets: tests hammer auth endpoints by design.
            builder.UseSetting("RateLimit:AuthPermit", "1000000");
            builder.UseSetting("RateLimit:GlobalPermit", "1000000");

            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
                services.AddDbContext<AppDbContext>(options => options.UseSqlite(_connection));
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _connection.Dispose();
        }
    }
}
