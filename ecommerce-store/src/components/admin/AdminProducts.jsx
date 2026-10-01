import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";
import AdminProductForm from "./AdminProductForm";

const AdminProducts = ({ products, categories, refresh, refreshCategories }) => {
  const [form, setForm] = useState(null); // null | "new" | product object
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = useCallback(
    async (product) => {
      if (!window.confirm(`Delete "${product.title}"?`)) return;
      setDeleting(product.id);
      setError("");
      try {
        const res = await apiFetch(`/api/products/${product.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          setError(await extractError(res));
          return;
        }
        refresh();
      } catch {
        setError("Failed to connect to server");
      } finally {
        setDeleting(null);
      }
    },
    [refresh]
  );

  useEffect(() => {
    if (!form) setError("");
  }, [form]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setForm("new")}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 w-16">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      {p.title}
                    </span>
                    <span className="ml-2 text-gray-400 text-xs">#{p.id}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.rating?.rate} ({p.rating?.count})
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setForm(p)}
                      className="px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deleting === p.id}
                      className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {deleting === p.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <AdminProductForm
          product={form === "new" ? null : form}
          categories={categories}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            refresh();
            refreshCategories();
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
