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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const isInitialLoad = useRef(true);

  const fetchAllProducts = async () => {
    if (isInitialLoad.current) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [pathname]);

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

  const searchProducts = async (query) => {
    if (!query) {
      fetchAllProducts();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    } catch (err) {
      console.error("Failed to search products:", err);
      setError("Failed to search products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar onSearch={searchProducts} onReset={fetchAllProducts} />
      <Outlet context={{ products, isLoading, error }} />
      <Footer />
    </>
  );
}

export default App;
