import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FOLDS = 5;

export default function Unfold() {
  const section = useRef(null);
  const stack = useRef(null);
  const inner = useRef(null);
  const folds = useRef([]);
  const label = useRef(null);

  useGSAP(
    () => {
      const panels = folds.current.filter(Boolean);
      const shell = stack.current;
      const coat = inner.current;
      if (!panels.length || !shell || !coat) return;

      const fullHeight = coat.offsetHeight;
      const strip = fullHeight / FOLDS;

      // Only the top strip is visible — a real folded coat packet
      gsap.set(shell, { height: strip, overflow: "hidden" });
      gsap.set(panels[0], { rotateX: 0 });
      panels.slice(1).forEach((panel) => {
        gsap.set(panel, { rotateX: 88, transformOrigin: "top center" });
      });
      gsap.set(shell, {
        rotateX: 10,
        y: 40,
        scale: 0.96,
        transformOrigin: "center top",
      });
      gsap.set(label.current, { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: window.innerWidth < 768 ? "+=170%" : "+=220%",
          scrub: 1.15,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        shell,
        { rotateX: 5, y: 16, scale: 0.98, duration: 0.12, ease: "none" },
        0,
      );

      // Each section falls open while the packet grows taller
      panels.slice(1).forEach((panel, i) => {
        const at = 0.1 + i * 0.17;
        tl.to(
          shell,
          {
            height: strip * (i + 2),
            duration: 0.17,
            ease: "none",
          },
          at,
        );
        tl.to(
          panel,
          {
            rotateX: 0,
            duration: 0.17,
            ease: "none",
          },
          at,
        );
      });

      tl.to(
        shell,
        {
          height: fullHeight,
          rotateX: 0,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "none",
        },
        0.82,
      );

      tl.to(
        label.current,
        { opacity: 1, y: 0, duration: 0.2, ease: "none" },
        0.9,
      );
    },
    { scope: section },
  );

  return (
    <section className="unfold" ref={section}>
      <div className="unfold-stage">
        <div
          className="unfold-stack"
          ref={stack}
          aria-label="Long coat unfolding"
        >
          <div className="unfold-inner" ref={inner}>
            {Array.from({ length: FOLDS }, (_, i) => (
              <div
                className="unfold-fold"
                key={i}
                ref={(el) => {
                  folds.current[i] = el;
                }}
                style={{ top: `${(i / FOLDS) * 100}%` }}
              >
                <div className="unfold-fold-face">
                  <img
                    src="/images/long-coat.png"
                    alt={i === 0 ? "Enzo Long Coat" : ""}
                    aria-hidden={i !== 0}
                    className="unfold-fold-image"
                    style={{ top: `${-i * 100}%` }}
                  />
                  <span className="unfold-fold-shade" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="unfold-label" ref={label}>
        <span className="unfold-kicker">Signature Piece</span>
        <h2 className="unfold-title">The Long Coat</h2>
        <p className="unfold-desc">
          Hand-finished wool. Folded tight, then opened on the scroll.
        </p>
      </div>
    </section>
  );
}
