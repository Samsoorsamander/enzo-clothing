import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const COLOR_OPTIONS = [
  { hex: "#ffffff", label: "White" },
  { hex: "#1a1a1a", label: "Black" },
  { hex: "#8a7a65", label: "Desert" },
  { hex: "#a89880", label: "Sand" },
  { hex: "#4a6b8a", label: "Ocean" },
];

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
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

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: "/images/rack/coat.jpg", // Fallback image for the cart drawer
      color: selectedColor || selectedItem.color,
    });

    // Optionally close the showroom after adding
    // onClose();
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
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Back Button */}
          <button className="showroom-back" onClick={onClose}>
            ← Back to Collection
          </button>

          {/* Product Info (Bottom Left) */}
          <div className="showroom-info">
            <span className="showroom-kicker">Enzo — SS26</span>
            <h2 className="showroom-title">{selectedItem.name}</h2>
            <p className="showroom-price">{selectedItem.price}</p>

            {/* The Add to Cart button */}
            <button className="showroom-add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          {/* Front/Back Toggle + Color Picker (Bottom Right) */}
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
