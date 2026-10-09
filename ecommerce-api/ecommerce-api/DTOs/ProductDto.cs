namespace ecommerce_api.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int Stock { get; set; }
        public bool InStock => Stock > 0;
        public RatingDto Rating { get; set; } = null!;
    }

    public class RatingDto
    {
        public double Rate { get; set; }
        public int Count { get; set; }
    }
}
