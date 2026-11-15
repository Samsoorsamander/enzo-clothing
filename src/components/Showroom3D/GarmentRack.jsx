import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

// Import the items from the parent so they stay in sync
import { RACK_ITEMS } from "./ShowroomCanvas";

function HangingGarment({
  item,
  isSelected,
  isAnySelected,
  onClick,
  view,
  selectedColor,
}) {
  const groupRef = useRef();
  const innerRef = useRef();
  const { scene } = useGLTF("/models/hoodie.glb");
  const clonedScene = scene.clone();
  const materialsRef = useRef([]);

  // Apply color
  useEffect(() => {
    materialsRef.current = [];
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        materialsRef.current.push(child.material);
        // If a custom color was picked, apply it, otherwise use the item's base color
        child.material.color.set(selectedColor || item.color);
      }
    });
  }, [clonedScene, item.color, selectedColor]);

  // Idle sway (only when nothing is selected)
  useFrame((state) => {
    if (groupRef.current && !isAnySelected) {
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.5 + item.position[0]) * 0.02;
    }
  });

  // Animate in/out when selection changes
  useEffect(() => {
    if (!groupRef.current) return;

    if (isSelected) {
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 0.5,
        z: 2,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(groupRef.current.rotation, {
        y: 0,
        z: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(groupRef.current.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 1,
        ease: "power3.inOut",
      });
    } else if (isAnySelected) {
      gsap.to(groupRef.current.position, {
        x: item.position[0] * 1.5,
        duration: 0.8,
        ease: "power2.in",
      });
      gsap.to(groupRef.current.scale, {
        x: 0.5,
        y: 0.5,
        z: 0.5,
        duration: 0.8,
      });
    } else {
      gsap.to(groupRef.current.position, {
        x: item.position[0],
        y: 0,
        z: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(groupRef.current.rotation, {
        y: 0,
        z: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [isSelected, isAnySelected, item.position]);

  // Front/Back rotation animation
  useEffect(() => {
    if (innerRef.current && isSelected) {
      gsap.to(innerRef.current.rotation, {
        y: view === "front" ? Math.PI : 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  }, [view, isSelected]);

  return (
    <group
      ref={groupRef}
      position={item.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(item.id);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Hanger */}
      <mesh position={[0, 1.8, 0]}>
        <torusGeometry args={[0.1, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* Inner group for front/back rotation */}
      <group ref={innerRef} rotation={[0, Math.PI, 0]}>
        <primitive object={clonedScene} scale={1} position={[0, -0.4, 0]} />
      </group>
    </group>
  );
}

export default function GarmentRack({
  selectedId,
  setSelectedId,
  view,
  selectedColor,
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (selectedId) {
      gsap.to(camera.position, {
        z: 6,
        y: 0,
        duration: 1,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(camera.position, {
        z: 8,
        y: 0,
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [selectedId, camera]);

  return (
    <group position={[0, -0.5, 0]}>
      {/* The Metal Rail */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 7, 16]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.1} />
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>

      {/* Vertical Poles */}
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

      {/* Render hoodies */}
      {RACK_ITEMS.map((item) => (
        <HangingGarment
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          isAnySelected={selectedId !== null}
          onClick={setSelectedId}
          view={view}
          selectedColor={selectedColor}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/hoodie.glb");
