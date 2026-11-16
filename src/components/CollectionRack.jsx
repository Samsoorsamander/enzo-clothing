import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ShowroomUI from "./Showroom3D/ShowroomUI";

export const RACK_ITEMS = [
  {
    id: 1,
    name: "The Long Coat",
    price: "$420",
    image: "/images/rack/long-coat.png",
    color: "#c4b39a",
  },
  {
    id: 2,
    name: "The Signature Coat",
    price: "$380",
    image: "/images/rack/hero-coat.png",
    color: "#b8a07a",
  },
  {
    id: 3,
    name: "The Studio Coat",
    price: "$360",
    image: "/images/rack/coat.png",
    color: "#a89880",
  },
  {
    id: 4,
    name: "The Soft Vest",
    price: "$180",
    image: "/images/rack/vest.png",
    color: "#8a7a65",
  },
  {
    id: 5,
    name: "The Easy Shirt",
    price: "$140",
    image: "/images/rack/shirt.png",
    color: "#d4c5b0",
  },
  {
    id: 6,
    name: "The Line Trouser",
    price: "$220",
    image: "/images/rack/trousers.png",
    color: "#6b5a48",
  },
];

const SPACING = 220; // px between hangers

export default function CollectionRack() {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("front");
  const [selectedColor, setSelectedColor] = useState(null);

  const maxOffset = useMemo(
    () => ((RACK_ITEMS.length - 1) / 2) * SPACING,
    [],
  );

  const clamp = (v) => Math.max(-maxOffset, Math.min(maxOffset, v));

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  // Smooth drag/scroll + side-profile → front-face by distance from center
  useEffect(() => {
    let raf;
    const tick = () => {
      // While a product is focused, GSAP owns transforms
      if (selectedIdRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      offsetRef.current += (targetRef.current - offsetRef.current) * 0.14;
      const offset = offsetRef.current;
      let closest = 0;
      let closestDist = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const slot = (i - (RACK_ITEMS.length - 1) / 2) * SPACING;
        const x = slot - offset;
        const dist = Math.abs(x);
        const face = 1 - Math.min(dist / 170, 1); // 1 at center
        const rotY = Math.max(-78, Math.min(78, x * 0.42));
        const scale = 0.72 + face * 0.4;
        const z = face * 80;

        el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-rotY}deg) scale(${scale})`;
        el.style.zIndex = String(Math.round(face * 20) + 1);
        el.style.opacity = String(0.55 + face * 0.45);
        el.dataset.face = face > 0.65 ? "1" : "0";

        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      setActiveIndex((prev) => (prev === closest ? prev : closest));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (selectedId) return;
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetRef.current = clamp(targetRef.current + delta * 0.9);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [selectedId, maxOffset]);

  // Focus animation
  useEffect(() => {
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const item = RACK_ITEMS[i];
      if (!selectedId) {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform,filter,opacity" });
        return;
      }
      if (item.id === selectedId) {
        gsap.to(el, {
          x: 0,
          z: 120,
          rotateY: view === "back" ? 180 : 0,
          scale: 1.25,
          opacity: 1,
          duration: 0.7,
          ease: "power3.inOut",
        });
      } else {
        const side = i < activeIndex ? -1 : 1;
        gsap.to(el, {
          x: side * (420 + Math.abs(i - activeIndex) * 40),
          z: -60,
          rotateY: side * 70,
          scale: 0.55,
          opacity: 0.25,
          duration: 0.65,
          ease: "power2.inOut",
        });
      }
    });
  }, [selectedId, view, activeIndex]);

  const onPointerDown = (e) => {
    if (selectedId) return;
    dragRef.current = { active: true, x: e.clientX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.active || selectedId) return;
    const dx = e.clientX - dragRef.current.x;
    dragRef.current.x = e.clientX;
    targetRef.current = clamp(targetRef.current - dx);
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const selectedItem = RACK_ITEMS.find((i) => i.id === selectedId) || null;
  const browsing = RACK_ITEMS[activeIndex];

  return (
    <div
      className={`collection-rack ${selectedId ? "focused" : ""}`}
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="collection-rail" aria-hidden="true">
        <span className="collection-rail-bar" />
        <span className="collection-rail-post collection-rail-post--left" />
        <span className="collection-rail-post collection-rail-post--right" />
      </div>

      <div className="collection-stage">
        {RACK_ITEMS.map((item, i) => (
          <button
            type="button"
            className="collection-item"
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => {
              if (Math.abs(targetRef.current - offsetRef.current) > 8) return;
              setSelectedId(item.id);
              setView("front");
              setSelectedColor(null);
            }}
            aria-label={item.name}
          >
            <span className="collection-hanger" aria-hidden="true" />
            <img
              src={item.image}
              alt=""
              className="collection-image"
              draggable="false"
            />
          </button>
        ))}
      </div>

      {!selectedId && browsing && (
        <div className="rack-browse-meta" key={browsing.id}>
          <span className="rack-browse-name">{browsing.name}</span>
          <span className="rack-browse-price">{browsing.price}</span>
          <span className="rack-browse-hint">Drag or scroll · Click to open</span>
        </div>
      )}

      <ShowroomUI
        selectedItem={selectedItem}
        view={view}
        setView={setView}
        onClose={() => {
          setSelectedId(null);
          setView("front");
          setSelectedColor(null);
        }}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>
  );
}
