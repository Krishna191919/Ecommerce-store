using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecommerce_api.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PaidAt",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentIntentId",
                table: "Orders",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8479));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8482));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8488));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8490));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8493));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8495));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8497));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8500));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8502));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8504));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 20, 16, 10, 26, 202, DateTimeKind.Utc).AddTicks(8594));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaidAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentIntentId",
                table: "Orders");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9191));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9194));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9197));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9199));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9201));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9204));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9206));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9208));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9210));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9213));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 9, 7, 2, 18, 126, DateTimeKind.Utc).AddTicks(9248));
        }
    }
}
