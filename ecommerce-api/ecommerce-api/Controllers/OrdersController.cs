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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        private static OrderDto ToDto(Order order) => new()
        {
            Id = order.Id,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                Title = oi.Product.Title,
                Image = oi.Product.ImageUrl ?? "",
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        };

        // POST: api/orders/checkout
        [HttpPost("checkout")]
        public async Task<ActionResult<OrderDto>> Checkout(CheckoutDto request)
        {
            var userId = GetUserId();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest(new { message = "Cart is empty" });

            var ownsCartItems = cartItems.Any(c => c.Product.VendorId == userId);
            if (ownsCartItems && !User.IsInRole("admin"))
                return BadRequest(new { message = "You cannot buy your own product" });

            var order = new Order
            {
                UserId = userId,
                Status = "pending",
                ShippingAddress = request.ShippingAddress,
                TotalAmount = cartItems.Sum(c => c.Product.Price * c.Quantity),
                CreatedAt = DateTime.UtcNow,
                OrderItems = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    Price = c.Product.Price
                }).ToList()
            };

            _context.Orders.Add(order);

            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            var result = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstAsync(o => o.Id == order.Id);

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, ToDto(result));
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == GetUserId())
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders.Select(ToDto));
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == GetUserId());

            if (order == null)
                return NotFound();

            return Ok(ToDto(order));
        }

        // GET: api/orders/all  (admin sees every user's orders)
        [Authorize(Roles = "admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<AdminOrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders.Select(ToAdminDto));
        }

        // PUT: api/orders/5/status  (admin updates fulfilment status)
        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { id = order.Id, status = order.Status });
        }

        private static AdminOrderDto ToAdminDto(Order order) => new()
        {
            Id = order.Id,
            UserId = order.UserId,
            CustomerName = order.User?.FullName ?? "",
            CustomerEmail = order.User?.Email ?? "",
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                Title = oi.Product.Title,
                Image = oi.Product.ImageUrl ?? "",
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        };
    }
}
