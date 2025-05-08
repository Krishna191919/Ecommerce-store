import React from "react";

const ProductCard = (props) => {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg shadow-lg w-80 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="h-56 w-full overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
        <img
          src={props.img}
          alt={props.title}
          className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{props.title}</h2>
      <p className="text-gray-600 text-sm line-clamp-2">{props.description}</p>
      <h3 className="text-lg font-bold text-gray-900">${props.price}</h3>
      <button className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;