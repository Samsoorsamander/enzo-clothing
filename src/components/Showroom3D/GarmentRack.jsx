import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3, CatmullRomCurve3 } from "three";

const HOODIE_ONE = "/models/hoodie.glb";
const HOODIE_TWO = "/models/hoodie2.glb";

// Four display pieces using the two actual uploaded models.
// Tint is multiplied with the original base-color texture.
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

function MetalMaterial({ color = "#858b8e" }) {
  return (
    <meshStandardMaterial color={color} metalness={0.88} roughness={0.27} />
  );
}

// Connect two points with a cylindrical metal rod.
function MetalRod({ start, end, radius = 0.012, color = "#858b8e" }) {
  const direction = new Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2],
  );

  const length = direction.length();

  const midpoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const rotation = useMemo(() => {
    return new Vector3(0, 1, 0).angleTo(direction);
  }, [direction.x, direction.y, direction.z]);

  const quaternion = useMemo(() => {
    const result = new Vector3(0, 1, 0);
    result.cross(direction).normalize();

    return result.lengthSq() > 0 ? [result.x, result.y, result.z] : [0, 0, 1];
  }, [direction.x, direction.y, direction.z]);

  return (
    <mesh
      position={midpoint}
      quaternion={undefined}
      rotation={[
        Math.atan2(direction.z, direction.y),
        Math.atan2(direction.x, direction.y),
        0,
      ]}
      scale={[1, 1, 1]}
    >
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <MetalMaterial color={color} />
    </mesh>
  );
}

/**
 * Realistic metal hanger.
 *
 * The garment is placed in front of the hanger.
 * The hanger is attached to the garment's pivot.
 */
function Hanger({ width = 0.76 }) {
  const z = -0.25;
  const half = width / 2;

  const hookCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 0.02, z),
        new Vector3(0.055, 0.12, z),
        new Vector3(0.09, 0.28, z),
        new Vector3(0.07, 0.43, z),
        new Vector3(0.015, 0.51, z),
        new Vector3(-0.06, 0.51, z),
      ]),
    [z],
  );

  return (
    <group>
      {/* Curved hanger hook */}
      <mesh>
        <tubeGeometry args={[hookCurve, 32, 0.012, 8, false]} />
        <MetalMaterial color="#a0a5a7" />
      </mesh>

      {/* Hanger neck */}
      <MetalRod start={[0, -0.02, z]} end={[0, -0.1, z]} radius={0.014} />

      {/* Left shoulder */}
      <MetalRod start={[-half, -0.4, z]} end={[0, -0.1, z]} radius={0.013} />

      {/* Right shoulder */}
      <MetalRod start={[0, -0.1, z]} end={[half, -0.4, z]} radius={0.013} />

      {/* Bottom horizontal support */}
      <MetalRod
        start={[-half * 0.65, -0.43, z]}
        end={[half * 0.65, -0.43, z]}
        radius={0.008}
        color="#999999"
      />

      {/* Small central hanger connector */}
      <mesh position={[0, -0.1, z]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <MetalMaterial color="#b0b4b5" />
      </mesh>
    </group>
  );
}

/**
 * Load and normalize an actual garment model.
 */
function useGarmentModel(modelPath, tint) {
  const { scene } = useGLTF(modelPath);

  return useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const originalMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const clonedMaterials = originalMaterials.map((material) => {
        const clonedMaterial = material.clone();

        // Preserve original fabric textures and normal maps.
        // Do not recolor decorative stitching.
        if (
          clonedMaterial.color &&
          !clonedMaterial.name.toLowerCase().includes("stitch")
        ) {
          clonedMaterial.color.set(tint);
        }

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

    const bounds = new Box3().setFromObject(clonedScene);

    const dimensions = new Vector3();
    const center = new Vector3();

    bounds.getSize(dimensions);
    bounds.getCenter(center);

    // Target garment height in scene units.
    const targetHeight = 1.55;

    const scale = targetHeight / Math.max(dimensions.y, 0.001);

    // Center the model horizontally and place its bottom at y=0.
    const position = [
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    ];

    // Make the hanger width proportional to the actual garment.
    const hangerWidth = Math.min(
      0.9,
      Math.max(0.62, dimensions.x * scale * 0.95),
    );

    return {
      scene: clonedScene,
      scale,
      position,
      hangerWidth,
    };
  }, [scene, tint]);
}

/**
 * Individual hanging garment.
 */
function HangingGarment({ item, selected, onSelect }) {
  const pivotRef = useRef();

  const model = useGarmentModel(item.model, item.tint);

  // The pivot is located at the hanger hook.
  // This allows the whole garment to swing naturally.
  useFrame((state, delta) => {
    if (!pivotRef.current) return;

    const time = state.clock.elapsedTime;

    const smooth = 1 - Math.exp(-4 * delta);

    const idleSwing = Math.sin(time * 0.85 + item.position) * 0.008;

    const targetSwing = idleSwing;

    const targetScale = selected ? 1.08 : 1;
    const targetZ = selected ? 0.32 : 0;

    pivotRef.current.rotation.z +=
      (targetSwing - pivotRef.current.rotation.z) * smooth;

    pivotRef.current.scale.x +=
      (targetScale - pivotRef.current.scale.x) * smooth;

    pivotRef.current.scale.y +=
      (targetScale - pivotRef.current.scale.y) * smooth;

    pivotRef.current.scale.z +=
      (targetScale - pivotRef.current.scale.z) * smooth;

    pivotRef.current.position.z +=
      (targetZ - pivotRef.current.position.z) * smooth;
  });

  return (
    <group position={[item.position, 0, 0]}>
      <group
        ref={pivotRef}
        position={[0, 2.0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item.id);
        }}
      >
        {/* Hanger sits behind the garment */}
        <Hanger width={model.hangerWidth} />

        {/* Real garment */}
        <primitive
          object={model.scene}
          position={[
            model.position[0],
            model.position[1] - 2.0,
            model.position[2],
          ]}
          scale={model.scale}
        />
      </group>
    </group>
  );
}

/**
 * Main showroom clothing rack.
 */
export default function GarmentRack({
  selectedId = null,
  onSelect = () => {},
}) {
  const frameMaterial = "#7e8588";

  return (
    <group>
      {/* Main horizontal top rail */}
      <mesh position={[0, 2.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 7.5, 24]} />
        <MetalMaterial color={frameMaterial} />
      </mesh>

      {/* Left vertical frame support */}
      <mesh position={[-3.65, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.6, 20]} />
        <MetalMaterial color={frameMaterial} />
      </mesh>

      {/* Right vertical frame support */}
      <mesh position={[3.65, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.6, 20]} />
        <MetalMaterial color={frameMaterial} />
      </mesh>

      {/* Bottom frame rail */}
      <mesh position={[0, -1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 7.3, 20]} />
        <MetalMaterial color={frameMaterial} />
      </mesh>

      {/* Top frame joints */}
      {[-3.65, 3.65].map((x) => (
        <mesh key={x} position={[x, 2.65, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <MetalMaterial color="#9da2a3" />
        </mesh>
      ))}

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

// Preload both models.
useGLTF.preload(HOODIE_ONE);
useGLTF.preload(HOODIE_TWO);
