import { useState } from "react";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import HangingRack from "./components/HangingRack";
import Unfold from "./components/Unfold";
import LookBook from "./components/LookBook";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Marquee from "./components/Marquee";
import CartDrawer from "./components/CartDrawer";
import CartButton from "./components/CartButton";
import { CartProvider } from "./context/CartContext";
import OrderSuccess from "./components/OrderSuccess";
import { useCart } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const { lastOrder, dismissOrder } = useCart();

  return (
    <SmoothScroll>
      <Preloader onComplete={() => setLoaded(true)} />
      <Cursor />
      <CartDrawer />
      <OrderSuccess order={lastOrder} onDismiss={dismissOrder} />

      <div className="app">
        <header className="nav">
          <Logo size={28} />
          <nav className="nav-links">
            <a href="#shop">Shop</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <CartButton />
          </nav>
        </header>

        <main>
          <Hero />
          <HangingRack />

          <Marquee
            text="ENZO · SS26 · WEAR THE FUTURE · "
            speed={28}
            direction={1}
            variant="dark"
          />

          <Unfold />

          <Marquee
            text="HAND-FINISHED · SMALL BATCH · SS26 · "
            speed={32}
            direction={-1}
            variant="cream"
          />

          <LookBook />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
export default App;
