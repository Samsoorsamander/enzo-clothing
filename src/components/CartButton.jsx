import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button className="cart-button" onClick={openCart} aria-label="Open cart">
      <span>Cart</span>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
}
