"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SigmoidFunctionProps {
  position: [number, number, number]
  scale?: number
}

export function SigmoidFunction({ position, scale = 1 }: SigmoidFunctionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const curveRef = useRef<THREE.Line>(null)

  // Create sigmoid curve
  useEffect(() => {
    if (curveRef.current) {
      const points: THREE.Vector3[] = []

      // Generate sigmoid curve points
      for (let x = -5; x <= 5; x += 0.1) {
        const sigmoid = 1 / (1 + Math.exp(-x))
        points.push(new THREE.Vector3(x, sigmoid * 2 - 1, 0))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      if (curveRef.current.geometry) {
        curveRef.current.geometry.dispose()
      }

      curveRef.current.geometry = geometry
    }
  }, [])

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Pulse effect on curve
      if (curveRef.current && curveRef.current.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.5 + 0.5
        curveRef.current.material.opacity = 0.5 + pulse * 0.5
      }
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Sigmoid curve */}
      <line ref={curveRef}>
        <lineBasicMaterial color="#9e4aff" transparent opacity={0.8} linewidth={2} />
      </line>

      {/* Axis lines */}
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
