import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { CatmullRomCurve3, DoubleSide, MathUtils, TubeGeometry, Vector3 } from "three";

/**
 * Second-arabesque ballerina figurine for the music-box interior.
 *
 * The pose: standing en pointe on the right foot, left leg extended
 * behind at ~60°, right arm reaching forward, left arm swept to the
 * side, head turned gently toward the audience.
 *
 * To replace with a GLB model later, swap the JSX below with:
 *   import { useGLTF } from "@react-three/drei";
 *   const { scene } = useGLTF("/models/ballerina.glb");
 *   return <primitive object={scene.clone()} ... />;
 */

interface BallerinaFigureProps {
  opacity: number;
}

/* ── colour palette ─────────────────────────────────────────── */
const GOLD = "#c7a24f";
const GOLD_LIGHT = "#e2c67a";
const PORCELAIN = "#f5ece5";
const PORCELAIN_WARM = "#edddd2";
const PORCELAIN_SHADE = "#dcc8b8";
const BODICE = "#f1e4db";
const BODICE_ACCENT = "#d9b786";
const TULLE = "#faf1ee";
const TULLE_WARM = "#f1ddd9";
const SHOE_PINK = "#e0b4b6";
const HAIR_DARK = "#5a3a28";
const HAIR_HIGHLIGHT = "#7d5240";

function em(opacity: number, intensity: number) {
  return opacity * intensity;
}

function makeLimbGeometry(points: [number, number, number][], radius: number, segments = 8) {
  const vectors = points.map(([x, y, z]) => new Vector3(x, y, z));
  const curve = new CatmullRomCurve3(vectors, false, "catmullrom", 0.4);
  return new TubeGeometry(curve, 18, radius, segments, false);
}

export function BallerinaFigure({ opacity }: BallerinaFigureProps) {
  const groupRef = useRef<Group>(null);

  /* smooth tube geometries for limbs – built once */
  const standingLegGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [0.01, -0.26, 0.005],
          [0.015, -0.18, 0.002],
          [0.013, -0.08, 0],
          [0.01, 0.0, -0.006],
        ],
        0.014,
      ),
    [],
  );

  const extendedLegGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [-0.01, 0.0, -0.006],
          [-0.04, -0.02, -0.04],
          [-0.09, -0.04, -0.09],
          [-0.145, -0.045, -0.16],
          [-0.19, -0.04, -0.22],
        ],
        0.013,
      ),
    [],
  );

  const rightArmGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [0.04, 0.12, 0.01],
          [0.06, 0.13, 0.04],
          [0.09, 0.14, 0.08],
          [0.12, 0.145, 0.13],
          [0.145, 0.148, 0.17],
        ],
        0.008,
      ),
    [],
  );

  const leftArmGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [-0.04, 0.12, 0.01],
          [-0.07, 0.13, 0.006],
          [-0.11, 0.135, -0.005],
          [-0.145, 0.132, -0.015],
          [-0.17, 0.125, -0.02],
        ],
        0.008,
      ),
    [],
  );

  const rightForearmGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [0.145, 0.148, 0.17],
          [0.155, 0.162, 0.2],
          [0.16, 0.18, 0.23],
        ],
        0.006,
      ),
    [],
  );

  const leftForearmGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [-0.17, 0.125, -0.02],
          [-0.19, 0.12, -0.016],
          [-0.21, 0.118, -0.01],
        ],
        0.006,
      ),
    [],
  );

  /* en-pointe foot geometry */
  const pointeFootGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [0.01, -0.26, 0.005],
          [0.01, -0.28, 0.004],
          [0.009, -0.295, 0.003],
        ],
        0.009,
      ),
    [],
  );

  /* extended foot (pointed toes) */
  const extendedFootGeo = useMemo(
    () =>
      makeLimbGeometry(
        [
          [-0.19, -0.04, -0.22],
          [-0.205, -0.035, -0.25],
          [-0.215, -0.03, -0.27],
        ],
        0.007,
      ),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current || opacity < 0.01) return;

    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 0.48;

    /* gentle breathing sway */
    groupRef.current.rotation.z = MathUtils.damp(
      groupRef.current.rotation.z,
      Math.sin(time * 0.85) * 0.015,
      4,
      delta,
    );
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      Math.sin(time * 0.55) * 0.015,
      4,
      delta,
    );
    groupRef.current.position.y = MathUtils.damp(
      groupRef.current.position.y,
      0.36 + Math.sin(time * 1.3) * 0.006,
      5,
      delta,
    );
  });

  if (opacity < 0.01) return null;

  const o = opacity;

  const porcelainMaterial = {
    color: PORCELAIN,
    roughness: 0.18,
    metalness: 0.04,
    clearcoat: 0.92,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: o,
    emissive: PORCELAIN_SHADE,
    emissiveIntensity: em(o, 0.04),
  } as const;

  const porcelainWarmMaterial = {
    ...porcelainMaterial,
    color: PORCELAIN_WARM,
  } as const;

  return (
    <group ref={groupRef} position={[0, 0.36, 0]}>
      {/* ── PEDESTAL ── */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.03, 36]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={0.78}
          roughness={0.18}
          transparent
          opacity={o}
          emissive={GOLD}
          emissiveIntensity={em(o, 0.08)}
        />
      </mesh>
      <mesh position={[0, -0.295, 0]}>
        <torusGeometry args={[0.115, 0.006, 10, 42]} />
        <meshStandardMaterial
          color={GOLD_LIGHT}
          metalness={0.84}
          roughness={0.14}
          transparent
          opacity={o}
          emissive={GOLD_LIGHT}
          emissiveIntensity={em(o, 0.05)}
        />
      </mesh>

      {/* ── POST (golden spindle) ── */}
      <mesh position={[0.01, -0.295, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.02, 12]} />
        <meshStandardMaterial
          color={GOLD_LIGHT}
          metalness={0.84}
          roughness={0.16}
          transparent
          opacity={o * 0.9}
          emissive={GOLD_LIGHT}
          emissiveIntensity={em(o, 0.03)}
        />
      </mesh>

      {/* ── THE FIGURE (second arabesque) ── */}
      <group position={[0, 0.01, 0]} rotation={[0.06, 0.18, 0]}>
        {/* ── Standing leg (right) – en pointe ── */}
        <mesh geometry={standingLegGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>

        {/* En-pointe foot */}
        <mesh geometry={pointeFootGeo}>
          <meshPhysicalMaterial
            color={SHOE_PINK}
            roughness={0.32}
            metalness={0.04}
            clearcoat={0.6}
            clearcoatRoughness={0.18}
            transparent
            opacity={o}
          />
        </mesh>

        {/* Ankle ribbon detail */}
        <mesh position={[0.01, -0.25, 0.005]}>
          <torusGeometry args={[0.016, 0.002, 6, 20]} />
          <meshStandardMaterial
            color={SHOE_PINK}
            roughness={0.4}
            metalness={0.06}
            transparent
            opacity={o * 0.8}
          />
        </mesh>

        {/* ── Extended leg (left) – arabesque ── */}
        <mesh geometry={extendedLegGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>

        {/* Extended pointed foot */}
        <mesh geometry={extendedFootGeo}>
          <meshPhysicalMaterial
            color={SHOE_PINK}
            roughness={0.32}
            metalness={0.04}
            clearcoat={0.6}
            clearcoatRoughness={0.18}
            transparent
            opacity={o}
          />
        </mesh>

        {/* ── Torso ── */}
        {/* Lower torso / hips */}
        <mesh position={[0, 0.02, -0.005]}>
          <capsuleGeometry args={[0.028, 0.04, 10, 20]} />
          <meshPhysicalMaterial
            color={BODICE}
            roughness={0.22}
            metalness={0.04}
            clearcoat={0.86}
            clearcoatRoughness={0.1}
            transparent
            opacity={o}
            emissive={BODICE_ACCENT}
            emissiveIntensity={em(o, 0.04)}
          />
        </mesh>

        {/* Upper torso / bodice */}
        <mesh position={[0, 0.07, 0]}>
          <capsuleGeometry args={[0.03, 0.06, 10, 20]} />
          <meshPhysicalMaterial
            color={BODICE}
            roughness={0.2}
            metalness={0.04}
            clearcoat={0.88}
            clearcoatRoughness={0.1}
            transparent
            opacity={o}
            emissive={BODICE_ACCENT}
            emissiveIntensity={em(o, 0.05)}
          />
        </mesh>

        {/* Bodice neckline trim */}
        <mesh position={[0, 0.095, 0.01]} rotation={[0.25, 0, 0]}>
          <torusGeometry args={[0.028, 0.003, 8, 22, Math.PI * 1.2]} />
          <meshStandardMaterial
            color={BODICE_ACCENT}
            metalness={0.72}
            roughness={0.2}
            transparent
            opacity={o}
            emissive={BODICE_ACCENT}
            emissiveIntensity={em(o, 0.06)}
          />
        </mesh>

        {/* Bodice waistband */}
        <mesh position={[0, 0.01, 0]}>
          <torusGeometry args={[0.035, 0.004, 8, 28]} />
          <meshStandardMaterial
            color={BODICE_ACCENT}
            metalness={0.76}
            roughness={0.18}
            transparent
            opacity={o}
            emissive={BODICE_ACCENT}
            emissiveIntensity={em(o, 0.05)}
          />
        </mesh>

        {/* ── TUTU (layered translucent skirt) ── */}
        <mesh position={[0, 0.008, -0.003]}>
          <coneGeometry args={[0.12, 0.055, 32, 1, true]} />
          <meshPhysicalMaterial
            color={TULLE}
            roughness={0.42}
            metalness={0.02}
            clearcoat={0.2}
            clearcoatRoughness={0.28}
            transparent
            opacity={o * 0.28}
            side={DoubleSide}
            emissive={TULLE_WARM}
            emissiveIntensity={em(o, 0.03)}
          />
        </mesh>

        {[0.005, 0.015, 0.025, 0.035, 0.045].map((yOff, index) => (
          <mesh
            key={`tutu-layer-${index}`}
            position={[0, 0.005 + yOff, -0.002]}
            rotation={[0.04 * index, (Math.PI / 12) * index, 0.02 * (index - 2)]}
          >
            <torusGeometry args={[0.068 + index * 0.012, 0.0035 - index * 0.0003, 8, 52]} />
            <meshPhysicalMaterial
              color={index % 2 === 0 ? TULLE : TULLE_WARM}
              roughness={0.44}
              metalness={0.02}
              clearcoat={0.22}
              clearcoatRoughness={0.26}
              transparent
              opacity={o * (0.42 + index * 0.06)}
              emissive={TULLE_WARM}
              emissiveIntensity={em(o, 0.02)}
            />
          </mesh>
        ))}

        {/* ── Neck ── */}
        <mesh position={[0, 0.11, 0.004]}>
          <capsuleGeometry args={[0.012, 0.025, 6, 14]} />
          <meshPhysicalMaterial {...porcelainWarmMaterial} />
        </mesh>

        {/* ── Head ── */}
        <mesh position={[0, 0.145, 0.006]}>
          <sphereGeometry args={[0.03, 22, 22]} />
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>

        {/* Face – subtle forward-facing tilt */}
        <mesh position={[0.003, 0.143, 0.03]}>
          <sphereGeometry args={[0.015, 14, 14]} />
          <meshPhysicalMaterial
            color={PORCELAIN}
            roughness={0.15}
            metalness={0.02}
            clearcoat={0.94}
            clearcoatRoughness={0.06}
            transparent
            opacity={o * 0.5}
          />
        </mesh>

        {/* ── Hair / bun ── */}
        {/* Main hair cap */}
        <mesh position={[0.001, 0.16, -0.008]}>
          <sphereGeometry args={[0.024, 18, 18]} />
          <meshStandardMaterial
            color={HAIR_DARK}
            roughness={0.46}
            metalness={0.1}
            transparent
            opacity={o}
          />
        </mesh>

        {/* Hair bun (on top) */}
        <mesh position={[0, 0.175, -0.012]}>
          <sphereGeometry args={[0.014, 14, 14]} />
          <meshStandardMaterial
            color={HAIR_DARK}
            roughness={0.42}
            metalness={0.1}
            transparent
            opacity={o}
            emissive={HAIR_HIGHLIGHT}
            emissiveIntensity={em(o, 0.04)}
          />
        </mesh>

        {/* Tiara / hair ornament */}
        <mesh position={[0, 0.17, 0.01]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.018, 0.002, 6, 16, Math.PI]} />
          <meshStandardMaterial
            color={GOLD_LIGHT}
            metalness={0.82}
            roughness={0.16}
            transparent
            opacity={o}
            emissive={GOLD_LIGHT}
            emissiveIntensity={em(o, 0.08)}
          />
        </mesh>

        {/* ── RIGHT ARM (extended forward – arabesque line) ── */}
        <mesh geometry={rightArmGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>
        <mesh geometry={rightForearmGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>
        {/* Right hand */}
        <mesh position={[0.16, 0.18, 0.23]}>
          <sphereGeometry args={[0.006, 10, 10]} />
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>

        {/* ── LEFT ARM (extended to the side) ── */}
        <mesh geometry={leftArmGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>
        <mesh geometry={leftForearmGeo}>
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>
        {/* Left hand */}
        <mesh position={[-0.21, 0.118, -0.01]}>
          <sphereGeometry args={[0.006, 10, 10]} />
          <meshPhysicalMaterial {...porcelainMaterial} />
        </mesh>
      </group>
    </group>
  );
}
