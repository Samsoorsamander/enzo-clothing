import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Logo from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const section = useRef(null);
  const watermark = useRef(null);
  const content = useRef(null);

  useGSAP(
    () => {
      // Watermark rises as footer enters
      gsap.fromTo(
        watermark.current,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      // Content staggers up
      const items = gsap.utils.toArray(".footer-reveal", content.current);
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: section },
  );

  return (
    <footer className="footer" ref={section}>
      <div className="footer-watermark" ref={watermark}>
        ENZO
      </div>

      <div className="footer-content" ref={content}>
        <div className="footer-newsletter footer-reveal">
          <span className="footer-kicker">Newsletter</span>
          <p className="footer-headline">
            Be the first to know. <em>Quietly.</em>
          </p>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div className="footer-links footer-reveal">
          <div className="footer-col">
            <span className="footer-col-title">Shop</span>
            <a href="#">Coats</a>
            <a href="#">Shirts</a>
            <a href="#">Trousers</a>
            <a href="#">Accessories</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Info</span>
            <a href="#">About</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Social</span>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">TikTok</a>
          </div>
        </div>

        <div className="footer-bottom footer-reveal">
          <Logo size={18} />
          <span className="footer-copy">
            © {new Date().getFullYear()} Enzo Clothing. All rights reserved.
          </span>
          <span className="footer-made">Made with care</span>
        </div>
      </div>
    </footer>
  );
}
