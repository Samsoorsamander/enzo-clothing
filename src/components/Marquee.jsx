import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Marquee({
  text = "ENZO · SS26 · WEAR THE FUTURE · ",
  speed = 30,
  direction = 1,
}) {
  const section = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;

      // Continuous scroll loop — xPercent -50 then reset instantly
      const tween = gsap.to(track, {
        xPercent: -50 * direction,
        duration: speed,
        ease: "none",
        repeat: -1,
      });

      // Optional: skew the track based on scroll velocity
      const skewSetter = gsap.quickSetter(track, "skewX", "deg");
      const clamp = gsap.utils.clamp(-8, 8);

      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -300);
          skewSetter(skew);
          gsap.to(track, {
            skewX: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });

      return () => {
        tween.kill();
      };
    },
    { scope: section },
  );

  // Render text 4 times so the loop never shows a gap
  const items = Array.from({ length: 4 });

  return (
    <section className="marquee" ref={section}>
      <div className="marquee-track" ref={trackRef}>
        {items.map((_, i) => (
          <span className="marquee-item" key={i}>
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
