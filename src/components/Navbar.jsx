import React from "react";
import { FaCartPlus, FaHome, FaInfoCircle, FaPhoneAlt, FaHeadset } from "react-icons/fa";
import { LOGO_URL } from '../utils/constants';

export const productData = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    title: "Product 1",
    description: "This is product 1",
    category: "Category 1",
    price: 100,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    title: "Product 2",
    description: "This is product 2",
    category: "Category 2",
    price: 200,
  },
];

const Navbar = () => {
  return (
    <>
      <header className="flex items-center justify-between px-3 text-sm sm:text-base py-1 bg-[#6BB7C7] shadow-md">
        {/* Logo */}
        <div>
          <img
            src={LOGO_URL}
            alt="Store Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Search Bar with Icon as Placeholder */}
        <div className="relative flex-grow mx-4 max-w-xs">
          <input
            type="text"
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10"
            placeholder="Search..."
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
              />
            </svg>
          </span>
        </div>

        {/* Navigation Links with Icons */}
        <ul className="flex justify-between list-none w-64 sm:w-80 gap-6">
          <li>
            <a
              href="#"
              className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
            >
              <FaHome className="text-base" />
              Home
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
            >
              <FaInfoCircle className="text-base" />
              About
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
            >
              <FaPhoneAlt className="text-base" />
              Contact
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
            >
              <FaHeadset className="text-base" />
              Service
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
            </a>
          </li>
        </ul>

        {/* Cart with Icon */}
        <div className="relative inline-flex items-center gap-2 text-black group hover:text-white transition-colors duration-300 text-base cursor-pointer">
          <FaCartPlus className="text-base" />
          Cart
        </div>
      </header>
    </>
  );
};

export default Navbar;
