using Stripe;
using ecommerce_api.Data;
using ecommerce_api.Models;

namespace ecommerce_api.Services
{
    public interface IPaymentService
    {
        // Creates a PaymentIntent for the order if none exists yet, or returns
        // the existing one so the customer can retry a failed payment.
        Task<PaymentIntent> EnsureIntentAsync(Order order);
    }

    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<PaymentIntent> EnsureIntentAsync(Order order)
        {
            var intentService = new PaymentIntentService();

            if (!string.IsNullOrEmpty(order.PaymentIntentId))
            {
                var existing = await intentService.GetAsync(order.PaymentIntentId);
                return existing;
            }

            var createOptions = new PaymentIntentCreateOptions
            {
                // Amount always comes from the server-side order total, never
                // from the client — a core payment-security rule.
                Amount = Convert.ToInt64(order.TotalAmount * 100),
                Currency = _configuration["Stripe:Currency"] ?? "usd",
                AutomaticPaymentMethods =
                    new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
                Metadata = new Dictionary<string, string>
                {
                    ["orderId"] = order.Id.ToString(),
                    ["userId"] = order.UserId.ToString()
                }
            };

            var intent = await intentService.CreateAsync(createOptions);

            order.PaymentIntentId = intent.Id;
            await _context.SaveChangesAsync();

            return intent;
        }
    }
}
