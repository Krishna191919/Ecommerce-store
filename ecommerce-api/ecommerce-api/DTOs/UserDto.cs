namespace ecommerce_api.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public int ProductCount { get; set; }
        public int OrderCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ChangeRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }
}
