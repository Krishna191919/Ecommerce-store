import { useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";
import { ToastContext } from "../../context/ToastContext";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = ["pending", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [search, setSearch] = useState("");
  const { showToast } = useContext(ToastContext);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/orders/all");
      if (res.ok) {
        setOrders(await res.json());
      } else {
        setError(await extractError(res));
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (order, status) => {
    if (status === order.status) return;
    setBusy(order.id);
    setError("");
    try {
      const res = await apiFetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const msg = await extractError(res);
        setError(msg);
        showToast(msg, "error");
        return;
      }
      showToast(`Order #${order.id} marked as ${status}`, "success");
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      );
    } catch {
      setError("Failed to connect to server");
    } finally {
      setBusy(null);
    }
  };

  const filtered = orders.filter(
    (o) =>
      !search ||
      String(o.id).includes(search) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by order #, customer name or email..."
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <div className="space-y-5">
          {filtered.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex flex-wrap justify-between items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                <div>
                  <span className="font-bold text-gray-800">Order #{o.id}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">
                    {o.customerName} ({o.customerEmail})
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(o.createdAt).toLocaleString()} · Ship to:{" "}
                    {o.shippingAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      STATUS_STYLES[o.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {o.status}
                  </span>
                  <select
                    value={o.status}
                    disabled={busy === o.id}
                    onChange={(e) => updateStatus(o, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    title="Update order status"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="flex-1 text-gray-700">
                      {item.title}
                      <span className="ml-2 text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                <span className="font-bold text-gray-800">
                  Total: ${Number(o.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
