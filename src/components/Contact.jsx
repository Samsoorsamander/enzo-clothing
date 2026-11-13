import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const successRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setStatus("success");
      formRef.current.reset();

      // Animate success message in
      requestAnimationFrame(() => {
        if (successRef.current) {
          gsap.fromTo(
            successRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          );
        }
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(err?.text || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <div className="contact-header">
          <span className="contact-kicker">Get in Touch</span>
          <h2 className="contact-title">Contact</h2>
          <p className="contact-desc">
            Questions about sizing, orders, or press? Write to us.
          </p>
        </div>

        {status === "success" ? (
          <div className="contact-success" ref={successRef}>
            <p className="contact-success-title">Message sent.</p>
            <p className="contact-success-sub">
              We'll be in touch within 2 business days.
            </p>
            <button className="contact-reset" onClick={() => setStatus("idle")}>
              Send another →
            </button>
          </div>
        ) : (
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="from_name">Name</label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                placeholder="Your name"
                required
                disabled={status === "sending"}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="from_email">Email</label>
              <input
                type="email"
                id="from_email"
                name="from_email"
                placeholder="you@email.com"
                required
                disabled={status === "sending"}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us what's on your mind..."
                required
                disabled={status === "sending"}
              />
            </div>

            {status === "error" && <p className="contact-error">{errorMsg}</p>}

            <button
              type="submit"
              className="contact-submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
