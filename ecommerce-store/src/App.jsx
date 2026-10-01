import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./utils/api";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pathname } = useLocation();
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
