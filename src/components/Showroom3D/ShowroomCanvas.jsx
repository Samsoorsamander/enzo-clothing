import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { Suspense, useState } from "react";
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

  const selectedItem = RACK_ITEMS.find((item) => item.id === selectedId);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
        // Lower DPR on mobile for performance
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile, // Disable antialias on mobile for speed
          alpha: true,
          powerPreference: "high-performance",
        }}
        // Freeze renders when nothing changes (huge battery saver)
        frameloop="demand"
      >
        <ambientLight intensity={0.6} />
        {/* Single spotlight on mobile, two on desktop */}
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
          />
          <Environment preset="studio" />
          {!isMobile && (
            <ContactShadows
              position={[0, -2.2, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              far={4}
            />
          )}
          {/* Auto-downgrades resolution if frame rate drops */}
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
