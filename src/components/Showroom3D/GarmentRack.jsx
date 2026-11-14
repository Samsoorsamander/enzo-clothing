import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// We use the same hoodie model but tint it to simulate a collection
const RACK_ITEMS = [
  { id: 1, color: "#ffffff", position: [-2.4, 0, 0] },
  { id: 2, color: "#1a1a1a", position: [-0.8, 0, 0] },
  { id: 3, color: "#8a7a65", position: [0.8, 0, 0] },
  { id: 4, color: "#a89880", position: [2.4, 0, 0] },
];

function HangingGarment({ color, position }) {
  const groupRef = useRef();
  // Load the hoodie we already compressed
  const { scene } = useGLTF("/models/hoodie.glb");

  // Clone the scene so each rack item has its own independent materials
  const clonedScene = scene.clone();

  // Traverse the cloned scene and apply the color to the fabric material
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      // Note: You may need to change "fabric" to match the actual material name
      // inside your GLB file (e.g., "Material_0", "cloth", etc.)
      // For now, we apply the color to all meshes.
      if (child.material) {
        child.material = child.material.clone();
        child.material.color.set(color);
      }
    }
  });

  // Subtle idle sway like they are hanging on a rack
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hanger */}
      <mesh position={[0, 1.8, 0]}>
        {/* Hanger hook */}
        <torusGeometry args={[0.1, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        {/* Hanger bar */}
        <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        {/* Rotate the bar so it's horizontal */}
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* The 3D Model */}
      <primitive
        object={clonedScene}
        scale={1}
        position={[0, -0.4, 0]}
        rotation={[0, Math.PI, 0]} // Face forward
      />
    </group>
  );
}

export default function GarmentRack() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* The Metal Rail */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 7, 16]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
        {/* Rotate to horizontal */}
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* Vertical Support Poles (left and right) */}
      <mesh position={[-3.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 4.4, 16]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[3.4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 4.4, 16]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Base Bar */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 6.8, 16]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* Render 4 hoodies on the rack */}
      {RACK_ITEMS.map((item) => (
        <HangingGarment
          key={item.id}
          color={item.color}
          position={item.position}
        />
      ))}
    </group>
  );
}

// Preload the model so it doesn't flash when the section loads
useGLTF.preload("/models/hoodie.glb");
