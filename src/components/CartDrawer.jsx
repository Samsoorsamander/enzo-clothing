import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } =
    useCart();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlay, { opacity: 1, duration: 0.3, pointerEvents: "auto" });
      gsap.to(drawer, {
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, { opacity: 0, duration: 0.3, pointerEvents: "none" });
      gsap.to(drawer, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      <div
        className="cart-overlay"
        ref={overlayRef}
        onClick={closeCart}
        style={{ opacity: 0, pointerEvents: "none" }}
      />

      <aside className="cart-drawer" ref={drawerRef}>
        <div className="cart-header">
          <div>
            <span className="cart-kicker">Your Cart</span>
            <h3 className="cart-title">
              {count} {count === 1 ? "item" : "items"}
            </h3>
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 && (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <p className="cart-empty-sub">Add something beautiful.</p>
            </div>
          )}

          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price}</span>
                <div className="cart-item-qty">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeItem(item.id)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="cart-note">Shipping calculated at checkout.</p>
            <button className="cart-checkout">Checkout</button>
          </div>
        )}
      </aside>
    </>
  );
}
