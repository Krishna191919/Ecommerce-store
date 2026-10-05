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
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        private IQueryable<CartItem> UserCart() =>
            _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == GetUserId());

        private static CartItemDto ToDto(CartItem item) => new()
        {
            Id = item.Id,
            ProductId = item.ProductId,
            Title = item.Product.Title,
            Price = item.Product.Price,
            Image = item.Product.ImageUrl ?? "",
            Quantity = item.Quantity
        };

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
        {
            var items = await UserCart().ToListAsync();
            return Ok(items.Select(ToDto));
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<CartItemDto>> AddToCart(AddToCartDto request)
        {
            var userId = GetUserId();
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            if (product.VendorId == userId && !User.IsInRole("admin"))
                return BadRequest(new { message = "You cannot buy your own product" });

            if (request.Quantity < 1)
                return BadRequest(new { message = "Quantity must be at least 1" });

            var existing = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId);

            if (existing != null)
            {
                existing.Quantity += request.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(cartItem);
                existing = cartItem;
            }

            await _context.SaveChangesAsync();

            var item = await UserCart().FirstAsync(c => c.Id == existing.Id);
            return Ok(ToDto(item));
        }

        // PUT: api/cart/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, UpdateCartDto request)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());

            if (item == null)
                return NotFound();

            if (request.Quantity <= 0)
            {
                _context.CartItems.Remove(item);
            }
            else
            {
                item.Quantity = request.Quantity;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());

            if (item == null)
                return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var items = await _context.CartItems
                .Where(c => c.UserId == GetUserId())
                .ToListAsync();

            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
