using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecommerce_api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 10);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9191), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9194), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9197), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9199), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9201), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9204), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9206), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9208), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9210), 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Stock" },
                values: new object[] { new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9213), 10 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9248));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6112));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6116));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6120));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6123));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6126));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6130));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6133));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6136));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6139));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6142));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 5, 2, 55, 13, 759, DateTimeKind.Utc).AddTicks(6181));
        }
    }
}
