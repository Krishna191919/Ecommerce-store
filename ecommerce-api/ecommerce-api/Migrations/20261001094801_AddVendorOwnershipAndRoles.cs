using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ecommerce_api.Migrations
{
    /// <inheritdoc />
    public partial class AddVendorOwnershipAndRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VendorId",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            // Backfill: non-seeded products (created via API) would have VendorId = 0,
            // which has no matching Users row and would violate the FK. Assign to admin.
            migrationBuilder.Sql("UPDATE Products SET VendorId = 999 WHERE VendorId NOT IN (SELECT Id FROM Users);");

            // Rename legacy role to the new buyer role.
            migrationBuilder.Sql("UPDATE Users SET Role = 'buyer' WHERE Role = 'user';");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8274), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8278), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8282), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8285), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8288), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8291), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8294), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8297), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8300), 999 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "VendorId" },
                values: new object[] { new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8303), 999 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 9, 48, 1, 18, DateTimeKind.Utc).AddTicks(8341));

            migrationBuilder.CreateIndex(
                name: "IX_Products_VendorId",
                table: "Products",
                column: "VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Users_VendorId",
                table: "Products",
                column: "VendorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Users_VendorId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_VendorId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "VendorId",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9138));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9143));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9146));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9148));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9151));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9153));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9156));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9158));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9161));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9163));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 1, 7, 10, 36, 773, DateTimeKind.Utc).AddTicks(9202));
        }
    }
}
