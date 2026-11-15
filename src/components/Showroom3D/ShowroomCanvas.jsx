import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";

import GarmentRack from "./GarmentRack";

function ShowroomLighting() {
  return (
    <>
      {/* Soft overall illumination */}
      <ambientLight intensity={0.75} />

      {/* Main light */}
      <directionalLight
        position={[4, 7, 6]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-bias={-0.0002}
      />

      {/* Left-side fill */}
      <directionalLight position={[-5, 3, 4]} intensity={0.8} />

      {/* Back light for depth */}
      <pointLight position={[0, 3, -4]} intensity={1.2} />

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
          position: [0, 0, 10],
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
          <ShowroomLighting />

          <GarmentRack selectedId={selectedId} onSelect={setSelectedId} />

          {/* Soft floor shadows */}
          <ContactShadows
            position={[0, -2.13, 0]}
            opacity={0.32}
            scale={10}
            blur={2.8}
            far={4.5}
            resolution={512}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
