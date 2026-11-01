import React, { useState, useEffect } from "react";
import ShimmerProductCard from "./shimmerUi";
import ProductCard from "./ProductCard";
import { Link, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const Hero = () => {
  const {
    products = [],
    isLoading = false,
    error = null,
    page = 1,
    totalPages = 1,
    total = 0,
    filters = {},
    updateFilters = () => {},
  } = useOutletContext();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const showTopRated = filters.minRating === 4;

  return (
    <section className="flex flex-col gap-4 px-2 py-2 bg-[#98CAE3]">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          onClick={() =>
            updateFilters({ minRating: showTopRated ? null : 4 })
          }
        >
          {showTopRated ? "Show All Products" : "Top Rated Product"}
        </button>
        <select
          className="px-3 py-2 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.categoryId ?? ""}
          onChange={(e) => updateFilters({ categoryId: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.sortBy ?? "newest"}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          onClick={() =>
            updateFilters({
              search: "",
              categoryId: "",
              sortBy: "newest",
              minRating: null,
            })
          }
        >
          Clear Filter
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 product-items">
        {isLoading
          ? Array(12)
              .fill("")
              .map((_, idx) => <ShimmerProductCard key={idx} />)
          : error ? (
              <div className="w-full text-center py-10">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full text-center py-10">
                <p className="text-gray-600 text-lg">No products found.</p>
              </div>
            ) : (
              products.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    description={product.description}
                    category={product.category}
                    price={product.price}
                    vendorId={product.vendorId}
                    stock={product.stock}
                  />
                </Link>
              ))
            )}
      </div>
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            disabled={page <= 1}
            onClick={() => updateFilters({}, page - 1)}
          >
            Previous
          </button>
          <span className="text-gray-800 font-medium">
            Page {page} of {totalPages} ({total} products)
          </span>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            disabled={page >= totalPages}
            onClick={() => updateFilters({}, page + 1)}
          >
            Next
          </button>
        </div>
      )}
      <div className="flex flex-col items-center justify-center mt-6 text-center">
        <p className="text-lg sm:text-xl font-small text-gray-800">
          We’d love to hear what you think!
        </p>
        <button className="mt-4 mb-4 px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300">
          Give Feedback
        </button>
      </div>
    </section>
  );
};

export default Hero;
