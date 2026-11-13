import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Logo from "../components/Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const section = useRef(null);

  useGSAP(
    () => {
      // Staggered paragraph reveals
      gsap.utils.toArray(".about-reveal", section.current).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Image mask reveals
      gsap.utils.toArray(".about-image", section.current).forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    },
    { scope: section },
  );

  return (
    <main className="about-page" ref={section}>
      <header className="about-nav">
        <a href="/" aria-label="Back to Enzo">
          <Logo size={24} />
        </a>
        <a href="/" className="about-back">
          ← Back
        </a>
      </header>

      <section className="about-hero">
        <span className="about-kicker about-reveal">Since 2024</span>
        <h1 className="about-title about-reveal">Quietly bold.</h1>
        <p className="about-lede about-reveal">
          Enzo is a small-batch clothing label built on a simple premise:
          garments should outlive trends.
        </p>
      </section>

      <section className="about-split">
        <div className="about-image">
          <img src="/images/lookbook/look-01.jpg" alt="Enzo atelier" />
        </div>
        <div className="about-text">
          <span className="about-kicker about-reveal">The Beginning</span>
          <h2 className="about-h2 about-reveal">
            Started in a one-room atelier.
          </h2>
          <p className="about-body about-reveal">
            Enzo began with a single coat pattern and a conviction that fashion
            had become too fast, too loud, too disposable. We produce in limited
            runs — forty units per size, per season. No restocks. No compromises
            on fabric.
          </p>
        </div>
      </section>

      <section className="about-split about-split-reverse">
        <div className="about-text">
          <span className="about-kicker about-reveal">The Process</span>
          <h2 className="about-h2 about-reveal">Hand-finished. Every piece.</h2>
          <p className="about-body about-reveal">
            Every garment passes through the hands of a single maker from cut to
            finish. It takes longer. It costs more. It means the coat you buy
            today is the coat you'll still be wearing in ten years.
          </p>
        </div>
        <div className="about-image">
          <img src="/images/lookbook/look-04.jpg" alt="Enzo process" />
        </div>
      </section>

      <section className="about-quote">
        <blockquote className="about-reveal">
          "We make clothes for people who've stopped buying clothes they don't
          need."
        </blockquote>
        <span className="about-attribution about-reveal">— Enzo, Founder</span>
      </section>

      <section className="about-cta">
        <h2 className="about-reveal">See the collection.</h2>
        <a href="/" className="about-button about-reveal">
          Shop SS26 →
        </a>
      </section>
    </main>
  );
}
