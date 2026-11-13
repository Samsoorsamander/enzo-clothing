import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProductModal from "./ProductModal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const looks = [
  {
    id: 1,
    name: "Look 01",
    image: "/images/lookbook/look-01.jpg",
    price: "$480",
  },
  {
    id: 2,
    name: "Look 02",
    image: "/images/lookbook/look-02.jpg",
    price: "$260",
  },
  {
    id: 3,
    name: "Look 03",
    image: "/images/lookbook/look-03.jpg",
    price: "$320",
  },
  {
    id: 4,
    name: "Look 04",
    image: "/images/lookbook/look-04.jpg",
    price: "$290",
  },
  {
    id: 5,
    name: "Look 05",
    image: "/images/lookbook/look-05.jpg",
    price: "$540",
  },
  {
    id: 6,
    name: "Look 06",
    image: "/images/lookbook/look-06.jpg",
    price: "$210",
  },
];

export default function LookBook() {
  const section = useRef(null);
  const [selected, setSelected] = useState(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".look-card", section.current);

      cards.forEach((card) => {
        const inner = card.querySelector(".look-inner");

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
            onClick={() => setSelected(look)}
          >
            <div className="look-inner">
              <div className="look-image">
                <img
                  src={look.image}
                  alt={`Enzo SS26 — ${look.name}`}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="look-info">
              <span className="look-name">{look.name}</span>
              <span className="look-view">View →</span>
            </div>
          </article>
        ))}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
