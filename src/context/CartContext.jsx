import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("enzo-cart");
      if (saved) setItems(JSON.parse(saved));

      const savedOrder = localStorage.getItem("enzo-last-order");
      if (savedOrder) setLastOrder(JSON.parse(savedOrder));
    } catch (e) {
      console.warn("Cart load failed:", e);
    }
  }, []);
  // Save on every change
  useEffect(() => {
    try {
      localStorage.setItem("enzo-cart", JSON.stringify(items));
    } catch (e) {
      console.warn("Cart save failed:", e);
    }
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.]/g, "") || 0);
    return sum + price * item.qty;
  }, 0);

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
