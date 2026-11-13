import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Unfold() {
  const section = useRef(null);
  const box = useRef(null);
  const garment = useRef(null);
  const label = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
        },
      });

      // Step 1: box slides up slightly and fades
      tl.to(box.current, { y: -40, opacity: 0, duration: 0.4 }, 0);

      // Step 2: garment unfolds — clip-path expands from folded strip to full
      tl.fromTo(
        garment.current,
        {
          clipPath: "inset(45% 20% 45% 20% round 8px)",
          scale: 0.6,
          rotate: -2,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0.2,
      );

      // Step 3: label fades in
      tl.fromTo(
        label.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        1.1,
      );
    },
    { scope: section },
  );

  return (
    <section className="unfold" ref={section}>
      <div className="unfold-stage">
        {/* The folded box */}
        <div className="unfold-box" ref={box}>
          <svg viewBox="0 0 160 120" width="160" height="120">
            <rect
              x="10"
              y="40"
              width="140"
              height="70"
              fill="#c9b99a"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <rect
              x="10"
              y="20"
              width="140"
              height="30"
              fill="#b8a88a"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <line
              x1="80"
              y1="20"
              x2="80"
              y2="50"
              stroke="#1a1a1a"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* The unfolding garment */}
        <div className="unfold-garment" ref={garment}>
          <svg viewBox="0 0 300 360" width="300" height="360">
            {/* Long coat */}
            <path
              d="M110 30 L110 30 C110 30, 70 55, 60 120 L40 340 L260 340 L240 120 C230 55, 190 30, 190 30 L190 30 L150 65 L110 30 Z"
              fill="#a89880"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            {/* Center seam */}
            <line
              x1="150"
              y1="65"
              x2="150"
              y2="340"
              stroke="#1a1a1a"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Collar */}
            <path
              d="M115 38 Q150 80 185 38"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            {/* Buttons */}
            <circle cx="150" cy="140" r="2.5" fill="#1a1a1a" />
            <circle cx="150" cy="180" r="2.5" fill="#1a1a1a" />
            <circle cx="150" cy="220" r="2.5" fill="#1a1a1a" />
          </svg>
        </div>
      </div>

      <div className="unfold-label" ref={label}>
        <span className="unfold-kicker">Signature Piece</span>
        <h2 className="unfold-title">The Long Coat</h2>
        <p className="unfold-desc">
          Hand-finished wool. Unfolds from a single box.
        </p>
      </div>
    </section>
  );
}
