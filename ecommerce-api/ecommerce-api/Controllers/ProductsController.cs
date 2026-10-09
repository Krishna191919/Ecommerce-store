using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ecommerce_api.Data;
using ecommerce_api.DTOs;
using ecommerce_api.Models;

namespace ecommerce_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        private bool IsAdmin() =>
            User.IsInRole("admin");

        private bool CanManage(Product product) =>
            IsAdmin() || product.VendorId == GetUserId();

        private IQueryable<Product> WithDetails() =>
            _context.Products
                .Include(p => p.Category)
                .Include(p => p.Vendor);

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            var products = await WithDetails().ToListAsync();
            return Ok(products.Select(ToDto));
        }

        // GET: api/products/mine
        [Authorize(Roles = "admin,vendor")]
        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyProducts()
        {
            var userId = GetUserId();
            var query = WithDetails();

            if (!IsAdmin())
                query = query.Where(p => p.VendorId == userId);

            var products = await query.ToListAsync();
            return Ok(products.Select(ToDto));
        }

        // GET: api/products/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await WithDetails()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(ToDto(product));
        }

        // POST: api/products
        [Authorize(Roles = "admin,vendor")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto request)
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
                return BadRequest(new { message = "Category not found" });

            var product = new Product
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId,
                VendorId = GetUserId(),
                Rating = request.Rating,
                RatingCount = request.RatingCount,
                Stock = request.Stock,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var created = await WithDetails().FirstAsync(p => p.Id == product.Id);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, ToDto(created));
        }

        // PUT: api/products/5
        [Authorize(Roles = "admin,vendor")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductCreateDto request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            if (!CanManage(product))
                return Forbid();

            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
                return BadRequest(new { message = "Category not found" });

            product.Title = request.Title;
            product.Description = request.Description;
            product.Price = request.Price;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = request.CategoryId;
            product.Rating = request.Rating;
            product.RatingCount = request.RatingCount;
            product.Stock = request.Stock;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/products/5
        [Authorize(Roles = "admin,vendor")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            if (!CanManage(product))
                return Forbid();

            var hasOrderItems = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
            if (hasOrderItems)
                return BadRequest(new { message = "Cannot delete a product that has been ordered" });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static ProductDto ToDto(Product p) => new()
        {
            Id = p.Id,
            Title = p.Title,
            Price = p.Price,
            Description = p.Description ?? "",
            Category = p.Category.Name,
            CategoryId = p.CategoryId,
            VendorId = p.VendorId,
            VendorName = p.Vendor?.FullName ?? "",
            Image = p.ImageUrl ?? "",
            Stock = p.Stock,
            Rating = new RatingDto
            {
                Rate = p.Rating,
                Count = p.RatingCount
            }
        };
    }
}
