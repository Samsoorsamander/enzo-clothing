import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ProductModal({ product, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;

    // Entrance
    const tl = gsap.timeline();
    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
    );
    tl.fromTo(
      content,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2",
    );

    // Escape key to close
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleBackdropClick}
    >
      <div className="modal-content" ref={contentRef}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="modal-info">
          <span className="modal-kicker">Enzo Clothing — SS26</span>
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-desc">
            Hand-finished in small batches. Slow-made, built to last. This piece
            is part of the SS26 collection — limited to 40 units per size.
          </p>

          <div className="modal-meta">
            <div className="modal-meta-item">
              <span className="modal-meta-label">Price</span>
              <span className="modal-meta-value">
                {product.price || "$340"}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Sizes</span>
              <span className="modal-meta-value">XS · S · M · L · XL</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Color</span>
              <span className="modal-meta-value">Natural</span>
            </div>
          </div>

          <button className="modal-add">Add to Cart</button>
          <p className="modal-note">
            Free shipping on orders over $250. Ships within 3–5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
