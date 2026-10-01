import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/auth";
import { extractError } from "./errors";

const empty = { name: "", description: "" };

const AdminCategoryForm = ({ category, onClose, onSaved }) => {
  const isEdit = category != null;
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? "",
        description: category.description ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [category]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = JSON.stringify({
      name: form.name,
      description: form.description,
    });

    try {
      const res = isEdit
        ? await apiFetch(`/api/categories/${category.id}`, {
            method: "PUT",
            body,
          })
        : await apiFetch("/api/categories", { method: "POST", body });

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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? `Edit Category #${category.id}` : "Add Category"}
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
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInput}
              required
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              maxLength={500}
              rows={3}
              className={`${inputClass} resize-none`}
            />
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

export default AdminCategoryForm;
