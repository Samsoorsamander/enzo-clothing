import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee({
  text = "ENZO · SS26 · WEAR THE FUTURE · ",
  speed = 30,
  direction = 1,
  variant = "dark",
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let tween;

    const start = () => {
      const halfWidth = track.scrollWidth / 2;
      if (!halfWidth) return;

      gsap.set(track, { x: direction > 0 ? 0 : -halfWidth });

      tween = gsap.to(track, {
        x: direction > 0 ? -halfWidth : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    // Wait one frame so flex layout + fonts have real width
    const raf = requestAnimationFrame(start);

    return () => {
      cancelAnimationFrame(raf);
      tween?.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [text, speed, direction]);

  const items = Array.from({ length: 8 });

  return (
    <section className={`marquee ${variant === "cream" ? "cream" : ""}`}>
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
