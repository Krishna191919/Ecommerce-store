using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ecommerce_api.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Clothing for men", "men's clothing" },
                    { 2, "Jewelry and accessories", "jewelery" },
                    { 3, "Electronic devices and gadgets", "electronics" },
                    { 4, "Clothing for women", "women's clothing" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "ImageUrl", "Price", "Rating", "RatingCount", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(467), "Your perfect pack for everyday use and walks in the forest. Sturdy 12oz fabric, double-sided cover and stitched flap and detail.", "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", 109.95m, 3.8999999999999999, 120, "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", null },
                    { 2, 1, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(470), "Slim-fitting style, contrast raglan sleeve set-in sleeve for freedom of movement and casual comfort.", "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", 22.3m, 4.0999999999999996, 259, "Mens Casual Premium Slim Fit T-Shirts", null },
                    { 3, 1, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(471), "Great outerwear jackets for spring/autumn/winter, suitable for many occasions.", "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg", 55.99m, 4.7000000000000002, 500, "Mens Cotton Jacket", null },
                    { 4, 2, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(473), "Inspired by the mythical water dragon that protects the ocean's pearl.", "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg", 695.0m, 4.5999999999999996, 400, "John Hardy Women's Gold & Silver Dragon Bracelet", null },
                    { 5, 3, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(475), "USB 3.0 and USB 2.0 compatible, fast data transfers, improve PC performance.", "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", 64.0m, 3.2999999999999998, 203, "WD 2TB Elements Portable External Hard Drive", null },
                    { 6, 3, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(477), "Expand your PS4 gaming experience, play games fast with this compact and soft external hard drive.", "https://fakestoreapi.com/img/61U7TmxkoCx._AC_UX679_.jpg", 114.0m, 4.7999999999999998, 400, "WD 4TB Gaming Drive Works with Xbox", null },
                    { 7, 3, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(478), "21.5 inches Full HD (1920 x 1080) IPS ultra-thin monitor, 4ms response time, widescreen IPS.", "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg", 599.0m, 2.8999999999999999, 250, "Acer SB220Q bi 21.5 Full HD Monitor", null },
                    { 8, 3, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(480), "Super ultrawide view, 32:9 aspect ratio, 1800R curve for immersive experience.", "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg", 999.99m, 2.2000000000000002, 140, "Samsung 49' Curved LED Gaming Monitor", null },
                    { 9, 4, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(481), "Detachable liner waterproof winter coat, casual warm outwear with hood.", "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg", 56.99m, 2.6000000000000001, 235, "BIYLACLESEN Women's 3-in-1 Snowboard Jacket", null },
                    { 10, 4, new DateTime(2026, 9, 14, 13, 53, 4, 518, DateTimeKind.Utc).AddTicks(483), "100% polyurethane, 100% polyester lining, zippered detail, lightweight and comfortable.", "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg", 29.95m, 2.8999999999999999, 340, "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
