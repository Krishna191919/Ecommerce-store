import React from "react";

const ProductCard = () => {
  return (
    <>
      <div className="flex flex-col gap-4 px-3 border-2 border-slate-600 w-72">
        <img
          src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
          alt=""
        />
        <h2 className="text-2xl">Clothing bag</h2>
        <p>
          Your perfect pack for everyday use and walks in the forest. Stash your
          laptop (up to 15 inches) in the padded sleeve, your everyday
        </p>
        <h3 className="text-2xl">$109.95</h3>
      </div>
    </>
  );
};

export default ProductCard;
