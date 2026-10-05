using System.ComponentModel.DataAnnotations;

namespace ecommerce_api.DTOs
{
    public class VendorApplicationCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string StoreName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Reason { get; set; }
    }

    public class VendorApplicationReviewDto
    {
        [Required]
        [RegularExpression("^(approved|rejected)$", ErrorMessage = "Status must be 'approved' or 'rejected'.")]
        public string Status { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }
    }

    // Returned to the applicant (buyer) about their own application
    public class VendorApplicationStatusDto
    {
        public int Id { get; set; }
        public string StoreName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? ReviewNote { get; set; }
    }

    // Returned to the admin, includes applicant info
    public class VendorApplicationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string StoreName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? ReviewNote { get; set; }
    }
}
