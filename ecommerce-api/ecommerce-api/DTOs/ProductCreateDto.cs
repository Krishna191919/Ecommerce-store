using System.ComponentModel.DataAnnotations;

namespace ecommerce_api.DTOs
{
    public class ProductCreateDto
    {
        [Required]
        [MaxLength(300)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, 999999.99)]
        public decimal Price { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public double Rating { get; set; }
        public int RatingCount { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 10;
    }
}
