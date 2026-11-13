import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Preloader({ onComplete }) {
  const container = useRef(null);
  const logoRef = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onComplete?.();
        },
      });

      // 1. Logo draws in (stroke animation)
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );

      // 2. Hold briefly
      tl.to({}, { duration: 0.5 });

      // 3. Logo scales up and fades
      tl.to(logoRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      // 4. Curtain lifts up to reveal site
      tl.to(container.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      });
    },
    { scope: container },
  );

  if (done) return null;

  return (
    <div className="preloader" ref={container}>
      <div className="preloader-logo" ref={logoRef}>
        <svg
          viewBox="0 0 200 60"
          width="240"
          height="72"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="100"
            y="45"
            fontFamily="'Bodoni Moda', serif"
            fontSize="52"
            fontWeight="700"
            fill="#f5f0eb"
            textAnchor="middle"
            letterSpacing="-2"
          >
            ENZO
          </text>
          <circle cx="168" cy="14" r="3" fill="#8a7a65" />
        </svg>
      </div>
    </div>
  );
}
