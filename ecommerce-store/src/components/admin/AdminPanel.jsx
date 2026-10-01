import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../utils/auth";
import { getUser } from "../../utils/auth";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";

const AdminPanel = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadError, setLoadError] = useState("");

  const refreshProducts = useCallback(async () => {
    try {
      const res = await apiFetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch {
      setLoadError("Failed to load products");
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await apiFetch("/api/categories");
      if (res.ok) setCategories(await res.json());
    } catch {
      setLoadError("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshCategories();
  }, [refreshProducts, refreshCategories]);

  const user = getUser();

  const tabClass = (name) =>
    `px-5 py-2 font-semibold rounded-lg transition-colors ${
      tab === name
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-500">
            Signed in as {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("products")}
            className={tabClass("products")}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setTab("categories")}
            className={tabClass("categories")}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
          {loadError}
        </div>
      )}

      {tab === "products" ? (
        <AdminProducts
          products={products}
          categories={categories}
          refresh={refreshProducts}
          refreshCategories={refreshCategories}
        />
      ) : (
        <AdminCategories
          categories={categories}
          products={products}
          refresh={refreshCategories}
          refreshProducts={refreshProducts}
        />
      )}
    </div>
  );
};

export default AdminPanel;
