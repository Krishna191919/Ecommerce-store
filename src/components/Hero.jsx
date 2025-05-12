import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { productData } from "../utils/productData";

// const Navbar = () => {
//   return (
//     <header className="flex flex-wrap items-center justify-between px-3 py-2 text-lg sm:text-2xl ">
//       <div>
//         <img
//           src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/store-logo-design-template-3ac57f780d1cae2a6d3a049f82c62437_screen.jpg?ts=1646205211"
//           alt="Store Logo"
//           className="w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 transition-transform duration-300"
//         />
//       </div>
//       <ul className="flex flex-wrap justify-between list-none w-full sm:w-96 gap-2 sm:gap-0">
//         <li>
//           <a href="#" className="relative inline-block text-black group">
//             Home
//             <span className="absolute left-0 bottom-0 h-1 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
//           </a>
//         </li>
//         <li>
//           <a href="#" className="relative inline-block text-black group">
//             About
//             <span className="absolute left-0 bottom-0 h-1 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
//           </a>
//         </li>
//         <li>
//           <a href="#" className="relative inline-block text-black group">
//             Contact
//             <span className="absolute left-0 bottom-0 h-1 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
//           </a>
//         </li>
//       </ul>
//       <div className="relative inline-block text-black group hover:text-blue-600 transition-colors duration-300">
//         Cart
//         <span className="absolute left-0 bottom-0 h-1 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
//       </div>
//     </header>
//   );
// };

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

const Hero = () => {
  return (
    <section className="flex flex-col gap-4 px-2 py-2 bg-[#98CAE3]">
      <div className="flex flex-wrap justify-center gap-4 product-items">
        {productData.map((product, index) => (
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
