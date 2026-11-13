import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const looks = [
  { id: 1, name: "Look 01", color: "#c9b99a", shape: "coat" },
  { id: 2, name: "Look 02", color: "#8a7a65", shape: "shirt" },
  { id: 3, name: "Look 03", color: "#a89880", shape: "trousers" },
  { id: 4, name: "Look 04", color: "#b8a88a", shape: "dress" },
  { id: 5, name: "Look 05", color: "#d4c5b0", shape: "jacket" },
  { id: 6, name: "Look 06", color: "#96866e", shape: "shirt" },
];

function GarmentSVG({ shape, color }) {
  const paths = {
    coat: (
      <path
        d="M110 30 C110 30, 70 55, 60 120 L40 340 L260 340 L240 120 C230 55, 190 30, 190 30 L150 65 L110 30 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ),
    shirt: (
      <path
        d="M100 40 C100 40, 60 60, 50 120 L40 320 L260 320 L250 120 C240 60, 200 40, 200 40 L150 80 L100 40 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ),
    trousers: (
      <path
        d="M80 40 L220 40 L240 340 L170 340 L150 140 L130 340 L60 340 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ),
    dress: (
      <path
        d="M110 40 C110 40, 80 70, 90 130 L50 340 L250 340 L210 130 C220 70, 190 40, 190 40 L150 80 L110 40 Z"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ),
    jacket: (
      <path
        d="M110 35 C110 35, 65 60, 55 130 L45 300 L255 300 L245 130 C235 60, 190 35, 190 35 L150 75 L110 35 Z M150 75 L150 300"
        fill={color}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ),
  };
  return paths[shape] || paths.coat;
}

export default function LookBook() {
  const section = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".look-card", section.current);

      cards.forEach((card) => {
        const inner = card.querySelector(".look-inner");

        // Mask wipe on the image
        gsap.fromTo(
          inner,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Info text fades up
        const info = card.querySelector(".look-info");
        gsap.fromTo(
          info,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
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
    <section className="lookbook" ref={section}>
      <div className="lookbook-header">
        <h2 className="lookbook-title">Lookbook</h2>
        <span className="lookbook-sub">SS26 — Volume 01</span>
      </div>

      <div className="lookbook-grid">
        {looks.map((look, i) => (
          <article
            className={`look-card ${i % 2 === 1 ? "offset" : ""}`}
            key={look.id}
          >
            <div className="look-inner">
              <div className="look-image" style={{ background: "#e6ddd0" }}>
                <svg viewBox="0 0 300 360" width="100%" height="100%">
                  <GarmentSVG shape={look.shape} color={look.color} />
                </svg>
              </div>
            </div>
            <div className="look-info">
              <span className="look-name">{look.name}</span>
              <span className="look-view">View →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
