import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const garments = [
  { id: 1, name: "Oversized Coat", image: "/images/rack/coat.jpg" },
  { id: 2, name: "Silk Shirt", image: "/images/rack/shirt.jpg" },
  { id: 3, name: "Wide Trousers", image: "/images/rack/trousers.jpg" },
  { id: 4, name: "Knit Vest", image: "/images/rack/vest.jpg" },
];

export default function HangingRack() {
  const section = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop — full horizontal pin
      mm.add("(min-width: 769px)", () => {
        const panels = gsap.utils.toArray(".rack-panel", track.current);

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

        // Sway each garment on entry
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

      // Mobile — same horizontal pin, tuned parameters
      mm.add("(max-width: 768px)", () => {
        const panels = gsap.utils.toArray(".rack-panel", track.current);

        gsap.to(track.current, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            pin: true,
            // Faster scrub so shorter mobile scrolls feel responsive
            scrub: 0.6,
            start: "top top",
            // Shorter pin distance on mobile — less scrolling required
            end: () => "+=" + track.current.offsetWidth * 0.9,
            // Recalculate on orientation change (iOS quirk)
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
        {garments.map((item) => (
          <div className="rack-panel" key={item.id}>
            <div className="rack-hanger-bar" />
            <div className="rack-garment">
              <div className="rack-garment">
                <img
                  src={item.image}
                  alt={`Enzo — ${item.name}`}
                  loading="lazy"
                />
              </div>
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
