import { useState, useContext, useCallback } from "react";
import { apiFetch, getUser } from "../../utils/auth";
import { extractError } from "./errors";
import { ToastContext } from "../../context/ToastContext";

const ROLES = ["buyer", "vendor", "admin"];

const AdminUsers = ({ users, refresh }) => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const { showToast } = useContext(ToastContext);
  const me = getUser();

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = useCallback(
    async (user, role) => {
      if (role === user.role) return;
      setBusy(user.id);
      setError("");
      try {
        const res = await apiFetch(`/api/users/${user.id}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });
        if (!res.ok) {
          const msg = await extractError(res);
          setError(msg);
          showToast(msg, "error");
          return;
        }
        showToast(`${user.fullName} is now ${role}`, "success");
        refresh();
      } catch {
        setError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      } finally {
        setBusy(null);
      }
    },
    [refresh, showToast]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Products</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const isSelf = u.id === me?.userId;
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {u.fullName}
                      {isSelf && (
                        <span className="ml-2 text-xs text-gray-400">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                          u.role === "admin"
                            ? "bg-amber-100 text-amber-700"
                            : u.role === "vendor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {u.productCount}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {u.orderCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={u.role}
                        disabled={busy === u.id || isSelf}
                        onChange={(e) => changeRole(u, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title={isSelf ? "You cannot change your own role" : ""}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
