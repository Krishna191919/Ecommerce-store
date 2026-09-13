import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cartpage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } =
    useContext(CartContext);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
        <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cartpage;
