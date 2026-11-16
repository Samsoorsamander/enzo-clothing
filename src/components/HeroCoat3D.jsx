import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  useTexture,
  ContactShadows,
  Environment,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

function CoatMesh({ progressRef }) {
  const group = useRef();
  const texture = useTexture("/images/hero-coat.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current ?? 0;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -0.15 + p * 0.55,
      0.08,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.05 - p * 0.08,
      0.08,
    );
    const s = 0.92 + p * 0.12;
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, s, 0.08),
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={group}>
        <Center>
          <mesh>
            <planeGeometry args={[2.4, 3.2]} />
            <meshStandardMaterial
              map={texture}
              transparent
              alphaTest={0.2}
              roughness={0.85}
              metalness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Center>
      </group>
    </Float>
  );
}

export default function HeroCoat3D({ progressRef }) {
  return (
    <div className="hero-coat-canvas">
      <Canvas
        camera={{ position: [0, 0.1, 4.2], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 2]} intensity={1.15} />
        <directionalLight position={[-2, 1, 3]} intensity={0.35} />
        <Suspense fallback={null}>
          <CoatMesh progressRef={progressRef} />
          <Environment preset="studio" environmentIntensity={0.45} />
          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.28}
            scale={6}
            blur={2.8}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
