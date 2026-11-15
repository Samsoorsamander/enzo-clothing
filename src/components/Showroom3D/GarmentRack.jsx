import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { Box3, Vector3, Quaternion, CatmullRomCurve3 } from "three";

// ======================================================
// MODEL PATHS
// ======================================================

const HOODIE_ONE = "/models/hoodie.glb";
const HOODIE_TWO = "/models/hoodie2.glb";

// ======================================================
// COLLECTION CONFIGURATION
// ======================================================

const RACK_ITEMS = [
  {
    id: 1,
    model: HOODIE_ONE,
    tint: "#b8b5af",
    position: -2.55,
  },
  {
    id: 2,
    model: HOODIE_TWO,
    tint: "#ffffff",
    position: -0.85,
  },
  {
    id: 3,
    model: HOODIE_ONE,
    tint: "#777777",
    position: 0.85,
  },
  {
    id: 4,
    model: HOODIE_TWO,
    tint: "#b4aaa0",
    position: 2.55,
  },
];

// ======================================================
// METAL MATERIAL
// ======================================================

function MetalMaterial({ color = "#858b8e" }) {
  return (
    <meshStandardMaterial color={color} metalness={0.88} roughness={0.27} />
  );
}

// ======================================================
// METAL ROD
// Connects two 3D points with a cylindrical rod.
// ======================================================

function MetalRod({ start, end, radius = 0.012, color = "#858b8e" }) {
  const startVector = new Vector3(...start);
  const endVector = new Vector3(...end);

  const direction = new Vector3().subVectors(endVector, startVector);

  const length = direction.length();

  const midpoint = new Vector3()
    .addVectors(startVector, endVector)
    .multiplyScalar(0.5);

  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 16]} />

      <MetalMaterial color={color} />
    </mesh>
  );
}

// ======================================================
// METAL JOINT
// ======================================================

function MetalJoint({ position, radius = 0.035 }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[radius, 20, 20]} />
      <MetalMaterial color="#a0a5a7" />
    </mesh>
  );
}

// ======================================================
// REALISTIC METAL CLOTHING HANGER
// ======================================================

function Hanger({ width = 0.76 }) {
  const half = width / 2;

  const hangerZ = -0.25;

  // Curved hook wrapping around the upper clothing rail.
  const hookCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, -0.08, hangerZ),
        new Vector3(0.055, 0.0, hangerZ),
        new Vector3(0.085, 0.12, hangerZ),
        new Vector3(0.075, 0.22, hangerZ),
        new Vector3(0.025, 0.27, hangerZ),
        new Vector3(-0.055, 0.25, hangerZ),
        new Vector3(-0.085, 0.17, hangerZ),
      ]),
    [hangerZ],
  );

  return (
    <group>
      {/* Main curved hanger hook */}
      <mesh castShadow>
        <tubeGeometry args={[hookCurve, 40, 0.012, 10, false]} />
        <MetalMaterial color="#aeb3b5" />
      </mesh>

      {/* Central neck */}
      <MetalRod
        start={[0, -0.08, hangerZ]}
        end={[0, -0.2, hangerZ]}
        radius={0.014}
      />

      {/* Left shoulder */}
      <MetalRod
        start={[-half, -0.46, hangerZ]}
        end={[0, -0.2, hangerZ]}
        radius={0.013}
      />

      {/* Right shoulder */}
      <MetalRod
        start={[0, -0.2, hangerZ]}
        end={[half, -0.46, hangerZ]}
        radius={0.013}
      />

      {/* Lower horizontal support */}
      <MetalRod
        start={[-half * 0.65, -0.47, hangerZ]}
        end={[half * 0.65, -0.47, hangerZ]}
        radius={0.008}
        color="#999999"
      />

      {/* Center connector */}
      <MetalJoint position={[0, -0.2, hangerZ]} radius={0.022} />

      {/* Left end connector */}
      <MetalJoint position={[-half, -0.46, hangerZ]} radius={0.014} />

      {/* Right end connector */}
      <MetalJoint position={[half, -0.46, hangerZ]} radius={0.014} />
    </group>
  );
}

// ======================================================
// LOAD AND NORMALIZE ACTUAL HOODIE MODEL
// ======================================================

function useGarmentModel(modelPath, tint) {
  const { scene } = useGLTF(modelPath);

  return useMemo(() => {
    // Create an independent scene instance.
    const clonedScene = scene.clone(true);

    // Clone materials without replacing original textures.
    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const originalMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const clonedMaterials = originalMaterials.map((material) => {
        const clonedMaterial = material.clone();

        // Preserve all original texture maps.
        // Apply color variation through the material tint.
        if (clonedMaterial.color) {
          clonedMaterial.color.set(tint);
        }

        // Preserve the original roughness where available.
        clonedMaterial.roughness = Math.max(
          clonedMaterial.roughness ?? 0.8,
          0.55,
        );

        clonedMaterial.needsUpdate = true;

        return clonedMaterial;
      });

      child.material = Array.isArray(child.material)
        ? clonedMaterials
        : clonedMaterials[0];
    });

    clonedScene.updateMatrixWorld(true);

    // Calculate actual model dimensions.
    const bounds = new Box3().setFromObject(clonedScene);

    const dimensions = new Vector3();
    const center = new Vector3();

    bounds.getSize(dimensions);
    bounds.getCenter(center);

    // Normalize different models to consistent proportions.
    const targetHeight = 1.55;

    const scale = targetHeight / Math.max(dimensions.y, 0.001);

    // Position the top of the garment below the hanger.
    const garmentTop = -0.48;

    clonedScene.position.set(
      -center.x * scale,
      garmentTop - bounds.max.y * scale,
      -center.z * scale,
    );

    clonedScene.scale.setScalar(scale);

    clonedScene.updateMatrixWorld(true);

    // Hanger width adapts to garment width.
    const hangerWidth = Math.min(
      0.9,
      Math.max(0.62, dimensions.x * scale * 0.95),
    );

    return {
      scene: clonedScene,
      hangerWidth,
    };
  }, [scene, tint]);
}

// ======================================================
// INDIVIDUAL HANGING GARMENT
// ======================================================

function HangingGarment({ item, selected, onSelect }) {
  const pivotRef = useRef();

  const model = useGarmentModel(item.model, item.tint);

  useFrame((state, delta) => {
    if (!pivotRef.current) return;

    const time = state.clock.elapsedTime;

    const smooth = 1 - Math.exp(-4 * delta);

    // Extremely subtle hanging movement.
    const idleSwing = Math.sin(time * 0.85 + item.position) * 0.008;

    const targetScale = selected ? 1.08 : 1;
    const targetDepth = selected ? 0.32 : 0;

    pivotRef.current.rotation.z +=
      (idleSwing - pivotRef.current.rotation.z) * smooth;

    pivotRef.current.scale.x +=
      (targetScale - pivotRef.current.scale.x) * smooth;

    pivotRef.current.scale.y +=
      (targetScale - pivotRef.current.scale.y) * smooth;

    pivotRef.current.scale.z +=
      (targetScale - pivotRef.current.scale.z) * smooth;

    pivotRef.current.position.z +=
      (targetDepth - pivotRef.current.position.z) * smooth;
  });

  return (
    <group position={[item.position, 0, 0]}>
      {/* Pivot positioned at the top clothing rail */}
      <group
        ref={pivotRef}
        position={[0, 2.65, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item.id);
        }}
      >
        {/* Hanger */}
        <Hanger width={model.hangerWidth} />

        {/* Actual uploaded hoodie */}
        <primitive object={model.scene} />
      </group>
    </group>
  );
}

// ======================================================
// COMPLETE METAL CLOTHING RACK
// ======================================================

function ClothingRackFrame() {
  const metalColor = "#858b8e";

  return (
    <group>
      {/* =========================================
          TOP HORIZONTAL CLOTHING RAIL
      ========================================= */}

      <MetalRod
        start={[-3.65, 2.65, 0]}
        end={[3.65, 2.65, 0]}
        radius={0.025}
        color={metalColor}
      />

      {/* =========================================
          LEFT VERTICAL SUPPORT
      ========================================= */}

      <MetalRod
        start={[-3.65, -1.95, 0]}
        end={[-3.65, 2.65, 0]}
        radius={0.025}
        color={metalColor}
      />

      {/* =========================================
          RIGHT VERTICAL SUPPORT
      ========================================= */}

      <MetalRod
        start={[3.65, -1.95, 0]}
        end={[3.65, 2.65, 0]}
        radius={0.025}
        color={metalColor}
      />

      {/* =========================================
          BOTTOM HORIZONTAL SUPPORT
      ========================================= */}

      <MetalRod
        start={[-3.65, -1.95, 0]}
        end={[3.65, -1.95, 0]}
        radius={0.022}
        color={metalColor}
      />

      {/* =========================================
          FRAME CONNECTION JOINTS
      ========================================= */}

      <MetalJoint position={[-3.65, 2.65, 0]} radius={0.045} />

      <MetalJoint position={[3.65, 2.65, 0]} radius={0.045} />

      <MetalJoint position={[-3.65, -1.95, 0]} radius={0.035} />

      <MetalJoint position={[3.65, -1.95, 0]} radius={0.035} />
    </group>
  );
}

// ======================================================
// MAIN GARMENT RACK
// ======================================================

export default function GarmentRack({
  selectedId = null,
  onSelect = () => {},
}) {
  return (
    <group>
      {/* Complete metal frame */}
      <ClothingRackFrame />

      {/* Four actual hoodie models */}
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

// ======================================================
// PRELOAD MODELS
// ======================================================

useGLTF.preload(HOODIE_ONE);
useGLTF.preload(HOODIE_TWO);
