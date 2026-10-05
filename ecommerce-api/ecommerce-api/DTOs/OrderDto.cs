using System.ComponentModel.DataAnnotations;

namespace ecommerce_api.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total => Price * Quantity;
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class CheckoutDto
    {
        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        [RegularExpression("^(pending|shipped|delivered|cancelled)$", ErrorMessage = "Status must be pending, shipped, delivered or cancelled.")]
        public string Status { get; set; } = string.Empty;
    }

    // Full order detail for the admin, including customer info
    public class AdminOrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
