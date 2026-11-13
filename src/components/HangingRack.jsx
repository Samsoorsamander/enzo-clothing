import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// We duplicate the array to fill the space and prevent blank gaps
const baseGarments = [
  { id: 1, name: "Oversized Coat", image: "/images/rack/coat.jpg" },
  { id: 2, name: "Silk Shirt", image: "/images/rack/shirt.jpg" },
  { id: 3, name: "Wide Trousers", image: "/images/rack/trousers.jpg" },
  { id: 4, name: "Knit Vest", image: "/images/rack/vest.jpg" },
];

const garments = [...baseGarments, ...baseGarments, ...baseGarments]; // 12 items total

export default function HangingRack() {
  const section = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const panels = gsap.utils.toArray(".rack-panel", track.current);

        // Scroll exactly 4 panels width, then the next 4 seamlessly take over
        gsap.to(track.current, {
          xPercent: -100 * (panels.length - 8), // Leaves 8 panels visible at the end
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + track.current.offsetWidth * 0.8, // Tuned distance
          },
        });

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
      });

      mm.add("(max-width: 768px)", () => {
        const panels = gsap.utils.toArray(".rack-panel", track.current);
        gsap.to(track.current, {
          xPercent: -100 * (panels.length - 8),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            pin: true,
            scrub: 0.6,
            start: "top top",
            end: () => "+=" + track.current.offsetWidth * 0.6,
            invalidateOnRefresh: true,
          },
        });
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
        {garments.map((item, index) => (
          <div className="rack-panel" key={`${item.id}-${index}`}>
            <div className="rack-hanger-bar" />
            <div className="rack-garment">
              <img src={item.image} alt={item.name} loading="lazy" />
            </div>
            <div className="rack-info">
              {/* Modulo 4 so the numbers repeat 01-04 */}
              <span className="rack-num">0{(index % 4) + 1}</span>
              <span className="rack-name">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
