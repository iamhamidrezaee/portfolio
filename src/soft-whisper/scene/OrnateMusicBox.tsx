import { Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { CanvasTexture, MathUtils, RepeatWrapping } from "three";

import { BallerinaFigure } from "@/soft-whisper/scene/BallerinaFigure";

interface OrnateMusicBoxProps {
  lidAngleDeg: number;
  crankAngleDeg: number;
  interiorVisibility: number;
  ballerinaOpacity: number;
  boxGlow: number;
  showPlaque: boolean;
  message: string;
}

const GOLD = "#c8a44a";
const GOLD_DIM = "#a0803a";
const WOOD_BODY = "#7d5034";
const WOOD_DARK = "#5f3821";
const WOOD_LIGHT = "#96613e";
const FELT = "#5f2320";

function createWoodTexture(base = "#7a4e31", shadow = "#47281a", highlight = "#b48258") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d");
  if (!context) {
    const fallback = new CanvasTexture(canvas);
    fallback.wrapS = RepeatWrapping;
    fallback.wrapT = RepeatWrapping;
    return fallback;
  }

  const gradient = context.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, highlight);
  gradient.addColorStop(0.45, base);
  gradient.addColorStop(1, shadow);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);

  for (let index = 0; index < 170; index += 1) {
    const y = index * 3.4;
    context.strokeStyle = `rgba(22, 10, 6, ${0.08 + (index % 7) * 0.012})`;
    context.lineWidth = 1.2 + (index % 5) * 0.35;
    context.beginPath();
    context.moveTo(0, y + Math.sin(index * 0.3) * 8);

    for (let x = 0; x <= 512; x += 26) {
      const wave = Math.sin(x * 0.03 + index * 0.42) * 8;
      const wobble = Math.cos(x * 0.012 + index * 0.2) * 4;
      context.lineTo(x, y + wave + wobble);
    }

    context.stroke();
  }

  for (let knot = 0; knot < 12; knot += 1) {
    const x = 40 + knot * 38;
    const y = 80 + (knot % 5) * 74;
    const radius = 6 + (knot % 4) * 4;
    context.strokeStyle = "rgba(22, 10, 6, 0.18)";
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(x, y, radius * 1.6, radius, Math.PI / 10, 0, Math.PI * 2);
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.9, 1.35);
  return texture;
}

function createGoldTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    const fallback = new CanvasTexture(canvas);
    fallback.wrapS = RepeatWrapping;
    fallback.wrapT = RepeatWrapping;
    return fallback;
  }

  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, "#f0d28a");
  gradient.addColorStop(0.45, "#c69d4a");
  gradient.addColorStop(1, "#7c5a1c");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  for (let index = 0; index < 180; index += 1) {
    const x = index * 1.6;
    context.strokeStyle = `rgba(255, 245, 214, ${0.05 + (index % 6) * 0.01})`;
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x - 42, 256);
    context.stroke();
  }

  for (let speck = 0; speck < 80; speck += 1) {
    const x = (speck * 73) % 256;
    const y = (speck * 47) % 256;
    context.fillStyle = "rgba(255, 248, 220, 0.12)";
    context.fillRect(x, y, 2, 2);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(2.4, 2.4);
  return texture;
}

export function OrnateMusicBox({
  lidAngleDeg,
  crankAngleDeg,
  interiorVisibility,
  ballerinaOpacity,
  boxGlow,
  showPlaque,
  message,
}: OrnateMusicBoxProps) {
  const lidRef = useRef<Group>(null);
  const crankRef = useRef<Group>(null);
  const woodTexture = useMemo(() => createWoodTexture(), []);
  const woodShadowTexture = useMemo(() => createWoodTexture("#664127", "#392113", "#9a6c45"), []);
  const goldTexture = useMemo(() => createGoldTexture(), []);

  useFrame((_, delta) => {
    if (lidRef.current) {
      lidRef.current.rotation.x = MathUtils.damp(
        lidRef.current.rotation.x,
        MathUtils.degToRad(-lidAngleDeg),
        4.5,
        delta,
      );
    }

    if (crankRef.current) {
      crankRef.current.rotation.x = MathUtils.damp(
        crankRef.current.rotation.x,
        MathUtils.degToRad(-crankAngleDeg),
        10,
        delta,
      );
    }
  });

  return (
    <group position={[0, 1.0, 0]}>
      <mesh position={[0, -0.48, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.62, 0.08, 1.88]} />
        <meshStandardMaterial color="#2d1c11" roughness={0.72} metalness={0.08} map={woodShadowTexture} />
      </mesh>
      <mesh position={[0, -0.435, 0]} receiveShadow>
        <boxGeometry args={[2.54, 0.02, 1.8]} />
        <meshStandardMaterial
          color={GOLD_DIM}
          roughness={0.24}
          metalness={0.9}
          emissive={GOLD_DIM}
          emissiveIntensity={0.045 + boxGlow * 0.05}
          map={goldTexture}
        />
      </mesh>

      {/* Body shell */}
      <RoundedBox args={[2.2, 0.16, 1.46]} radius={0.05} smoothness={4} position={[0, -0.34, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={WOOD_BODY}
          roughness={0.48}
          metalness={0.08}
          clearcoat={0.22}
          clearcoatRoughness={0.45}
          emissive={WOOD_BODY}
          emissiveIntensity={0.045}
          map={woodTexture}
        />
      </RoundedBox>

      {[
        { position: [0, 0.06, 0.72], size: [2.18, 0.84, 0.14] as [number, number, number] },
        { position: [0, 0.06, -0.72], size: [2.18, 0.84, 0.14] as [number, number, number] },
        { position: [1.1, 0.06, 0], size: [0.14, 0.84, 1.3] as [number, number, number] },
        { position: [-1.1, 0.06, 0], size: [0.14, 0.84, 1.3] as [number, number, number] },
      ].map(({ position, size }, index) => (
        <RoundedBox
          key={`wall-${index}`}
          args={size}
          radius={0.03}
          smoothness={4}
          position={position as [number, number, number]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color={index < 2 ? WOOD_BODY : WOOD_LIGHT}
            roughness={0.46}
            metalness={0.08}
            clearcoat={0.18}
            clearcoatRoughness={0.4}
            emissive={index < 2 ? WOOD_BODY : WOOD_LIGHT}
            emissiveIntensity={0.035}
            map={index < 2 ? woodTexture : woodShadowTexture}
          />
        </RoundedBox>
      ))}

      {/* Front and back panels */}
      {[
        { z: 0.79, rotationY: 0 },
        { z: -0.79, rotationY: Math.PI },
      ].map(({ z, rotationY }) => (
        <group key={`panel-${z}`} position={[0, 0.08, z]} rotation={[0, rotationY, 0]}>
          <RoundedBox args={[1.82, 0.6, 0.04]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial
              color={WOOD_DARK}
              roughness={0.42}
              metalness={0.05}
              clearcoat={0.16}
              clearcoatRoughness={0.38}
              emissive={WOOD_DARK}
              emissiveIntensity={0.04}
              map={woodShadowTexture}
            />
          </RoundedBox>
          {[
            { position: [0, 0.32, 0.024], size: [1.9, 0.026, 0.01] as [number, number, number] },
            { position: [0, -0.32, 0.024], size: [1.9, 0.026, 0.01] as [number, number, number] },
            { position: [-0.94, 0, 0.024], size: [0.026, 0.66, 0.01] as [number, number, number] },
            { position: [0.94, 0, 0.024], size: [0.026, 0.66, 0.01] as [number, number, number] },
          ].map(({ position, size }, index) => (
            <mesh key={`trim-${z}-${index}`} position={position as [number, number, number]}>
              <boxGeometry args={size} />
              <meshStandardMaterial
                color={GOLD}
                roughness={0.18}
                metalness={0.92}
                emissive={GOLD}
                emissiveIntensity={0.05 + boxGlow * 0.04}
                map={goldTexture}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Opening rim */}
      {[
        { position: [0, 0.47, 0.58], size: [2.0, 0.03, 0.08] as [number, number, number] },
        { position: [0, 0.47, -0.58], size: [2.0, 0.03, 0.08] as [number, number, number] },
        { position: [0.96, 0.47, 0], size: [0.08, 0.03, 1.08] as [number, number, number] },
        { position: [-0.96, 0.47, 0], size: [0.08, 0.03, 1.08] as [number, number, number] },
      ].map(({ position, size }, index) => (
        <mesh key={`rim-${index}`} position={position as [number, number, number]} castShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={GOLD}
            roughness={0.2}
            metalness={0.92}
            emissive={GOLD}
            emissiveIntensity={0.07 + boxGlow * 0.08}
            map={goldTexture}
          />
        </mesh>
      ))}

      {/* Corner pilasters */}
      {[[-1.08, -0.68], [-1.08, 0.68], [1.08, -0.68], [1.08, 0.68]].map(([x, z]) => (
        <mesh key={`pilaster-${x}-${z}`} position={[x, 0.06, z]} castShadow>
          <boxGeometry args={[0.05, 0.84, 0.05]} />
          <meshStandardMaterial
            color={GOLD}
            roughness={0.18}
            metalness={0.9}
            emissive={GOLD}
            emissiveIntensity={0.05 + boxGlow * 0.03}
            map={goldTexture}
          />
        </mesh>
      ))}

      {/* Keyhole and front ornaments */}
      <mesh position={[0, -0.08, 0.792]}>
        <circleGeometry args={[0.05, 28]} />
        <meshStandardMaterial
          color={GOLD}
          roughness={0.18}
          metalness={0.94}
          emissive={GOLD}
          emissiveIntensity={0.06}
          map={goldTexture}
        />
      </mesh>
      <mesh position={[0, -0.08, 0.8]}>
        <circleGeometry args={[0.018, 16]} />
        <meshStandardMaterial color="#1a0f08" roughness={0.92} metalness={0.06} />
      </mesh>
      {[-0.84, 0.84].map((x) => (
        <mesh key={`ring-${x}`} position={[x, 0.12, 0.79]}>
          <torusGeometry args={[0.06, 0.009, 10, 30]} />
          <meshStandardMaterial
            color={GOLD}
            roughness={0.16}
            metalness={0.92}
            emissive={GOLD}
            emissiveIntensity={0.04}
            map={goldTexture}
          />
        </mesh>
      ))}

      {/* Hinge hardware */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={`hinge-${x}`} position={[x, 0.45, -0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.08, 16]} />
          <meshStandardMaterial color={GOLD_DIM} roughness={0.22} metalness={0.88} map={goldTexture} />
        </mesh>
      ))}

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.45, -0.79]}>
        <group position={[0, 0, 0.79]}>
          <RoundedBox args={[2.38, 0.18, 1.62]} radius={0.05} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={WOOD_BODY}
              roughness={0.44}
              metalness={0.08}
              clearcoat={0.26}
              clearcoatRoughness={0.34}
              emissive={WOOD_BODY}
              emissiveIntensity={0.04}
              map={woodTexture}
            />
          </RoundedBox>
          <RoundedBox args={[1.88, 0.028, 1.14]} radius={0.025} smoothness={3} position={[0, 0.072, 0]}>
            <meshStandardMaterial
              color={GOLD}
              roughness={0.22}
              metalness={0.9}
              emissive={GOLD}
              emissiveIntensity={0.05 + boxGlow * 0.04}
              map={goldTexture}
            />
          </RoundedBox>
          <RoundedBox args={[1.44, 0.022, 0.76]} radius={0.02} smoothness={3} position={[0, 0.05, 0]}>
            <meshStandardMaterial color={GOLD_DIM} roughness={0.24} metalness={0.86} emissive={GOLD_DIM} emissiveIntensity={0.03} map={goldTexture} />
          </RoundedBox>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.16, 24, 16, 0, Math.PI]} />
            <meshStandardMaterial color={GOLD_DIM} roughness={0.24} metalness={0.84} emissive={GOLD_DIM} emissiveIntensity={0.03} map={goldTexture} />
          </mesh>
        </group>
      </group>

      {/* Side-mounted crank */}
      <mesh position={[1.17, 0.06, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 20]} />
        <meshStandardMaterial color={GOLD_DIM} roughness={0.22} metalness={0.88} map={goldTexture} />
      </mesh>
      <group position={[1.21, 0.06, 0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.16} metalness={0.92} map={goldTexture} />
        </mesh>

        <group ref={crankRef}>
          <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.017, 0.017, 0.24, 16]} />
            <meshStandardMaterial color={GOLD} roughness={0.16} metalness={0.92} map={goldTexture} />
          </mesh>
          <mesh position={[0.26, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.26, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.18} metalness={0.9} emissive={GOLD} emissiveIntensity={0.02 + boxGlow * 0.03} map={goldTexture} />
          </mesh>
          <mesh position={[0.36, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.14, 14]} />
            <meshStandardMaterial color="#dfc27c" roughness={0.32} metalness={0.52} />
          </mesh>
          <mesh position={[0.36, 0.26, 0]}>
            <sphereGeometry args={[0.03, 18, 18]} />
            <meshStandardMaterial color={GOLD} roughness={0.18} metalness={0.9} map={goldTexture} />
          </mesh>
        </group>
      </group>

      {/* Empty interior with thin lining and a central pedestal */}
      <mesh position={[0, -0.27, 0]} receiveShadow>
        <boxGeometry args={[1.76, 0.03, 0.98]} />
        <meshPhysicalMaterial
          color={FELT}
          roughness={0.92}
          metalness={0.02}
          emissive="#692322"
          emissiveIntensity={0.05 + interiorVisibility * 0.1}
        />
      </mesh>
      {[
        { position: [0, 0.03, 0.56], rotation: [0, Math.PI, 0] as [number, number, number], size: [1.8, 0.64] as [number, number] },
        { position: [0, 0.03, -0.56], rotation: [0, 0, 0] as [number, number, number], size: [1.8, 0.64] as [number, number] },
        { position: [0.9, 0.03, 0], rotation: [0, -Math.PI / 2, 0] as [number, number, number], size: [1.12, 0.64] as [number, number] },
        { position: [-0.9, 0.03, 0], rotation: [0, Math.PI / 2, 0] as [number, number, number], size: [1.12, 0.64] as [number, number] },
      ].map(({ position, rotation, size }, index) => (
        <mesh key={`lining-${index}`} position={position as [number, number, number]} rotation={rotation}>
          <planeGeometry args={size} />
          <meshPhysicalMaterial
            color="#421818"
            roughness={0.95}
            metalness={0.02}
            emissive="#7b2625"
            emissiveIntensity={0.03 + interiorVisibility * 0.06}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.04, 30]} />
        <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} emissive={GOLD} emissiveIntensity={0.04 + interiorVisibility * 0.04} map={goldTexture} />
      </mesh>
      <mesh position={[0, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.032, 0.08, 18]} />
        <meshStandardMaterial color={GOLD_DIM} roughness={0.22} metalness={0.86} map={goldTexture} />
      </mesh>

      <group position={[0, -0.1, 0]} scale={[0.74, 0.74, 0.74]}>
        <BallerinaFigure opacity={ballerinaOpacity} />
      </group>

      {showPlaque ? (
        <Html
          transform
          position={[0, 0.06, 0.18]}
          rotation={[-0.18, 0, 0]}
          distanceFactor={0.96}
          style={{ pointerEvents: "none" }}
        >
          <div className="plaque-copy">
            <p className="plaque-main">You were no different than AI.</p>
            <p className="plaque-sub">{message}</p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}
