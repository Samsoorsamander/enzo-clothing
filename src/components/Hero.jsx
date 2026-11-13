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

      // Garment drops from above
      tl.fromTo(
        garment.current,
        {
          y: window.innerWidth < 768 ? -200 : -300,
          opacity: 0,
          rotate: -8,
        },
        { y: 0, opacity: 1, rotate: 0, ease: "power2.out" },
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
        {/* Simple hanging shirt SVG */}
        <svg viewBox="0 0 200 260" width="220" height="286">
          {/* Hanger hook */}
          <path
            d="M100 10 C100 10, 130 15, 130 35 C130 50, 115 55, 100 55"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
          {/* Hanger bar */}
          <line
            x1="40"
            y1="70"
            x2="160"
            y2="70"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
          {/* Shirt body */}
          <path
            d="M70 75 L70 75 C70 75, 50 90, 45 130 L30 230 L170 230 L155 130 C150 90, 130 75, 130 75 L130 75 L100 100 L70 75 Z"
            fill="#d4c5b0"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
          {/* Collar detail */}
          <path
            d="M75 80 Q100 110 125 80"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <p className="hero-sub">New Collection — SS26</p>
    </section>
  );
}
