import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";

import GarmentRack from "./GarmentRack";

function StudioLighting() {
  return (
    <>
      {/* Soft ambient illumination */}
      <ambientLight intensity={0.65} />

      {/* Main studio light */}
      <directionalLight
        position={[4, 7, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-far={20}
        shadow-bias={-0.00015}
      />

      {/* Left fill light */}
      <directionalLight position={[-5, 3, 4]} intensity={0.8} />

      {/* Soft back illumination */}
      <pointLight position={[0, 3, -4]} intensity={1.1} />

      {/* Studio environment reflections */}
      <Environment preset="studio" />
    </>
  );
}

export default function ShowroomCanvas() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="showroom-canvas-wrapper">
      <Canvas
        shadows
        camera={{
          position: [0, 0.35, 10],
          fov: 38,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <StudioLighting />

          <GarmentRack selectedId={selectedId} onSelect={setSelectedId} />

          {/* Natural contact shadows beneath the garments */}
          <ContactShadows
            position={[0, -0.04, 0.3]}
            opacity={0.28}
            scale={9}
            blur={3}
            far={3.5}
            resolution={512}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
