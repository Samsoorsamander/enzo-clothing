import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const garments = [
  { id: 1, name: "Oversized Coat", color: "#c9b99a" },
  { id: 2, name: "Silk Shirt", color: "#8a7a65" },
  { id: 3, name: "Wide Trousers", color: "#a89880" },
  { id: 4, name: "Knit Vest", color: "#b8a88a" },
];

export default function HangingRack() {
  const section = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray(".rack-panel", track.current);

      // Horizontal scroll tied to vertical scroll
      gsap.to(track.current, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + track.current.offsetWidth,
        },
      });

      // Subtle sway on each garment as it enters
      panels.forEach((panel) => {
        const garment = panel.querySelector(".rack-garment");
        gsap.fromTo(
          garment,
          { rotate: -4, y: -10 },
          {
            rotate: 0,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: ScrollTrigger.getAll().find(
                (st) => st.trigger === section.current,
              )?.animation,
              start: "left 80%",
              end: "left 30%",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: section },
  );

  return (
    <section className="rack" ref={section}>
      <div className="rack-header">
        <span className="rack-label">The Collection</span>
        <span className="rack-count">04 Pieces</span>
      </div>

      <div className="rack-track" ref={track}>
        {garments.map((item) => (
          <div className="rack-panel" key={item.id}>
            <div className="rack-hanger-bar" />
            <div className="rack-garment">
              <svg viewBox="0 0 200 260" width="180" height="234">
                <path
                  d="M100 10 C100 10, 125 14, 125 32 C125 45, 112 50, 100 50"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                />
                <line
                  x1="45"
                  y1="62"
                  x2="155"
                  y2="62"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                />
                <path
                  d="M70 68 L70 68 C70 68, 55 82, 50 120 L38 215 L162 215 L150 120 C145 82, 130 68, 130 68 L130 68 L100 90 L70 68 Z"
                  fill={item.color}
                  stroke="#1a1a1a"
                  strokeWidth="1.2"
                />
                <path
                  d="M76 74 Q100 100 124 74"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            <div className="rack-info">
              <span className="rack-num">0{item.id}</span>
              <span className="rack-name">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
