using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ecommerce_api.Data;
using ecommerce_api.DTOs;
using ecommerce_api.Models;

namespace ecommerce_api.Controllers
{
    [Route("api/vendor-applications")]
    [ApiController]
    public class VendorApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VendorApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // POST: api/vendor-applications  (buyers only)
        [Authorize(Roles = "buyer")]
        [HttpPost]
        public async Task<ActionResult<VendorApplicationStatusDto>> Apply(VendorApplicationCreateDto request)
        {
            var userId = GetUserId();

            var hasPending = await _context.VendorApplications
                .AnyAsync(v => v.UserId == userId && v.Status == "pending");

            if (hasPending)
                return BadRequest(new { message = "You already have a pending application. Please wait for admin review." });

            var application = new VendorApplication
            {
                UserId = userId,
                StoreName = request.StoreName,
                PhoneNumber = request.PhoneNumber,
                Reason = request.Reason,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.VendorApplications.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMine), new { }, new VendorApplicationStatusDto
            {
                Id = application.Id,
                StoreName = application.StoreName,
                Status = application.Status,
                CreatedAt = application.CreatedAt,
                ReviewNote = application.ReviewNote
            });
        }

        // GET: api/vendor-applications/mine  (applicant's own applications)
        [Authorize]
        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<VendorApplicationStatusDto>>> GetMine()
        {
            var applications = await _context.VendorApplications
                .Where(v => v.UserId == GetUserId())
                .OrderByDescending(v => v.CreatedAt)
                .Select(v => new VendorApplicationStatusDto
                {
                    Id = v.Id,
                    StoreName = v.StoreName,
                    Status = v.Status,
                    CreatedAt = v.CreatedAt,
                    ReviewNote = v.ReviewNote
                })
                .ToListAsync();

            return Ok(applications);
        }

        // GET: api/vendor-applications?status=pending  (admin only)
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendorApplicationDto>>> GetAll([FromQuery] string? status)
        {
            var query = _context.VendorApplications
                .Include(v => v.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(v => v.Status == status);

            var applications = await query
                .OrderBy(v => v.Status == "pending" ? 0 : 1)
                .ThenByDescending(v => v.CreatedAt)
                .Select(v => new VendorApplicationDto
                {
                    Id = v.Id,
                    UserId = v.UserId,
                    UserName = v.User.FullName,
                    UserEmail = v.User.Email,
                    StoreName = v.StoreName,
                    PhoneNumber = v.PhoneNumber,
                    Reason = v.Reason,
                    Status = v.Status,
                    CreatedAt = v.CreatedAt,
                    ReviewNote = v.ReviewNote
                })
                .ToListAsync();

            return Ok(applications);
        }

        // PUT: api/vendor-applications/5/review  (admin only)
        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}/review")]
        public async Task<IActionResult> Review(int id, VendorApplicationReviewDto request)
        {
            var application = await _context.VendorApplications
                .Include(v => v.User)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (application == null)
                return NotFound();

            if (application.Status != "pending")
                return BadRequest(new { message = "This application has already been reviewed." });

            application.Status = request.Status;
            application.ReviewNote = request.Note;
            application.ReviewedAt = DateTime.UtcNow;

            // Approving promotes the applicant to vendor so they can sell products.
            if (request.Status == "approved" && application.User != null)
                application.User.Role = "vendor";

            await _context.SaveChangesAsync();

            return Ok(new { id = application.Id, status = application.Status });
        }
    }
}
