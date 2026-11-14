import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// This component rotates the model based on scroll
function GarmentModel() {
  const meshRef = useRef();

  // Load the hoodie model from the public folder
  const { scene } = useGLTF("/models/hoodie.glb");

  // Rotate the mesh automatically or via scroll
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2; // Slow continuous rotation
    }
  });

  return (
    <Center>
      <primitive
        ref={meshRef}
        object={scene}
        scale={1.5}
        position={[0, 0, 0]}
      />
    </Center>
  );
}

export default function RotatingGarment() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Pin the section and scale the camera/garment on scroll
      gsap.to(".canvas-wrapper", {
        scale: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="rotating-garment" ref={sectionRef}>
      <div className="rotating-text">
        <span className="rotating-kicker">Signature Piece</span>
        <h2 className="rotating-title">The Hoodie</h2>
      </div>

      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          {/* Studio Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />
          <spotLight
            position={[-5, 5, -5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
          />
          <Environment preset="studio" />

          <GarmentModel />
        </Canvas>
      </div>
    </section>
  );
}
