import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
  Lightformer,
} from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import GarmentRack from "./GarmentRack";
import ShowroomUI from "./ShowroomUI";

export const RACK_ITEMS = [
  {
    id: 1,
    color: "#f2f0ea",
    name: "The Classic Hoodie",
    price: "$180",
  },
  {
    id: 2,
    color: "#1a1a1a",
    name: "The Midnight Hoodie",
    price: "$180",
  },
  {
    id: 3,
    color: "#8a7a65",
    name: "The Desert Hoodie",
    price: "$180",
  },
  {
    id: 4,
    color: "#a89880",
    name: "The Sand Hoodie",
    price: "$180",
  },
  {
    id: 5,
    color: "#4a6b8a",
    name: "The Ocean Hoodie",
    price: "$190",
  },
  {
    id: 6,
    color: "#6b4a3a",
    name: "The Cocoa Hoodie",
    price: "$190",
  },
];

const MAX_OFFSET = ((RACK_ITEMS.length - 1) / 2) * 1.85;

export default function ShowroomCanvas() {
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("front");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const activeIndexRef = useRef(0);
  const dragRef = useRef({ active: false, lastX: 0 });
  const wrapperRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth rail offset + publish active label
  useEffect(() => {
    let raf;
    const center = (RACK_ITEMS.length - 1) / 2;
    const tick = () => {
      offsetRef.current += (targetOffsetRef.current - offsetRef.current) * 0.12;

      const next = Math.round(
        Math.max(
          0,
          Math.min(
            RACK_ITEMS.length - 1,
            offsetRef.current / 1.85 + center,
          ),
        ),
      );
      activeIndexRef.current = next;
      if (next !== activeIndex) setActiveIndex(next);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex]);

  const clampOffset = useCallback((v) => {
    return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));
  }, []);

  const onPointerDown = (e) => {
    if (selectedId) return;
    dragRef.current = { active: true, lastX: e.clientX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active || selectedId) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;
    // Drag right → garments move right → offset decreases
    targetOffsetRef.current = clampOffset(
      targetOffsetRef.current - dx * 0.012,
    );
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const onWheel = (e) => {
    if (selectedId) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetOffsetRef.current = clampOffset(
      targetOffsetRef.current + delta * 0.004,
    );
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [selectedId, clampOffset]);

  const selectedItem = RACK_ITEMS.find((item) => item.id === selectedId);
  const browsingItem = RACK_ITEMS[activeIndex];

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
    setView("front");
    setSelectedColor(null);
  };

  const handleClose = () => {
    setSelectedId(null);
    setView("front");
    setSelectedColor(null);
  };

  return (
    <div
      ref={wrapperRef}
      className={`showroom-canvas-wrapper ${selectedId ? "focused" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        camera={{ position: [0, 0.2, 7.2], fov: 42 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={prefersReducedMotion ? "demand" : "always"}
      >
        <ambientLight intensity={0.65} />
        <spotLight
          position={[4, 8, 5]}
          angle={0.35}
          penumbra={1}
          intensity={isMobile ? 1.8 : 1.4}
          castShadow={!isMobile}
        />
        {!isMobile && (
          <spotLight
            position={[-5, 4, -3]}
            angle={0.4}
            penumbra={1}
            intensity={0.7}
          />
        )}

        <Suspense fallback={null}>
          <GarmentRack
            selectedId={selectedId}
            setSelectedId={handleSelect}
            view={view}
            selectedColor={selectedColor}
            prefersReducedMotion={prefersReducedMotion}
            offsetRef={offsetRef}
          />
          <Environment preset="apartment">
            <Lightformer
              intensity={1.1}
              position={[0, 5, 2]}
              scale={[10, 2, 1]}
              form="rect"
            />
          </Environment>
          {!isMobile && (
            <ContactShadows
              position={[0, -2.15, 0]}
              opacity={0.35}
              scale={14}
              blur={2.8}
              far={5}
            />
          )}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>

      {/* Browsing hint / active piece name */}
      {!selectedId && browsingItem && (
        <div className="rack-browse-meta" key={browsingItem.id}>
          <span className="rack-browse-name">{browsingItem.name}</span>
          <span className="rack-browse-price">{browsingItem.price}</span>
          <span className="rack-browse-hint">Drag or scroll · Click to open</span>
        </div>
      )}

      <ShowroomUI
        selectedItem={selectedItem}
        view={view}
        setView={setView}
        onClose={handleClose}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>
  );
}
