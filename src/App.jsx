import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Logo from "./components/Logo";
import Hero from "./components/Hero";
import Unfold from "./components/Unfold";
import LookBook from "./components/LookBook";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Marquee from "./components/Marquee";
import CartDrawer from "./components/CartDrawer";
import CartButton from "./components/CartButton";
import OrderSuccess from "./components/OrderSuccess";
import Contact from "./components/Contact";

import ShowroomCanvas from "./components/Showroom3D/ShowroomCanvas";

import { CartProvider, useCart } from "./context/CartContext";

const About = lazy(() => import("./pages/About"));

function HomePage() {
  return (
    <>
      <Hero />

      {/* Interactive 3D Clothing Collection */}
      <section className="rack" id="shop" aria-label="3D clothing collection">
        <div className="rack-header">
          <span className="rack-label">The Collection</span>

          <span className="rack-count">04 Pieces</span>
        </div>

        <ShowroomCanvas />
      </section>

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

      <Contact />
    </>
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
          <a href="/" aria-label="Enzo home">
            <Logo size={28} />
          </a>

          <nav className="nav-links">
            <a href="/#shop">Shop</a>
            <a href="/about">About</a>
            <a href="/#contact">Contact</a>
            <CartButton />
          </nav>
        </header>

        <main>
          <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
