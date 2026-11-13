import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Skip on touch devices — no cursor needed
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const label = labelRef.current;

    // quickTo gives us 60fps interpolation with a lag effect
    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });
    const labelXTo = gsap.quickTo(label, "x", {
      duration: 0.2,
      ease: "power3",
    });
    const labelYTo = gsap.quickTo(label, "y", {
      duration: 0.2,
      ease: "power3",
    });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      labelXTo(e.clientX);
      labelYTo(e.clientY);
    };

    const enterLink = () => {
      gsap.to(dot, { scale: 2.5, duration: 0.3, ease: "power3.out" });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    const leaveLink = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power3.out" });
    };

    const enterCard = () => {
      gsap.to(dot, {
        scale: 4,
        backgroundColor: "#f5f0eb",
        mixBlendMode: "difference",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(label, { opacity: 1, duration: 0.3, delay: 0.1 });
    };

    const leaveCard = () => {
      gsap.to(dot, {
        scale: 1,
        backgroundColor: "#1a1a1a",
        mixBlendMode: "normal",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", move);

    // Attach listeners to links and cards
    const links = document.querySelectorAll("a, button");
    const cards = document.querySelectorAll(".look-card, .rack-panel");

    links.forEach((el) => {
      el.addEventListener("mouseenter", enterLink);
      el.addEventListener("mouseleave", leaveLink);
    });

    cards.forEach((el) => {
      el.addEventListener("mouseenter", enterCard);
      el.addEventListener("mouseleave", leaveCard);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", enterLink);
        el.removeEventListener("mouseleave", leaveLink);
      });
      cards.forEach((el) => {
        el.removeEventListener("mouseenter", enterCard);
        el.removeEventListener("mouseleave", leaveCard);
      });
    };
  }, []);

  // Hide entirely on touch devices via CSS, but still render DOM
  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-label" ref={labelRef}>
        View
      </div>
    </>
  );
}
