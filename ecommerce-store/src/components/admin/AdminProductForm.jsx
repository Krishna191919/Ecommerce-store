import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";

const empty = {
  title: "",
  price: "",
  description: "",
  categoryId: "",
  imageUrl: "",
  rating: "0",
  ratingCount: "0",
};

const AdminProductForm = ({ product, categories, onClose, onSaved }) => {
  const isEdit = product != null;
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title ?? "",
        price: product.price ?? "",
        description: product.description ?? "",
        categoryId: product.categoryId ?? "",
        imageUrl: product.image ?? "",
        rating: product.rating?.rate ?? "0",
        ratingCount: product.rating?.count ?? "0",
      });
    } else {
      setForm(empty);
    }
  }, [product]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = JSON.stringify({
      title: form.title,
      price: Number(form.price),
      description: form.description,
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl,
      rating: Number(form.rating),
      ratingCount: Number(form.ratingCount),
    });

    try {
      const res = isEdit
        ? await apiFetch(`/api/products/${product.id}`, { method: "PUT", body })
        : await apiFetch("/api/products", { method: "POST", body });

      if (!res.ok) {
        setError(await extractError(res));
        return;
      }
      onSaved();
    } catch {
      setError("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? `Edit Product #${product.id}` : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInput}
              required
              maxLength={300}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInput}
                required
                min="0.01"
                max="999999.99"
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleInput}
                required
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              maxLength={2000}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleInput}
              maxLength={500}
              placeholder="https://..."
              className={inputClass}
            />
            {form.imageUrl && (
              <div className="mt-2 h-32 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleInput}
                min="0"
                max="5"
                step="0.1"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Rating Count
              </label>
              <input
                type="number"
                name="ratingCount"
                value={form.ratingCount}
                onChange={handleInput}
                min="0"
                step="1"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
