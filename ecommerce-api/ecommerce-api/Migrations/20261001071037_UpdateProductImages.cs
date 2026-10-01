using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecommerce_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9138), "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9143), "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9146), "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9148), "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9151), "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9153), "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9156), "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9158), "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9161), "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9163), "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9202));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8447), "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8451), "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8454), "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8458), "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8461), "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8464), "https://fakestoreapi.com/img/61U7TmxkoCx._AC_UX679_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8467), "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8513), "https://fakestoreapi.com/img/81Zt42IQuatL._AC_SX679_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8517), "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8520), "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 9, 30, 3, 42, 45, 525, DateTimeKind.Utc).AddTicks(8564));
        }
    }
}
