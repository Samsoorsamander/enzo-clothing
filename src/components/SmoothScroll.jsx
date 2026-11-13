import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Mobile stability fixes
ScrollTrigger.config({ ignoreMobileResize: true });

if (ScrollTrigger.isTouch === 1) {
  ScrollTrigger.normalizeScroll(true);
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // 1. Tell ScrollTrigger to update whenever Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis's raf from GSAP's ticker (single loop, no fighting)
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    // 3. Disable lag smoothing so scroll animations stay tight
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
