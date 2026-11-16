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

function FoldingCoat({ progressRef }) {
  const group = useRef();
  const material = useRef();
  const texture = useTexture("/images/long-coat.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!group.current || !material.current) return;
    // Delay unfold until the box has started fading (first ~20% of scroll)
    const raw = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const p = THREE.MathUtils.smoothstep((raw - 0.12) / 0.75, 0, 1);
    const fold = 1 - p;

    group.current.scale.set(
      THREE.MathUtils.lerp(group.current.scale.x, 0.82 + p * 0.18, 0.12),
      THREE.MathUtils.lerp(group.current.scale.y, 0.42 + p * 0.58, 0.12),
      1,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      fold * 0.38 - 0.02,
      0.12,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      fold * -0.28 + p * 0.1,
      0.12,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      fold * -0.15,
      0.12,
    );

    material.current.opacity = THREE.MathUtils.lerp(
      material.current.opacity,
      0.85 + p * 0.15,
      0.15,
    );
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={group}>
        <Center>
          <mesh>
            <planeGeometry args={[2.1, 3.4]} />
            <meshStandardMaterial
              ref={material}
              map={texture}
              transparent
              opacity={0.9}
              alphaTest={0.12}
              roughness={0.9}
              metalness={0.04}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Center>
      </group>
    </Float>
  );
}

export default function UnfoldCoat3D({ progressRef }) {
  return (
    <div className="unfold-coat-canvas">
      <Canvas
        camera={{ position: [0, 0.15, 4.4], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, 2]} intensity={0.4} />
        <Suspense fallback={null}>
          <FoldingCoat progressRef={progressRef} />
          <Environment preset="warehouse" environmentIntensity={0.35} />
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={0.22}
            scale={7}
            blur={3}
            far={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
