import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3 } from "three";

// Four garments in the collection.
// These currently share the same GLB model but have independent materials.
const RACK_ITEMS = [
  { id: 1, color: "#e8e5df", position: -2.55 },
  { id: 2, color: "#252525", position: -0.85 },
  { id: 3, color: "#77736d", position: 0.85 },
  { id: 4, color: "#a49a8b", position: 2.55 },
];

const MODEL_PATH = "/models/hoodie.glb";

/**
 * A cylinder connecting two points.
 * Useful for creating realistic hanger arms.
 */
function HangerArm({ position, rotation, length = 0.68 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.012, 0.012, length, 10]} />
      <meshStandardMaterial color="#a9a9a9" metalness={0.85} roughness={0.22} />
    </mesh>
  );
}

/**
 * Individual metal clothing hanger.
 */
function Hanger() {
  return (
    <group>
      {/* Hanger hook */}
      <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.012, 10, 28, Math.PI * 1.65]} />
        <meshStandardMaterial color="#a9a9a9" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hanger neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 10]} />
        <meshStandardMaterial color="#a9a9a9" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left shoulder */}
      <HangerArm position={[-0.24, 0.79, 0]} rotation={[0, 0, -2.12]} />

      {/* Right shoulder */}
      <HangerArm position={[0.24, 0.79, 0]} rotation={[0, 0, 2.12]} />

      {/* Hanger bottom support */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.48, 8]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.85}
          roughness={0.25}
        />
        <group rotation={[0, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

/**
 * One independently rendered garment.
 */
function HangingGarment({ item, selected, onSelect }) {
  const groupRef = useRef();

  const { scene } = useGLTF(MODEL_PATH);

  // Clone the model and its materials only when the source or color changes.
  const model = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        const clonedMaterials = materials.map((material) => {
          const clonedMaterial = material.clone();

          if (clonedMaterial.color) {
            clonedMaterial.color.set(item.color);
          }

          if ("roughness" in clonedMaterial) {
            clonedMaterial.roughness = Math.max(clonedMaterial.roughness, 0.65);
          }

          return clonedMaterial;
        });

        child.material = Array.isArray(child.material)
          ? clonedMaterials
          : clonedMaterials[0];
      }
    });

    // Automatically calculate the actual GLB dimensions.
    clonedScene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clonedScene);
    const dimensions = new Vector3();
    const center = new Vector3();

    bounds.getSize(dimensions);
    bounds.getCenter(center);

    // Normalize every garment to the same height.
    const targetHeight = 1.45;
    const modelScale = targetHeight / Math.max(dimensions.y, 0.001);

    return {
      scene: clonedScene,
      scale: modelScale,
      center: [
        -center.x * modelScale,
        -center.y * modelScale - 0.45,
        -center.z * modelScale,
      ],
    };
  }, [scene, item.color]);

  // Subtle movement and smooth selection animation.
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    const idleRotation = Math.sin(time * 1.15 + item.position) * 0.012;

    const targetScale = selected ? 1.13 : 1;
    const targetZ = selected ? 0.35 : 0;
    const targetY = 0.15 + Math.sin(time * 1.1 + item.position) * 0.012;

    const smooth = 1 - Math.exp(-5 * delta);

    groupRef.current.scale.lerp(
      new Vector3(targetScale, targetScale, targetScale),
      smooth,
    );

    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * smooth;

    groupRef.current.position.z +=
      (targetZ - groupRef.current.position.z) * smooth;

    groupRef.current.rotation.z +=
      (idleRotation - groupRef.current.rotation.z) * smooth;
  });

  return (
    <group
      ref={groupRef}
      position={[item.position, 0.15, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
    >
      {/* Vertical connector between rail and hanger */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.75, 8]} />
        <meshStandardMaterial
          color="#858585"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      <Hanger />

      {/* Actual clothing model */}
      <group position={[0, 0, 0]}>
        <primitive
          object={model.scene}
          position={model.center}
          scale={model.scale}
        />
      </group>
    </group>
  );
}

/**
 * Main clothing rack.
 */
export default function GarmentRack({ selectedId, onSelect }) {
  const metalMaterial = useMemo(
    () => ({
      color: "#777d80",
      metalness: 0.88,
      roughness: 0.24,
    }),
    [],
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Main horizontal top rail */}
      <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 7.5, 20]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Left vertical support */}
      <mesh position={[-3.65, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.1, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Right vertical support */}
      <mesh position={[3.65, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.1, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Bottom stabilizing rail */}
      <mesh position={[0, -2.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 7.3, 16]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Small metal joints */}
      {[-3.65, 3.65].map((x) => (
        <mesh key={x} position={[x, 2.0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      ))}

      {/* Collection */}
      {RACK_ITEMS.map((item) => (
        <HangingGarment
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
