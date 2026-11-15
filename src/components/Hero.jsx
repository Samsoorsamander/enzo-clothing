import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const container = useRef(null);
  const line1 = useRef(null);
  const line2 = useRef(null);
  const garment = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: window.innerWidth < 768 ? "+=60%" : "+=80%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Garment drops from above and scales slightly
      tl.fromTo(
        garment.current,
        { y: window.innerWidth < 768 ? -200 : -300, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, ease: "power2.out" },
        0,
      );

      // Headline lines split apart
      tl.to(line1.current, { x: -120, ease: "power2.inOut" }, 0.2);
      tl.to(line2.current, { x: 120, ease: "power2.inOut" }, 0.2);
    },
    { scope: container },
  );

  return (
    <section className="hero" ref={container}>
      <div className="hero-text">
        <h1 className="hero-line line-1" ref={line1}>
          WEAR
        </h1>
        <h1 className="hero-line line-2" ref={line2}>
          THE FUTURE
        </h1>
      </div>

      <div className="hero-garment" ref={garment}>
        {/* Real Image replacing the SVG */}
        <img
          src="/images/hero-coat.jpg"
          alt="Enzo Signature Coat"
          className="hero-image"
        />
      </div>

      <p className="hero-sub">New Collection — SS26</p>
    </section>
  );
}
