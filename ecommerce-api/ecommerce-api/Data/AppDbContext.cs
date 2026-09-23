using Microsoft.EntityFrameworkCore;
using ecommerce_api.Models;
namespace ecommerce_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Category>().HasData(
    new Category { Id = 1, Name = "men's clothing", Description = "Clothing for men" },
    new Category { Id = 2, Name = "jewelery", Description = "Jewelry and accessories" },
    new Category { Id = 3, Name = "electronics", Description = "Electronic devices and gadgets" },
    new Category { Id = 4, Name = "women's clothing", Description = "Clothing for women" }
);
            modelBuilder.Entity<Product>().HasData(
    new Product
    {
        Id = 1,
        Title = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        Description = "Your perfect pack for everyday use and walks in the forest. Sturdy 12oz fabric, double-sided cover and stitched flap and detail.",
        Price = 109.95m,
        ImageUrl = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        CategoryId = 1,
        Rating = 3.9,
        RatingCount = 120,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 2,
        Title = "Mens Casual Premium Slim Fit T-Shirts",
        Description = "Slim-fitting style, contrast raglan sleeve set-in sleeve for freedom of movement and casual comfort.",
        Price = 22.3m,
        ImageUrl = "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        CategoryId = 1,
        Rating = 4.1,
        RatingCount = 259,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 3,
        Title = "Mens Cotton Jacket",
        Description = "Great outerwear jackets for spring/autumn/winter, suitable for many occasions.",
        Price = 55.99m,
        ImageUrl = "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        CategoryId = 1,
        Rating = 4.7,
        RatingCount = 500,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 4,
        Title = "John Hardy Women's Gold & Silver Dragon Bracelet",
        Description = "Inspired by the mythical water dragon that protects the ocean's pearl.",
        Price = 695.0m,
        ImageUrl = "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        CategoryId = 2,
        Rating = 4.6,
        RatingCount = 400,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 5,
        Title = "WD 2TB Elements Portable External Hard Drive",
        Description = "USB 3.0 and USB 2.0 compatible, fast data transfers, improve PC performance.",
        Price = 64.0m,
        ImageUrl = "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        CategoryId = 3,
        Rating = 3.3,
        RatingCount = 203,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 6,
        Title = "WD 4TB Gaming Drive Works with Xbox",
        Description = "Expand your PS4 gaming experience, play games fast with this compact and soft external hard drive.",
        Price = 114.0m,
        ImageUrl = "https://fakestoreapi.com/img/61U7TmxkoCx._AC_UX679_.jpg",
        CategoryId = 3,
        Rating = 4.8,
        RatingCount = 400,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 7,
        Title = "Acer SB220Q bi 21.5 Full HD Monitor",
        Description = "21.5 inches Full HD (1920 x 1080) IPS ultra-thin monitor, 4ms response time, widescreen IPS.",
        Price = 599.0m,
        ImageUrl = "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg",
        CategoryId = 3,
        Rating = 2.9,
        RatingCount = 250,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 8,
        Title = "Samsung 49' Curved LED Gaming Monitor",
        Description = "Super ultrawide view, 32:9 aspect ratio, 1800R curve for immersive experience.",
        Price = 999.99m,
        ImageUrl = "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg",
        CategoryId = 3,
        Rating = 2.2,
        RatingCount = 140,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 9,
        Title = "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
        Description = "Detachable liner waterproof winter coat, casual warm outwear with hood.",
        Price = 56.99m,
        ImageUrl = "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        CategoryId = 4,
        Rating = 2.6,
        RatingCount = 235,
        CreatedAt = DateTime.UtcNow
    },
    new Product
    {
        Id = 10,
        Title = "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
        Description = "100% polyurethane, 100% polyester lining, zippered detail, lightweight and comfortable.",
        Price = 29.95m,
        ImageUrl = "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
        CategoryId = 4,
        Rating = 2.9,
        RatingCount = 340,
        CreatedAt = DateTime.UtcNow
    }
);


            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<CartItem>()
                .HasIndex(c => new { c.UserId, c.ProductId })
                .IsUnique();
        }
    }
}
