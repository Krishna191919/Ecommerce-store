import React, { useState } from "react";
import {
  FaCartPlus,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaHeadset,
} from "react-icons/fa";
import { LOGO_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const Navbar = ({ onSearch, onReset }) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="flex items-center justify-between px-3 text-sm sm:text-base py-1 bg-[#6BB7C7] shadow-md">
      {/* Logo */}
      <div>
        <img
          src={LOGO_URL}
          alt="Store Logo"
          className="w-12 h-12 sm:w-16 sm:h-16 hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Search Bar */}
      <div className="relative flex-grow mx-4 max-w-xs flex items-center">
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
        <input
          type="text"
          className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-800 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10"
          placeholder="Search by title..."
          value={search}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none flex items-center"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex justify-between list-none w-64 sm:w-80 gap-6">
        <li>
          <Link
            to="/"
            className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
            onClick={onReset}
          >
            <FaHome className="text-base" />
            Home
            <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
          >
            <FaInfoCircle className="text-base" />
            About
            <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
          >
            <FaPhoneAlt className="text-base" />
            Contact
            <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
          </Link>
        </li>
        <li>
          <Link
            to="/services"
            className="relative inline-flex items-center gap-2 text-black group hover:text-white text-base"
          >
            <FaHeadset className="text-base" />
            Service
            <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-transparent transition-all duration-300 group-hover:w-full group-hover:bg-blue-600 group-hover:rounded-md"></span>
          </Link>
        </li>
      </ul>

      {/* Cart */}
      <div className="relative inline-flex items-center gap-2 text-black group hover:text-white transition-colors duration-300 text-base cursor-pointer">
        <FaCartPlus className="text-base" />
        Cart
      </div>
    </header>
  );
};

export default Navbar;
