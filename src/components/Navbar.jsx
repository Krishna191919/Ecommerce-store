import React from "react";
import ProductCard from "./Productcard";

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
      <header className="flex items-center justify-between px-3 text-2xl">
        <div>
          <img
            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/store-logo-design-template-3ac57f780d1cae2a6d3a049f82c62437_screen.jpg?ts=1646205211"
            alt="Store Logo"
            className="w-20 h-20"
          />
        </div>
        <ul className="flex justify-between list-none w-96">
          <li>
            <a href="">Home</a>
          </li>
          <li>
            <a href="">About</a>
          </li>
          <li>
            <a href="">Contact</a>
          </li>
        </ul>
        <div>Cart</div>
      </header>
    </>
  );
};

const Hero = () => {
  return (
    <section className='flex flex-col gap-4 px-2 py-2 border-2 border-red-500'>
      <div className='flex gap-3'>
        <input
          type='text'
          className='w-80 px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
          placeholder='Search...'
        />
        Search
      </div>
      <div className='flex flex-wrap justify-center gap-4 product-items'>
        {productData.map((product, index) => (
          <ProductCard
            key={product.id || index} // Ensure a unique key
            img={product.image}
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

export default Navbar;
