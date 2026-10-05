import { useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";
import { ToastContext } from "../../context/ToastContext";

const STATUS_BADGES = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const VendorRequests = ({ onCountChange }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [filter, setFilter] = useState("pending");
  const { showToast } = useContext(ToastContext);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/vendor-applications");
      if (res.ok) {
        setApplications(await res.json());
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

  const notifyCountChange = useCallback(() => {
    if (onCountChange) onCountChange();
  }, [onCountChange]);

  const review = async (application, status) => {
    setBusy(application.id);
    setError("");
    try {
      const res = await apiFetch(`/api/vendor-applications/${application.id}/review`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const msg = await extractError(res);
        setError(msg);
        showToast(msg, "error");
        return;
      }
      showToast(
        status === "approved"
          ? `${application.userName} is now a vendor 🎉`
          : `Application from ${application.userName} rejected`,
        status === "approved" ? "success" : "info"
      );
      load();
      notifyCountChange();
    } catch {
      setError("Failed to connect to server");
    } finally {
      setBusy(null);
    }
  };

  const filtered = applications.filter(
    (a) => filter === "all" || a.status === filter
  );

  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filterClass = (name) =>
    `px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
      filter === name
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button onClick={() => setFilter("pending")} className={filterClass("pending")}>
          Pending ({counts.pending})
        </button>
        <button onClick={() => setFilter("approved")} className={filterClass("approved")}>
          Approved ({counts.approved})
        </button>
        <button onClick={() => setFilter("rejected")} className={filterClass("rejected")}>
          Rejected ({counts.rejected})
        </button>
        <button onClick={() => setFilter("all")} className={filterClass("all")}>
          All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading applications...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No {filter === "all" ? "" : filter} vendor applications.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {a.storeName}
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                        STATUS_BADGES[a.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {a.userName} · {a.userEmail} · 📞 {a.phoneNumber}
                  </p>
                  {a.reason && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      {a.reason}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Applied {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>

                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(a, "approved")}
                      disabled={busy === a.id}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => review(a, "rejected")}
                      disabled={busy === a.id}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorRequests;
