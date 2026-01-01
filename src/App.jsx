import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setIsLoading(true);
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    setProducts(data);
    setIsLoading(false);
  };

  // Search products by title (API)
  const searchProducts = async (query) => {
    setIsLoading(true);
    if (!query) {
      fetchAllProducts();
      return;
    }
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
    setIsLoading(false);
    setSelectedCategory(""); // ← Reset dropdown
    setSearchQuery(""); // ← Reset search input
  };

  // Pass products and isLoading to Outlet context
  return (
    <>
      <Navbar onSearch={searchProducts} onReset={fetchAllProducts} />
      <Outlet context={{ products, isLoading }} />
      <Footer />
    </>
  );
}

export default App;
