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

            // Reserve stock atomically. The conditional UPDATE only succeeds
            // when enough stock remains, so concurrent checkouts cannot sell
            // the same unit twice (no read-modify-write race).
            await using var transaction = await _context.Database.BeginTransactionAsync();

            var reservations = cartItems
                .GroupBy(c => c.ProductId)
                .Select(g => new { g.Key, Quantity = g.Sum(c => c.Quantity) })
                .ToList();

            foreach (var reservation in reservations)
            {
                var product = cartItems.First(c => c.ProductId == reservation.Key).Product;
                var affected = await _context.Products
                    .Where(p => p.Id == reservation.Key && p.Stock >= reservation.Quantity)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(p => p.Stock, p => p.Stock - reservation.Quantity));

                if (affected == 0)
                {
                    await transaction.RollbackAsync();
                    var available = await _context.Products
                        .Where(p => p.Id == reservation.Key)
                        .Select(p => p.Stock)
                        .FirstOrDefaultAsync();
                    return BadRequest(new
                    {
                        message = available < 1
                            ? $"\"{product.Title}\" is out of stock"
                            : $"Only {available} left of \"{product.Title}\""
                    });
                }
            }

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
            await transaction.CommitAsync();

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
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();

            var previousStatus = order.Status;

            if (request.Status == "cancelled" && previousStatus != "cancelled")
            {
                // Returning items to inventory; the conditional UPDATE keeps
                // stock from going negative if a product was edited meanwhile.
                foreach (var item in order.OrderItems)
                {
                    await _context.Products
                        .Where(p => p.Id == item.ProductId)
                        .ExecuteUpdateAsync(s => s
                            .SetProperty(p => p.Stock, p => p.Stock + item.Quantity));
                }
            }
            else if (previousStatus == "cancelled" && request.Status != "cancelled")
            {
                // Re-opening a cancelled order re-takes the stock; refuse if
                // units were sold out in the meantime.
                foreach (var item in order.OrderItems)
                {
                    var affected = await _context.Products
                        .Where(p => p.Id == item.ProductId && p.Stock >= item.Quantity)
                        .ExecuteUpdateAsync(s => s
                            .SetProperty(p => p.Stock, p => p.Stock - item.Quantity));
                    if (affected == 0)
                        return BadRequest(new { message = "Cannot re-open: insufficient stock for one or more items." });
                }
            }

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
