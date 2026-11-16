import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import GarmentRack from "./GarmentRack";
import ShowroomUI from "./ShowroomUI";

export const RACK_ITEMS = [
  {
    id: 1,
    color: "#ffffff",
    name: "The Classic Hoodie",
    price: "$180",
    position: [-2.4, 0, 0],
  },
  {
    id: 2,
    color: "#1a1a1a",
    name: "The Midnight Hoodie",
    price: "$180",
    position: [-0.8, 0, 0],
  },
  {
    id: 3,
    color: "#8a7a65",
    name: "The Desert Hoodie",
    price: "$180",
    position: [0.8, 0, 0],
  },
  {
    id: 4,
    color: "#a89880",
    name: "The Sand Hoodie",
    price: "$180",
    position: [2.4, 0, 0],
  },
];

export default function ShowroomCanvas() {
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("front");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check window size and motion preference on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedItem = RACK_ITEMS.find((item) => item.id === selectedId);

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
    <div className={`showroom-canvas-wrapper ${selectedId ? "focused" : ""}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={prefersReducedMotion ? "demand" : "always"}
      >
        <ambientLight intensity={0.6} />
        <spotLight
          position={[5, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={isMobile ? 2 : 1.5}
          castShadow={!isMobile}
        />
        {!isMobile && (
          <spotLight
            position={[-5, 5, -5]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
          />
        )}

        <Suspense fallback={null}>
          <GarmentRack
            selectedId={selectedId}
            setSelectedId={handleSelect}
            view={view}
            selectedColor={selectedColor}
            prefersReducedMotion={prefersReducedMotion}
          />
          <Environment preset="studio">
            <Lightformer
              intensity={1.2}
              position={[0, 4, 2]}
              scale={[8, 2, 1]}
              form="rect"
            />
            <Lightformer
              intensity={0.6}
              position={[-4, 1, -2]}
              scale={[4, 4, 1]}
              form="ring"
              color="#c9b99a"
            />
          </Environment>
          {!isMobile && !prefersReducedMotion && (
            <Sparkles
              count={28}
              scale={[8, 4, 2]}
              size={2.5}
              speed={0.35}
              opacity={0.25}
              color="#c9b99a"
            />
          )}
          {!isMobile && (
            <ContactShadows
              position={[0, -2.2, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              far={4}
            />
          )}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>

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
