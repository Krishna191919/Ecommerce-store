import React, { useState } from "react";
import ShimmerProductCard from "./shimmerUi";
import ProductCard from "./Productcard";
import { Link, useOutletContext } from "react-router-dom";

const Hero = () => {
  const { products = [], isLoading = false } = useOutletContext();
  const [showTopRated, setShowTopRated] = useState(false);

  const displayedProducts = showTopRated
    ? products.filter((product) => product.rating && product.rating.rate >= 4)
    : products;

  return (
    <section className="flex flex-col gap-4 px-2 py-2 bg-[#98CAE3]">
      <div className="flex justify-start mb-2">
        <button
          className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          onClick={() => setShowTopRated((prev) => !prev)}
        >
          {showTopRated ? "Show All Products" : "Top Rated Product"}
        </button>
        <button
          className="ml-4 px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
          onClick={() => setShowTopRated(false)}
        >
          Clear Filter
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 product-items">
        {isLoading
          ? Array(12)
              .fill("")
              .map((_, idx) => <ShimmerProductCard key={idx} />)
          : displayedProducts.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <ProductCard
                  product={product}
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  category={product.category}
                  price={product.price}
                />
              </Link>
            ))}
      </div>
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
