import {useState} from "react";
import { FaCartPlus } from "react-icons/fa";
import { productData } from "../utils/productData";


const ProductCard = ({ price, image, title, description, category }) => {
  return (
    <div className="relative flex flex-col gap-4 px-3 pt-3 pb-5 border-2 border-slate-200 w-full sm:w-72 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group overflow-hidden">
      <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
        ${price}
      </div>
      <div className="absolute top-3 left-3 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full z-10">
        {category}
      </div>
      <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        <img
          src={image}
          alt={title}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mt-2 truncate" title={title}>
        {title}
      </h2>
      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5em]">{description}</p>
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300">
        <FaCartPlus />
        Add to Cart
      </button>
    </div>
  );
};


// Hero component to display the top-rated products
// This component uses the ProductCard component to display each product
// It also includes a button to filter and display only the top-rated products
// The top-rated products are filtered based on their rating
// The component uses the productData array to get the product information
const Hero = () => {
  const [topRatedProducts, setTopRatedProducts] = useState(productData);
  const topRatedProductsdata = () => {
    setTopRatedProducts(productData.filter((product) => product.rating.rate >= 4));
    console.log(topRatedProducts);
  };
  return (
    <section className="flex flex-col gap-4 px-2 py-2 bg-[#98CAE3]">
      <div className="flex items-center justify-between px-3 py-2 text-lg sm:text-2xl">
        <button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300  cursor-pointer" onClick={topRatedProductsdata}>
          Top Rated Product
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 product-items">
        
        {topRatedProducts.map((product, index) => (
          <ProductCard
            key={product.id || index}
            image={product.image}
            title={product.title}
            description={product.description}
            category={product.category}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
