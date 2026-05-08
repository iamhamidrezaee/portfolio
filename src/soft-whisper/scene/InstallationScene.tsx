import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

import { FINAL_MESSAGE } from "@/soft-whisper/experience/cues";
import type { HandleState, VisualTargets } from "@/soft-whisper/experience/types";
import { OrnateMusicBox } from "@/soft-whisper/scene/OrnateMusicBox";

interface InstallationSceneProps {
  stateValue: string;
  handle: HandleState;
  visualTargets: VisualTargets;
}

function RoomShell() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#31261f" roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh receiveShadow position={[0, 6, -6]}>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial color="#201814" roughness={1} metalness={0} />
      </mesh>

      <mesh receiveShadow position={[-8, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#241c17" roughness={1} metalness={0} />
      </mesh>

      <mesh receiveShadow position={[8, 6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#241c17" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function Table() {
  return (
    <group position={[0, 0.62, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.08, 1.6]} />
        <meshStandardMaterial color="#5b4233" roughness={0.7} metalness={0.08} />
      </mesh>
      {[-1.2, 1.2].flatMap((x) =>
        [-0.62, 0.62].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, -0.58, z]}>
            <cylinderGeometry args={[0.04, 0.05, 1.16, 16]} />
            <meshStandardMaterial color="#3f2d23" roughness={0.58} metalness={0.16} />
          </mesh>
        )),
      )}
    </group>
  );
}

export function InstallationScene({ stateValue, handle, visualTargets }: InstallationSceneProps) {
  const camera = useThree((state) => state.camera);

  useFrame((_, delta) => {
    camera.position.x = MathUtils.damp(camera.position.x, visualTargets.cameraPosition[0], 2.8, delta);
    camera.position.y = MathUtils.damp(camera.position.y, visualTargets.cameraPosition[1], 2.8, delta);
    camera.position.z = MathUtils.damp(camera.position.z, visualTargets.cameraPosition[2], 2.8, delta);
    camera.lookAt(...visualTargets.lookAt);
  });

  return (
    <>
      <color attach="background" args={["#18110e"]} />
      <fog attach="fog" args={["#18110e", 16, 28]} />

      <ambientLight intensity={2.5} color="#eadbc6" />
      <hemisphereLight intensity={1.35} color="#f3e6cf" groundColor="#261710" />

      <spotLight
        castShadow
        position={[0.7, 7.2, 1.2]}
        angle={0.48}
        penumbra={0.62}
        intensity={visualTargets.spotlightIntensity * 1.22}
        color="#f6edd7"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00018}
      />

      <spotLight
        position={[4.2, 3.6, 3.8]}
        angle={0.65}
        penumbra={1}
        intensity={visualTargets.spotlightIntensity * 0.48}
        color="#c0cad7"
      />

      <spotLight
        position={[-3.6, 4.5, 2.4]}
        angle={0.72}
        penumbra={1}
        intensity={visualTargets.spotlightIntensity * 0.32}
        color="#bcae94"
      />

      <pointLight
        position={[0, 2.0, 3.3]}
        intensity={2.35}
        color="#f2debb"
        distance={7.6}
        decay={2}
      />

      <pointLight
        position={[0, 1.38, 0.22]}
        intensity={1.35 + visualTargets.boxGlow * 3.4}
        color="#e8c882"
        distance={5.1}
        decay={2}
      />

      <pointLight
        position={[0.25, 1.24, -0.2]}
        intensity={0.8 + visualTargets.boxGlow * 1.9}
        color="#f2d7a1"
        distance={3.1}
        decay={2}
      />

      <RoomShell />
      <Table />

      <OrnateMusicBox
        lidAngleDeg={visualTargets.lidAngleDeg}
        crankAngleDeg={handle.crankAngleDeg}
        interiorVisibility={visualTargets.interiorVisibility}
        ballerinaOpacity={visualTargets.ballerinaOpacity}
        boxGlow={visualTargets.boxGlow}
        showPlaque={stateValue === "messageHold"}
        message={FINAL_MESSAGE}
      />

    </>
  );
}
