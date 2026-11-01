import React, { useState, useEffect, useRef, useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./utils/api";
import { isLoggedIn, apiFetch, getUser, logout } from "./utils/auth";
import { ToastContext } from "./context/ToastContext";

// The JWT holds the role at login time, so it goes stale when the role
// changes (e.g. a buyer is approved as a vendor) — and the backend reads
// role from the token, not the DB. Refresh the cached user from
// /api/auth/profile on load; on any mismatch force a fresh login so the
// token role always matches the DB.
const syncUserProfile = async () => {
  if (!isLoggedIn()) return "unchanged";
  try {
    const res = await apiFetch("/api/auth/profile");
    if (res.status === 401) {
      // Token expired or revoked — clear stale credentials
      logout();
      return "unauthorized";
    }
    if (!res.ok) return "unchanged";
    const profile = await res.json();
    const cached = getUser();
    if (cached?.role && cached.role !== profile.role) {
      // Role changed since login — the current token is no longer valid
      // for the new (or old) role, so drop it and require a new login.
      logout();
      return "role-changed";
    }
    localStorage.setItem("user", JSON.stringify({ ...getUser(), ...profile }));
    return "unchanged";
  } catch {
    // server offline — keep cached user
    return "unchanged";
  }
};

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  // search/category/sort filters live here so Navbar (search) and
  // Hero (category/sort/pagination) can both drive the same query.
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    sortBy: "newest",
    sortDir: null,
    minRating: null,
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (isInitialLoad.current) setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page, pageSize: 12 });
        if (filters.search) params.set("search", filters.search);
        if (filters.categoryId) params.set("categoryId", filters.categoryId);
        if (filters.minRating) params.set("minRating", filters.minRating);
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.sortDir) params.set("sortDir", filters.sortDir);

        const res = await fetch(`${API_BASE_URL}/api/products/search?${params}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!active) return;
        setProducts(data.items);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (active) setError("Failed to load products. Please try again later.");
      } finally {
        if (active && isInitialLoad.current) {
          isInitialLoad.current = false;
          setIsLoading(false);
        }
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [filters, page]);

  // Changing any filter resets to page 1 unless an explicit page is given.
  const updateFilters = (patch, targetPage) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(targetPage ?? 1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      sortBy: "newest",
      sortDir: null,
      minRating: null,
    });
    setPage(1);
  };

  useEffect(() => {
    let active = true;
    syncUserProfile().then((status) => {
      if (!active) return;
      if (status === "role-changed") {
        showToast(
          "Your role changed — please sign in again to continue.",
          "info"
        );
        navigate("/signin");
      } else if (status === "unauthorized") {
        showToast("Session expired. Please sign in again.", "info");
        navigate("/signin");
      }
    });
    return () => {
      active = false;
    };
  }, [navigate, showToast]);

  useEffect(() => {
    // Navigating home (Home link) clears the catalog filters.
    if (pathname === "/") resetFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Navbar onSearch={(q) => updateFilters({ search: q })} onReset={resetFilters} />
      <Outlet
        context={{
          products,
          isLoading,
          error,
          page,
          totalPages,
          total,
          filters,
          updateFilters,
        }}
      />
      <Footer />
    </>
  );
}

export default App;
