import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStore, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { apiFetch, isLoggedIn, getUser } from "../utils/auth";
import { ToastContext } from "../context/ToastContext";

const STATUS_BADGES = {
  pending: {
    icon: <FaClock className="text-amber-500" />,
    text: "Pending review",
    badge: "bg-amber-100 text-amber-700",
  },
  approved: {
    icon: <FaCheckCircle className="text-green-500" />,
    text: "Approved",
    badge: "bg-green-100 text-green-700",
  },
  rejected: {
    icon: <FaTimesCircle className="text-red-500" />,
    text: "Rejected",
    badge: "bg-red-100 text-red-700",
  },
};

const BecomeVendor = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ storeName: "", phoneNumber: "", reason: "" });
  const { showToast } = useContext(ToastContext);
  const user = isLoggedIn() ? getUser() : null;

  const loadApplications = useCallback(async () => {
    try {
      const res = await apiFetch("/api/vendor-applications/mine");
      if (res.ok) setApplications(await res.json());
    } catch {
      // server offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "buyer") loadApplications();
    else setLoading(false);
  }, [user?.role, loadApplications]);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.storeName.trim() || !form.phoneNumber.trim()) {
      showToast("Store name and phone number are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/vendor-applications", {
        method: "POST",
        body: JSON.stringify({
          storeName: form.storeName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          reason: form.reason.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.message || "Failed to submit application", "error");
        return;
      }
      showToast("Application submitted! An admin will review it soon.", "success");
      setForm({ storeName: "", phoneNumber: "", reason: "" });
      loadApplications();
    } catch {
      showToast("Failed to connect to server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <FaStore className="text-5xl text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Become a Vendor</h1>
        <p className="text-gray-600 mb-6">
          Sign in first, then apply to open your own store and start selling.
        </p>
        <Link
          to="/signin"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (user.role === "vendor" || user.role === "admin") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          You're already a {user.role}
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your products from your dashboard.
        </p>
        <Link
          to={user.role === "admin" ? "/admin" : "/vendor"}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 inline-block"
        >
          Open Dashboard
        </Link>
      </div>
    );
  }

  const latest = applications[0];
  const badge = latest ? STATUS_BADGES[latest.status] : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <FaStore className="text-4xl text-blue-500 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-gray-800">Become a Vendor</h1>
        <p className="text-gray-500 mt-2">
          Fill in your store details. An admin will verify your application
          before you can start selling.
        </p>
      </div>

      {/* Latest application status */}
      {latest && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">{latest.storeName}</h2>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase flex items-center gap-1 ${
                badge?.badge || "bg-gray-100 text-gray-600"
              }`}
            >
              {badge?.icon} {badge?.text || latest.status}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Applied on {new Date(latest.createdAt).toLocaleDateString()}
          </p>
          {latest.reviewNote && (
            <p className="mt-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span className="font-semibold">Admin note:</span>{" "}
              {latest.reviewNote}
            </p>
          )}
          {latest.status === "pending" && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Your application is being reviewed. Once approved you'll get the
              vendor role and can start selling.
            </p>
          )}
        </div>
      )}

      {/* Application form — hidden while pending, shown if none or rejected */}
      {latest?.status !== "pending" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col gap-4"
        >
          {latest?.status === "rejected" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              Your previous application was rejected. You can update your
              details and apply again.
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Store Name *
            </label>
            <input
              type="text"
              name="storeName"
              maxLength={100}
              placeholder="e.g. Krishna Electronics"
              value={form.storeName}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              maxLength={20}
              placeholder="e.g. +91 9876543210"
              value={form.phoneNumber}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Why do you want to sell? (optional)
            </label>
            <textarea
              name="reason"
              maxLength={500}
              rows={3}
              placeholder="Tell the admin what you plan to sell..."
              value={form.reason}
              onChange={handleInput}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BecomeVendor;
