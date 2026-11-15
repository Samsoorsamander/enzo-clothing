import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useState } from "react";
import GarmentRack from "./GarmentRack";

export default function ShowroomCanvas() {
  const [selectedId, setSelectedId] = useState(null);

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
          <GarmentRack selectedId={selectedId} setSelectedId={setSelectedId} />
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
    </div>
  );
}
