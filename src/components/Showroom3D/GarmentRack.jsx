import { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { RACK_ITEMS } from "./ShowroomCanvas";

const SPACING = 1.85;

function HangingGarment({
  item,
  index,
  offsetRef,
  selectedId,
  onSelect,
  view,
  selectedColor,
  prefersReducedMotion,
}) {
  const groupRef = useRef();
  const hangerRef = useRef();
  const innerRef = useRef();
  const { scene } = useGLTF("/models/hoodie.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { invalidate } = useThree();
  const slotX = (index - (RACK_ITEMS.length - 1) / 2) * SPACING;
  const isSelected = selectedId === item.id;
  const isAnySelected = selectedId !== null;

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.color.set(selectedColor || item.color);
        child.material.roughness = 0.85;
        child.material.metalness = 0.05;
      }
    });
    invalidate();
  }, [clonedScene, item.color, selectedColor, invalidate]);

  useFrame((state) => {
    if (!groupRef.current || !innerRef.current) return;

    const t = state.clock.elapsedTime;
    const offset = offsetRef.current;

    if (isSelected) {
      // Focus handled by GSAP — keep a soft sway
      if (!prefersReducedMotion && hangerRef.current) {
        hangerRef.current.rotation.z = Math.sin(t * 1.4) * 0.015;
      }
      return;
    }

    if (isAnySelected) return;

    // Position on the rail relative to scroll/drag offset
    const x = slotX - offset;
    const dist = x;
    const faceAmount = 1 - Math.min(Math.abs(dist) / 1.35, 1);
    const targetRotY = THREE.MathUtils.clamp(dist * 1.35, -1.55, 1.55);
    const targetScale = 0.78 + faceAmount * 0.42;
    const targetZ = faceAmount * 0.35;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      x,
      0.14,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      0,
      0.12,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.12,
    );

    innerRef.current.rotation.y = THREE.MathUtils.lerp(
      innerRef.current.rotation.y,
      Math.PI + targetRotY,
      0.12,
    );
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12),
    );

    // Idle hanger sway
    if (!prefersReducedMotion && hangerRef.current) {
      hangerRef.current.rotation.z =
        Math.sin(t * 1.6 + slotX * 2.1) * 0.03 * (0.4 + faceAmount);
    }

    invalidate();
  });

  // Focus / unfocus camera staging
  useEffect(() => {
    if (!groupRef.current) return;

    if (isSelected) {
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 0.35,
        z: 1.6,
        duration: 1,
        ease: "power3.inOut",
        onUpdate: invalidate,
      });
      gsap.to(groupRef.current.scale, {
        x: 1.45,
        y: 1.45,
        z: 1.45,
        duration: 1,
        ease: "power3.inOut",
        onUpdate: invalidate,
      });
      gsap.to(innerRef.current.rotation, {
        y: Math.PI,
        duration: 0.9,
        ease: "power3.inOut",
        onUpdate: invalidate,
      });
    } else if (isAnySelected) {
      const side = slotX < 0 ? -1 : 1;
      gsap.to(groupRef.current.position, {
        x: side * (3.2 + Math.abs(slotX) * 0.15),
        y: 0,
        z: -1.2,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: invalidate,
      });
      gsap.to(groupRef.current.scale, {
        x: 0.55,
        y: 0.55,
        z: 0.55,
        duration: 0.85,
        onUpdate: invalidate,
      });
      gsap.to(innerRef.current.rotation, {
        y: Math.PI + side * 1.2,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: invalidate,
      });
    } else {
      // Return to rail — useFrame will take over positions
      gsap.killTweensOf(groupRef.current.position);
      gsap.killTweensOf(groupRef.current.scale);
      gsap.killTweensOf(innerRef.current.rotation);
    }
  }, [isSelected, isAnySelected, slotX, invalidate]);

  // Front / back while focused
  useEffect(() => {
    if (!innerRef.current || !isSelected) return;
    gsap.to(innerRef.current.rotation, {
      y: view === "front" ? Math.PI : 0,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: invalidate,
    });
  }, [view, isSelected, invalidate]);

  return (
    <group ref={groupRef} position={[slotX, 0, 0]}>
      <group ref={hangerRef}>
        <mesh position={[0, 1.78, 0]}>
          <torusGeometry args={[0.1, 0.018, 12, 28, Math.PI]} />
          <meshStandardMaterial color="#7a7a7a" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.55, 12]} />
          <meshStandardMaterial color="#7a7a7a" metalness={0.85} roughness={0.25} />
        </mesh>

        <group
          ref={innerRef}
          rotation={[0, Math.PI, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "grab";
          }}
        >
          <primitive object={clonedScene} scale={1} position={[0, -0.35, 0]} />
        </group>
      </group>
    </group>
  );
}

function Rail() {
  return (
    <group>
      {/* Main rail */}
      <mesh position={[0, 2.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 14, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.92} roughness={0.18} />
      </mesh>
      {/* End posts */}
      <mesh position={[-6.8, 0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 4.2, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[6.8, 0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 4.2, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.92} roughness={0.18} />
      </mesh>
    </group>
  );
}

export default function GarmentRack({
  selectedId,
  setSelectedId,
  view,
  selectedColor,
  prefersReducedMotion,
  offsetRef,
}) {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (selectedId) {
      gsap.to(camera.position, {
        z: 5.2,
        y: 0.15,
        duration: 1,
        ease: "power3.inOut",
        onUpdate: invalidate,
      });
    } else {
      gsap.to(camera.position, {
        z: 7.2,
        y: 0.2,
        duration: 1,
        ease: "power3.inOut",
        onUpdate: invalidate,
      });
    }
  }, [selectedId, camera, invalidate]);

  return (
    <group position={[0, -0.35, 0]}>
      <Rail />
      {RACK_ITEMS.map((item, index) => (
        <HangingGarment
          key={item.id}
          item={item}
          index={index}
          offsetRef={offsetRef}
          selectedId={selectedId}
          onSelect={setSelectedId}
          view={view}
          selectedColor={selectedColor}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/hoodie.glb");
