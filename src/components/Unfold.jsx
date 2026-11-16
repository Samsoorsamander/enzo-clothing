import { useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const UnfoldCoat3D = lazy(() => import("./UnfoldCoat3D"));

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Unfold() {
  const section = useRef(null);
  const box = useRef(null);
  const label = useRef(null);
  const progressRef = useRef(0);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: window.innerWidth < 768 ? "+=100%" : "+=150%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      tl.to(box.current, { y: -48, opacity: 0, duration: 0.35 }, 0);

      tl.fromTo(
        label.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.55,
      );
    },
    { scope: section },
  );

  return (
    <section className="unfold" ref={section}>
      <div className="unfold-stage">
        <div className="unfold-box" ref={box}>
          <svg viewBox="0 0 160 120" width="160" height="120" aria-hidden="true">
            <rect
              x="10"
              y="40"
              width="140"
              height="70"
              fill="#c9b99a"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <rect
              x="10"
              y="20"
              width="140"
              height="30"
              fill="#b8a88a"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <line
              x1="80"
              y1="20"
              x2="80"
              y2="50"
              stroke="#1a1a1a"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        <div className="unfold-garment">
          <Suspense
            fallback={
              <img
                src="/images/long-coat.png"
                alt="Enzo Long Coat"
                className="unfold-image"
              />
            }
          >
            <UnfoldCoat3D progressRef={progressRef} />
          </Suspense>
        </div>
      </div>

      <div className="unfold-label" ref={label}>
        <span className="unfold-kicker">Signature Piece</span>
        <h2 className="unfold-title">The Long Coat</h2>
        <p className="unfold-desc">
          Hand-finished wool. Unfolds from a single box.
        </p>
      </div>
    </section>
  );
}
