"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ClusteringProps {
  position: [number, number, number]
  scale?: number
}

export function Clustering({ position, scale = 1 }: ClusteringProps) {
  const groupRef = useRef<THREE.Group>(null)
  const cluster1Ref = useRef<THREE.Points>(null)
  const cluster2Ref = useRef<THREE.Points>(null)
  const cluster3Ref = useRef<THREE.Points>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // Create cluster data
  useEffect(() => {
    const createClusterGeometry = (center: THREE.Vector3, radius: number, count: number) => {
      const positions = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = radius * Math.cbrt(Math.random()) // Cube root for uniform distribution

        const x = center.x + r * Math.sin(phi) * Math.cos(theta)
        const y = center.y + r * Math.sin(phi) * Math.sin(theta)
        const z = center.z + r * Math.cos(phi)

        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      return geometry
    }

    // Create three clusters
    if (cluster1Ref.current) {
      const geometry1 = createClusterGeometry(new THREE.Vector3(-1.5, 1, 0), 0.8, 50)
      if (cluster1Ref.current.geometry) cluster1Ref.current.geometry.dispose()
      cluster1Ref.current.geometry = geometry1
    }

    if (cluster2Ref.current) {
      const geometry2 = createClusterGeometry(new THREE.Vector3(1.5, 1, 0), 0.8, 50)
      if (cluster2Ref.current.geometry) cluster2Ref.current.geometry.dispose()
      cluster2Ref.current.geometry = geometry2
    }

    if (cluster3Ref.current) {
      const geometry3 = createClusterGeometry(new THREE.Vector3(0, -1.5, 0), 0.8, 50)
      if (cluster3Ref.current.geometry) cluster3Ref.current.geometry.dispose()
      cluster3Ref.current.geometry = geometry3
    }
  }, [])

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Animate clusters
      const time = state.clock.elapsedTime

      // Every 5 seconds, change animation phase
      if (Math.floor(time / 5) % 3 !== animationPhase) {
        setAnimationPhase(Math.floor(time / 5) % 3)
      }

      // Pulse effect based on animation phase
      if (cluster1Ref.current && cluster1Ref.current.material instanceof THREE.PointsMaterial) {
        const pulse1 = animationPhase === 0 ? Math.sin(time * 2) * 0.5 + 0.5 : 0.5
        cluster1Ref.current.material.size = 0.08 + pulse1 * 0.04
      }

      if (cluster2Ref.current && cluster2Ref.current.material instanceof THREE.PointsMaterial) {
        const pulse2 = animationPhase === 1 ? Math.sin(time * 2) * 0.5 + 0.5 : 0.5
        cluster2Ref.current.material.size = 0.08 + pulse2 * 0.04
      }

      if (cluster3Ref.current && cluster3Ref.current.material instanceof THREE.PointsMaterial) {
        const pulse3 = animationPhase === 2 ? Math.sin(time * 2) * 0.5 + 0.5 : 0.5
        cluster3Ref.current.material.size = 0.08 + pulse3 * 0.04
      }
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Cluster 1 */}
      <points ref={cluster1Ref}>
        <pointsMaterial color="#ff6b6b" size={0.1} sizeAttenuation transparent opacity={0.8} />
      </points>

      {/* Cluster 2 */}
      <points ref={cluster2Ref}>
        <pointsMaterial color="#4ecdc4" size={0.1} sizeAttenuation transparent opacity={0.8} />
      </points>

      {/* Cluster 3 */}
      <points ref={cluster3Ref}>
        <pointsMaterial color="#ffbe0b" size={0.1} sizeAttenuation transparent opacity={0.8} />
      </points>
    </group>
  )
}
