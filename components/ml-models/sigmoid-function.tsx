"use client"

import { useRef, useEffect, useMemo } from "react" // Import useMemo
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SigmoidFunctionProps {
  position: [number, number, number]
  scale?: number
}

export function SigmoidFunction({ position, scale = 1 }: SigmoidFunctionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const curveRef = useRef<THREE.Line>(null)

  // Create an initial, stable, empty but valid geometry
  const initialGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    // Set an empty position attribute to ensure 'count' exists
    geom.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    return geom;
  }, []);

  // Create sigmoid curve with adjustable steepness
  useEffect(() => {
    if (curveRef.current) {
      const points: THREE.Vector3[] = []
      
      // Steepness parameter - higher values make the curve steeper
      const steepness = 4.0; // You adjusted this, which is fine
      
      // Generate sigmoid curve points
      for (let x = -5; x <= 5; x += 0.1) {
        const sigmoid = 1 / (1 + Math.exp(-steepness * x))
        points.push(new THREE.Vector3(x, sigmoid * 2 - 1, 0))
      }

      // Create the new geometry from points
      const newPopulatedGeometry = new THREE.BufferGeometry().setFromPoints(points);

      // Dispose the old geometry if it's not the initial one and it exists
      if (curveRef.current.geometry && curveRef.current.geometry !== initialGeometry) {
        curveRef.current.geometry.dispose();
      }
      
      // Assign the new, populated geometry
      curveRef.current.geometry = newPopulatedGeometry;
    }
  }, [initialGeometry]); // useEffect will run once after mount, initialGeometry is stable

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Pulse effect on curve
      if (curveRef.current && curveRef.current.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.5 + 0.5
        if (curveRef.current.material.opacity !== undefined) { // Check if opacity is a valid property
            curveRef.current.material.opacity = 0.5 + pulse * 0.5;
        }
      }
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Sigmoid curve - assign the initial geometry */}
      <line ref={curveRef} geometry={initialGeometry}>
        <lineBasicMaterial color="#9e4aff" transparent opacity={0.8} linewidth={2} />
      </line>

      {/* Axis lines - These are generally fine as R3F handles their geometry creation */}
      <line>
        <bufferGeometry attach="geometry" setFromPoints={[new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </line>
      <line>
        <bufferGeometry
          attach="geometry"
          setFromPoints={[new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 0)]}
        />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </line>
    </group>
  )
}