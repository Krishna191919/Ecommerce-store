import { useState, useCallback, useContext } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";
import { ToastContext } from "../../context/ToastContext";
import AdminCategoryForm from "./AdminCategoryForm";

const AdminCategories = ({ categories, products, refresh, refreshProducts }) => {
  const [form, setForm] = useState(null); // null | "new" | category object
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useContext(ToastContext);

  const countFor = (id) => products.filter((p) => p.categoryId === id).length;

  const handleDelete = useCallback(
    async (category) => {
      if (!window.confirm(`Delete category "${category.name}"?`)) return;
      setDeleting(category.id);
      setError("");
      try {
        const res = await apiFetch(`/api/categories/${category.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const msg = await extractError(res);
          setError(msg);
          showToast(msg, "error");
          return;
        }
        showToast(`Category "${category.name}" deleted`, "success");
        refresh();
        refreshProducts();
      } catch {
        setError("Failed to connect to server");
        showToast("Failed to connect to server", "error");
      } finally {
        setDeleting(null);
      }
    },
    [refresh, refreshProducts, showToast]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <button
          onClick={() => setForm("new")}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No categories found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="ml-2 text-gray-400 text-xs">#{c.id}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.description || (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {countFor(c.id)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setForm(c)}
                      className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={deleting === c.id}
                      className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {deleting === c.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <AdminCategoryForm
          category={form === "new" ? null : form}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            refresh();
            refreshProducts();
          }}
        />
      )}
    </div>
  );
};

export default AdminCategories;
