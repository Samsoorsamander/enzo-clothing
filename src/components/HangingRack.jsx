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
