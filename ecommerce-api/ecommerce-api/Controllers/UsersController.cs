using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ecommerce_api.Data;
using ecommerce_api.DTOs;

namespace ecommerce_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.Id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                    PhoneNumber = u.PhoneNumber,
                    ProductCount = u.Products.Count,
                    OrderCount = u.Orders.Count,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // PUT: api/users/5/role
        // Roles can only be switched between buyer and vendor. The single admin
        // account comes from the database seed and cannot be granted here.
        [HttpPut("{id:int}/role")]
        public async Task<IActionResult> ChangeRole(int id, ChangeRoleDto request)
        {
            var allowed = new[] { "buyer", "vendor" };
            if (!allowed.Contains(request.Role))
                return BadRequest(new { message = "Role must be 'buyer' or 'vendor'. The admin account is fixed and cannot be granted or revoked." });

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            if (user.Id == GetUserId() && request.Role != "admin")
                return BadRequest(new { message = "You cannot demote your own account." });

            if (user.Role == "admin" && request.Role != "admin" &&
                await _context.Users.CountAsync(u => u.Role == "admin") <= 1)
                return BadRequest(new { message = "At least one admin must remain." });

            user.Role = request.Role;
            await _context.SaveChangesAsync();

            return Ok(new { id = user.Id, role = user.Role });
        }
    }
}
