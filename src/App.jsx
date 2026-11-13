import Logo from "./components/Logo";
import Hero from "./components/Hero";
import HangingRack from "./components/HangingRack";
import Unfold from "./components/Unfold";
import Lookbook from "./components/LookBook";
import SmoothScroll from "./components/SmoothScroll";

function App() {
  return (
    <SmoothScroll>
      <div className="app">
        <header className="nav">
          <Logo size={28} />
          <nav className="nav-links">
            <a href="#shop">Shop</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <Hero />
          <HangingRack />
          <Unfold />
          <Lookbook />
        </main>
      </div>
    </SmoothScroll>
  );
}

export default App;
