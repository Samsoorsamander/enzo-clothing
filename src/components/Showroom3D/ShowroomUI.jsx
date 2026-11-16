import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const COLOR_OPTIONS = [
  { hex: "#f2f0ea", label: "Ivory" },
  { hex: "#1a1a1a", label: "Black" },
  { hex: "#8a7a65", label: "Desert" },
  { hex: "#a89880", label: "Sand" },
  { hex: "#4a6b8a", label: "Ocean" },
];

const SIZES = ["S", "M", "L", "XL"];

const fadeVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export default function ShowroomUI({
  selectedItem,
  view,
  setView,
  onClose,
  selectedColor,
  setSelectedColor,
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState("M");

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addItem({
      id: `${selectedItem.id}-${selectedColor || selectedItem.color}-${size}`,
      name: `${selectedItem.name} · ${size}`,
      price: selectedItem.price,
      image: "/images/hero-coat.png",
      color: selectedColor || selectedItem.color,
    });
  };

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          className="showroom-ui"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeVariants}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <button className="showroom-back" onClick={onClose}>
            ← Back to Collection
          </button>

          {/* Floating hang tags like the reference */}
          <div className="showroom-tags" aria-hidden="true">
            <span className="showroom-tag showroom-tag--warm">SS26</span>
            <span className="showroom-tag showroom-tag--dark">ENZO</span>
          </div>

          <div className="showroom-info">
            <span className="showroom-kicker">Enzo — SS26</span>
            <h2 className="showroom-title">{selectedItem.name}</h2>
            <p className="showroom-price">{selectedItem.price}</p>

            <div className="showroom-sizes">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`showroom-size ${size === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <button className="showroom-add-to-cart" onClick={handleAddToCart}>
              Add to Cart — {size}
            </button>
          </div>

          <div className="showroom-controls">
            <div className="showroom-toggle">
              <button
                className={view === "front" ? "active" : ""}
                onClick={() => setView("front")}
              >
                Front
              </button>
              <button
                className={view === "back" ? "active" : ""}
                onClick={() => setView("back")}
              >
                Back
              </button>
            </div>

            <div className="showroom-colors">
              <span className="showroom-colors-label">Color</span>
              <div className="showroom-colors-grid">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.label}
                    className={`color-swatch ${selectedColor === c.hex ? "active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.hex)}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
