import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function OrderSuccess({ order, onDismiss }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    if (!order) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    const check = checkRef.current;

    const tl = gsap.timeline();
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    tl.fromTo(
      content,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3",
    );

    // Draw the checkmark path
    const path = check.querySelector(".check-path");
    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=0.2",
    );

    // Fade in the rest of the content
    const details = content.querySelectorAll(".success-animate");
    tl.fromTo(
      details,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" },
      "-=0.4",
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [order]);

  if (!order) return null;

  return (
    <div className="success-overlay" ref={overlayRef}>
      <div className="success-content" ref={contentRef}>
        <svg
          className="success-check"
          ref={checkRef}
          viewBox="0 0 80 80"
          width="80"
          height="80"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#8a7a65"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            className="check-path"
            d="M24 42 L36 54 L58 28"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="success-kicker success-animate">Order Confirmed</span>
        <h2 className="success-title success-animate">Thank you.</h2>
        <p className="success-desc success-animate">
          Your order has been received and is being prepared with care. You'll
          receive a confirmation email shortly.
        </p>

        <div className="success-meta success-animate">
          <div>
            <span className="success-meta-label">Order</span>
            <span className="success-meta-value">#{order.id}</span>
          </div>
          <div>
            <span className="success-meta-label">Total</span>
            <span className="success-meta-value">
              ${order.total.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="success-meta-label">Items</span>
            <span className="success-meta-value">{order.count}</span>
          </div>
        </div>

        <button
          className="success-continue success-animate"
          onClick={onDismiss}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
