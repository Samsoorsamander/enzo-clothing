import Logo from "./components/Logo";
import Hero from "./components/Hero";

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
      </main>
    </div>
  );
}

export default App;
