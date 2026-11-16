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
          end: window.innerWidth < 768 ? "+=70%" : "+=90%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(garment.current, {
        y: window.innerWidth < 768 ? -28 : -48,
        rotateY: -18,
        rotateX: 6,
        scale: 0.92,
      });

      tl.to(
        garment.current,
        {
          y: 0,
          rotateY: 12,
          rotateX: 0,
          scale: 1.04,
          ease: "none",
          duration: 1,
        },
        0,
      );

      tl.to(line1.current, { x: -120, ease: "none", duration: 0.8 }, 0.15);
      tl.to(line2.current, { x: 120, ease: "none", duration: 0.8 }, 0.15);
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

      <div className="hero-garment">
        <div className="hero-garment-inner" ref={garment}>
          <img
            src="/images/hero-coat.png"
            alt="Enzo Signature Coat"
            className="hero-image"
            draggable="false"
          />
        </div>
      </div>

      <p className="hero-sub">New Collection — SS26</p>
    </section>
  );
}
