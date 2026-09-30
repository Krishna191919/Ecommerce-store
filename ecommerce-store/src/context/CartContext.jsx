/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useEffect } from "react";
import { isLoggedIn, apiFetch } from "../utils/auth";

export const CartContext = createContext();

const LOCAL_KEY = "guest_cart";

const loadLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setCart(loadLocalCart());
      return;
    }
    try {
      const res = await apiFetch("/api/cart");
      if (res.ok) setCart(await res.json());
    } catch {
      // backend offline, keep current state
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (item) => {
      if (isLoggedIn()) {
        try {
          const res = await apiFetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({ productId: item.id, quantity: 1 }),
          });
          if (res.ok) {
            refreshCart();
            return;
          }
        } catch {
          // fall through to local
        }
      }
      setCart((prev) => {
        const existing = prev.find((p) => p.id === item.id);
        const next = existing
          ? prev.map((p) =>
              p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
            )
          : [...prev, { ...item, quantity: 1 }];
        saveLocalCart(next);
        return next;
      });
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    async (cartId) => {
      if (isLoggedIn()) {
        try {
          await apiFetch(`/api/cart/${cartId}`, { method: "DELETE" });
          refreshCart();
          return;
        } catch {
          // fall through to local
        }
      }
      setCart((prev) => {
        const next = prev.filter((item) => item.id !== cartId);
        saveLocalCart(next);
        return next;
      });
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (cartId, quantity) => {
      if (isLoggedIn()) {
        try {
          await apiFetch(`/api/cart/${cartId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
          });
          refreshCart();
          return;
        } catch {
          // fall through to local
        }
      }
      setCart((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((item) => item.id !== cartId)
            : prev.map((item) =>
                item.id === cartId ? { ...item, quantity } : item
              );
        saveLocalCart(next);
        return next;
      });
    },
    [refreshCart]
  );

  const clearCart = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        await apiFetch("/api/cart", { method: "DELETE" });
        refreshCart();
        return;
      } catch {
        // fall through to local
      }
    }
    setCart([]);
    saveLocalCart([]);
  }, [refreshCart]);

  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
