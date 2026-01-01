import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cartpage = () => {
  const { cart } = useContext(CartContext);

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>
            <img src={item.image} alt={item.title} width={50} />
            {item.title} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cartpage;
