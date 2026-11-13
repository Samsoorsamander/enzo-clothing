import Logo from "./components/Logo";
import Hero from "./components/Hero";
import HangingRack from "./components/HangingRack";

function App() {
  return (
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
      </main>
    </div>
  );
}

export default App;
