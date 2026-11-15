import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useState } from "react";
import GarmentRack from "./GarmentRack";
import ShowroomUI from "./ShowroomUI";

// We define the items here so BOTH the 3D rack and the HTML overlay can access them
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
  const [view, setView] = useState("front"); // "front" | "back"
  const [selectedColor, setSelectedColor] = useState(null);

  const selectedItem = RACK_ITEMS.find((item) => item.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
    setView("front"); // Reset view on new selection
    setSelectedColor(null); // Reset color on new selection
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
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <spotLight
          position={[5, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <spotLight
          position={[-5, 5, -5]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
        />

        <Suspense fallback={null}>
          <GarmentRack
            selectedId={selectedId}
            setSelectedId={handleSelect}
            view={view}
            selectedColor={selectedColor}
          />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
        </Suspense>
      </Canvas>

      {/* HTML Overlay */}
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
