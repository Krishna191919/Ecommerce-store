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

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Price = p.Price,
                    Description = p.Description ?? "",
                    Category = p.Category.Name,
                    CategoryId = p.CategoryId,
                    Image = p.ImageUrl ?? "",
                    Rating = new RatingDto
                    {
                        Rate = p.Rating,
                        Count = p.RatingCount
                    }
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Price = p.Price,
                    Description = p.Description ?? "",
                    Category = p.Category.Name,
                    CategoryId = p.CategoryId,
                    Image = p.ImageUrl ?? "",
                    Rating = new RatingDto
                    {
                        Rate = p.Rating,
                        Count = p.RatingCount
                    }
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST: api/products
        [Authorize(Roles = "admin")]
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
                Rating = request.Rating,
                RatingCount = request.RatingCount,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var dto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Price = product.Price,
                Description = product.Description ?? "",
                Category = category.Name,
                CategoryId = category.Id,
                Image = product.ImageUrl ?? "",
                Rating = new RatingDto { Rate = product.Rating, Count = product.RatingCount }
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, dto);
        }

        // PUT: api/products/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductCreateDto request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

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
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/products/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
