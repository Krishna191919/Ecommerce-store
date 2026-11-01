using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using ecommerce_api.Data;
using ecommerce_api.DTOs;
using ecommerce_api.Services;

namespace ecommerce_api.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IPaymentService _paymentService;

        public PaymentsController(
            AppDbContext context,
            IConfiguration configuration,
            ILogger<PaymentsController> logger,
            IPaymentService paymentService)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _paymentService = paymentService;
        }

        private static bool StripeConfigured() =>
            !string.IsNullOrWhiteSpace(StripeConfiguration.ApiKey);

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // POST: api/payments/order-intent/5
        // Gets the Stripe clientSecret for the order's payment (owner only).
        [Authorize]
        [HttpPost("order-intent/{orderId:int}")]
        public async Task<ActionResult<PaymentIntentResultDto>> GetOrderIntent(int orderId)
        {
            if (!StripeConfigured())
                return StatusCode(503, new { message = "Stripe is not configured on the server." });

            var order = await _context.Orders.Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == GetUserId());

            if (order == null)
                return NotFound(new { message = "Order not found" });

            if (order.Status == "paid")
                return Ok(new PaymentIntentResultDto { OrderId = order.Id, Status = "paid" });

            try
            {
                var intent = await _paymentService.EnsureIntentAsync(order);
                return Ok(new PaymentIntentResultDto
                {
                    OrderId = order.Id,
                    Status = order.Status,
                    ClientSecret = intent.ClientSecret,
                    Amount = order.TotalAmount,
                    Currency = (_configuration["Stripe:Currency"] ?? "usd").ToUpper()
                });
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe error for order {OrderId}", orderId);
                return StatusCode(502, new { message = "Payment provider error. Please try again later." });
            }
        }

        // POST: api/payments/webhook
        // Stripe calls this asynchronously after payment events. Must be
        // anonymous but verifies the Stripe signature header.
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var webhookSecret = _configuration["Stripe:WebhookSecret"];

            if (string.IsNullOrWhiteSpace(webhookSecret))
            {
                _logger.LogError("Stripe webhook called but WebhookSecret is not configured");
                return StatusCode(500);
            }

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    webhookSecret
                );
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Rejected webhook with invalid signature");
                return BadRequest(new { message = "Invalid webhook signature" });
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.PaymentIntentSucceeded:
                {
                    var intent = stripeEvent.Data.Object as PaymentIntent;
                    var order = await _context.Orders.FirstOrDefaultAsync(
                        o => o.PaymentIntentId == intent!.Id);

                    if (order == null)
                    {
                        _logger.LogWarning(
                            "Payment intent {IntentId} succeeded but no matching order", intent!.Id);
                        break;
                    }

                    // Idempotency: webhooks may fire more than once.
                    if (order.Status != "paid")
                    {
                        order.Status = "paid";
                        order.PaidAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                        _logger.LogInformation(
                            "Order {OrderId} marked paid via webhook", order.Id);
                    }
                    break;
                }

                case EventTypes.PaymentIntentPaymentFailed:
                {
                    var intent = stripeEvent.Data.Object as PaymentIntent;
                    var order = await _context.Orders.FirstOrDefaultAsync(
                        o => o.PaymentIntentId == intent!.Id);

                    // Order stays pending so the customer can retry payment.
                    _logger.LogInformation(
                        "Payment failed for order {OrderId}, customer can retry",
                        order?.Id ?? 0);
                    break;
                }
            }

            return Ok();
        }
    }

    public class PaymentIntentResultDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ClientSecret { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
    }
}
