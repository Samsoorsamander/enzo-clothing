import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3 } from "three";

const MODEL_PATH = "/models/hoodie.glb";

const RACK_ITEMS = [
  { id: 1, color: "#e8e5df", position: -2.55 },
  { id: 2, color: "#252525", position: -0.85 },
  { id: 3, color: "#77736d", position: 0.85 },
  { id: 4, color: "#a49a8b", position: 2.55 },
];

function MetalMaterial() {
  return (
    <meshStandardMaterial color="#858b8e" metalness={0.88} roughness={0.24} />
  );
}

function HangerArm({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.012, 0.012, 0.68, 10]} />
      <MetalMaterial />
    </mesh>
  );
}

function Hanger() {
  return (
    <group>
      {/* Metal hook */}
      <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.012, 10, 28, Math.PI * 1.65]} />
        <MetalMaterial />
      </mesh>

      {/* Hook neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 10]} />
        <MetalMaterial />
      </mesh>

      {/* Left shoulder */}
      <HangerArm position={[-0.24, 0.79, 0]} rotation={[0, 0, -2.12]} />

      {/* Right shoulder */}
      <HangerArm position={[0.24, 0.79, 0]} rotation={[0, 0, 2.12]} />

      {/* Horizontal hanger support */}
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.48, 8]} />
        <MetalMaterial />
      </mesh>
    </group>
  );
}

function HangingGarment({ item, selected, onSelect }) {
  const groupRef = useRef();

  const { scene } = useGLTF(MODEL_PATH);

  // Create an independent model and material for every garment.
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
          const cloned = material.clone();

          if (cloned.color) {
            cloned.color.set(item.color);
          }

          if ("roughness" in cloned) {
            cloned.roughness = Math.max(cloned.roughness, 0.65);
          }

          return cloned;
        });

        child.material = Array.isArray(child.material)
          ? clonedMaterials
          : clonedMaterials[0];
      }
    });

    // Automatically calculate the model's actual dimensions.
    clonedScene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clonedScene);
    const dimensions = new Vector3();
    const center = new Vector3();

    bounds.getSize(dimensions);
    bounds.getCenter(center);

    const targetHeight = 1.45;
    const scale = targetHeight / Math.max(dimensions.y, 0.001);

    return {
      scene: clonedScene,
      scale,
      center: [-center.x * scale, -center.y * scale - 0.45, -center.z * scale],
    };
  }, [scene, item.color]);

  // Natural idle movement and smooth selection.
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const smooth = 1 - Math.exp(-5 * delta);

    const targetScale = selected ? 1.13 : 1;
    const targetZ = selected ? 0.35 : 0;

    const targetY = 0.15 + Math.sin(time * 1.1 + item.position) * 0.012;

    const targetRotation = Math.sin(time * 1.15 + item.position) * 0.012;

    const group = groupRef.current;

    const nextScale = group.scale.x + (targetScale - group.scale.x) * smooth;

    group.scale.setScalar(nextScale);

    group.position.y += (targetY - group.position.y) * smooth;

    group.position.z += (targetZ - group.position.z) * smooth;

    group.rotation.z += (targetRotation - group.rotation.z) * smooth;
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
      {/* Connector from the top rail to the hanger */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.75, 8]} />
        <MetalMaterial />
      </mesh>

      <Hanger />

      {/* Normalized clothing model */}
      <primitive
        object={model.scene}
        position={model.center}
        scale={model.scale}
      />
    </group>
  );
}

export default function GarmentRack({
  selectedId = null,
  onSelect = () => {},
}) {
  return (
    <group>
      {/* Main horizontal rail */}
      <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 7.5, 20]} />
        <MetalMaterial />
      </mesh>

      {/* Left vertical support */}
      <mesh position={[-3.65, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.1, 16]} />
        <MetalMaterial />
      </mesh>

      {/* Right vertical support */}
      <mesh position={[3.65, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 4.1, 16]} />
        <MetalMaterial />
      </mesh>

      {/* Bottom stabilizing rail */}
      <mesh position={[0, -2.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 7.3, 16]} />
        <MetalMaterial />
      </mesh>

      {/* Metal joints */}
      {[-3.65, 3.65].map((x) => (
        <mesh key={x} position={[x, 2.0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <MetalMaterial />
        </mesh>
      ))}

      {/* Clothing collection */}
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
