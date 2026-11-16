import { useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const HeroCoat3D = lazy(() => import("./HeroCoat3D"));

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const container = useRef(null);
  const line1 = useRef(null);
  const line2 = useRef(null);
  const garment = useRef(null);
  const progressRef = useRef(0);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: window.innerWidth < 768 ? "+=60%" : "+=80%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Coat stays visible; scroll settles it into place with a soft drop
      tl.fromTo(
        garment.current,
        { y: window.innerWidth < 768 ? -40 : -64, opacity: 0.92 },
        { y: 0, opacity: 1, ease: "power2.out" },
        0,
      );

      tl.to(line1.current, { x: -120, ease: "power2.inOut" }, 0.2);
      tl.to(line2.current, { x: 120, ease: "power2.inOut" }, 0.2);
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

      <div className="hero-garment" ref={garment}>
        <Suspense
          fallback={
            <img
              src="/images/hero-coat.png"
              alt="Enzo Signature Coat"
              className="hero-image"
            />
          }
        >
          <HeroCoat3D progressRef={progressRef} />
        </Suspense>
      </div>

      <p className="hero-sub">New Collection — SS26</p>
    </section>
  );
}
