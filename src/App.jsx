import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  };

  return (
    <>
      <Navbar onSearch={searchProducts} onReset={fetchAllProducts} />
      <Hero products={products} isLoading={isLoading} />
      <Footer />
    </>
  );
}

export default App;
