import { useRef, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { ToastContext } from "../context/ToastContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, apiFetch } from "../utils/auth";
import { injectStripe, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe automatically when module initializes, using the publishable key
// from the React app env. If the key is empty/invalid, stripe will be falsy.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "", {
  // Ensure Stripe can place holders for our hosted elements.
  cardholderBillingAddressOptions: {
    enabled: true
  }
});

const Cartpage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } =
    useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Create or retrieve a PaymentIntent for this order on the server
  const createPaymentIntent = async (orderId) => {
    const res = await apiFetch("/api/payments/order-intent/${orderId}", {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      setPaymentError(err.message || "Failed to create payment intent");
      return null;
    }
    return (await res.json()).clientSecret;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setPaymentError("Stripe not initialized — check your VITE_STRIPE_PUBLISHABLE_KEY");
      return;
    }
    setIsLoadingPayment(true);
    setPaymentError(null);
    try {
      // Get the latest order or fetch one from MyOrders
      const res = await apiFetch("/api/orders");
      if (!res.ok) throw new Error("Could not fetch orders");
      const orders = await res.json();
      const order = orders[0];
      if (!order) throw new Error("No orders found");

      // Create/retrieve PaymentIntent clientSecret
      const clientSecret = await createPaymentIntent(order.id);
      if (!clientSecret) throw new Error("No client secret");

      // Confirm the payment using Stripe Elements
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Submit billing address same as checkout form
          billing_details: {
            name: getUser()?.fullName || "",
            email: getUser()?.email || "",
            phone: getUser()?.phoneNumber || "",
            address: {
              line1: address,
              city: "",
              state: "",
              postal_code: "",
              country: ""
            }
          },
          return_url: window.location.origin + "/"
        },
        // Wait for the customer to complete authentication (3DS) before failing
        redirect: "if_needed"
      });

      // If the user aborts or 3DS is needed, result will be pending
      if (result.error) {
        setPaymentError(result.error.message);
      }
    } catch (err) {
      console.error(err);
      setPaymentError(err.message || "Payment failed");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn()) {
      showToast("Please sign in to checkout", "info");
      navigate("/signin");
      return;
    }
    setShowCheckout(true);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FaShoppingCart className="text-6xl text-gray-300" />
        <h2 className="text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <p className="text-gray-500">Add some products to get started!</p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // If we have a pending payment error, show it above the cart
  const paymentErrorBanner = paymentError ? (
    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg" role="alert">
      <span className="font-bold">Payment error:</span> {paymentError}
    </div>
  ) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {paymentErrorBanner}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h2>
        <button
          onClick={clearCart}
          className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {item.title}
              </h3>
              <p className="text-blue-600 font-bold mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
            <p className="text-gray-800 font-bold w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-600">Subtotal</span>
          <span className="text-lg font-semibold">
            ${getTotal().toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-600">Shipping</span>
          <span className="text-lg font-semibold text-green-600">Free</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-blue-600">
            ${getTotal().toFixed(2)}
          </span>
        </div>

        {stripe && elements ? (
          <div>
            {paymentError && <div className="mb-3 p-3 bg-red-100 text-red-800 rounded-lg" role="alert">{paymentError}</div>}
            <button
              onClick={handleCheckout}
              disabled={isLoadingPayment}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoadingPayment ? "Processing Payment..." : "Pay Now"}
            </button>
            {/* Stripe PaymentElement renders inside this container */}
            <div className="p-4 bg-gray-50 rounded-lg" style={{ minHeight: "150px" }} />
          </div>
        ) : (
          <button
            onClick={handleCheckoutClick}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cartpage;
