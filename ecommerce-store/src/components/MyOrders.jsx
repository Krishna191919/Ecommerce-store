import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { apiFetch, getUser } from "../utils/auth";
import { ToastContext } from "../context/ToastContext";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useContext(ToastContext);
  const user = getUser();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch("/api/orders");
        if (!active) return;
        if (res.ok) {
          setOrders(await res.json());
        } else {
          setError("Failed to load orders");
        }
      } catch {
        if (active) setError("Failed to connect to server");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [showToast]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-center py-10">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">
                    Order #{o.id}
                  </span>
                  <span className="mx-2">·</span>
                  {new Date(o.createdAt).toLocaleString()}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    STATUS_STYLES[o.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <div className="space-y-3">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="flex-1 text-gray-800">
                      {item.title}
                      <span className="ml-2 text-gray-400">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
                <div className="text-gray-500">
                  <span className="font-semibold text-gray-700">
                    Ship to:
                  </span>{" "}
                  {o.shippingAddress}
                </div>
                <div className="font-bold text-gray-800 text-base">
                  Total: ${Number(o.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
