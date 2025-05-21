"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface TransformerProps {
  position: [number, number, number]
  scale?: number
}

export function Transformer({ position, scale = 1 }: TransformerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const blocksRef = useRef<THREE.InstancedMesh>(null)
  const connectionsRef = useRef<THREE.LineSegments>(null)
  const [blocks, setBlocks] = useState<THREE.Vector3[]>([])
  const [connections, setConnections] = useState<number[][]>([])
  const [dummy] = useState(() => new THREE.Object3D())

  // Create transformer architecture
  useEffect(() => {
    const blockPositions: THREE.Vector3[] = []
    const blockConnections: number[][] = []

    // Input embedding
    blockPositions.push(new THREE.Vector3(0, 2.5, 0))

    // Self-attention blocks
    blockPositions.push(new THREE.Vector3(-1.5, 1, 0))
    blockPositions.push(new THREE.Vector3(0, 1, 0))
    blockPositions.push(new THREE.Vector3(1.5, 1, 0))

    // Connect input to attention blocks
    blockConnections.push([0, 1])
    blockConnections.push([0, 2])
    blockConnections.push([0, 3])

    // Feed-forward blocks
    blockPositions.push(new THREE.Vector3(-1.5, -0.5, 0))
    blockPositions.push(new THREE.Vector3(0, -0.5, 0))
    blockPositions.push(new THREE.Vector3(1.5, -0.5, 0))

    // Connect attention to feed-forward
    blockConnections.push([1, 4])
    blockConnections.push([2, 5])
    blockConnections.push([3, 6])

    // Output layer
    blockPositions.push(new THREE.Vector3(0, -2, 0))

    // Connect feed-forward to output
    blockConnections.push([4, 7])
    blockConnections.push([5, 7])
    blockConnections.push([6, 7])

    setBlocks(blockPositions)
    setConnections(blockConnections)
  }, [])

  // Update block instances
  useEffect(() => {
    if (blocksRef.current && blocks.length > 0) {
      // Ensure we have a valid instance mesh
      if (!blocksRef.current.count) return

      blocks.forEach((pos, i) => {
        if (i < blocksRef.current!.count) {
          dummy.position.copy(pos)
          dummy.updateMatrix()
          blocksRef.current?.setMatrixAt(i, dummy.matrix)
        }
      })
      blocksRef.current.instanceMatrix.needsUpdate = true
    }
  }, [blocks, dummy])

  // Update connections
  useEffect(() => {
    if (connectionsRef.current && connections.length > 0 && blocks.length > 0) {
      const positions: number[] = []

      connections.forEach(([from, to]) => {
        // Make sure both blocks exist before accessing their properties
        if (blocks[from] && blocks[to]) {
          positions.push(blocks[from].x, blocks[from].y, blocks[from].z, blocks[to].x, blocks[to].y, blocks[to].z)
        }
      })

      // Only create geometry if we have valid positions
      if (positions.length > 0) {
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

        if (connectionsRef.current.geometry) {
          connectionsRef.current.geometry.dispose()
        }

        connectionsRef.current.geometry = geometry
      }
    }
  }, [connections, blocks])

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Pulse effect on connections
      if (connectionsRef.current && connectionsRef.current.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
        connectionsRef.current.material.opacity = 0.2 + pulse * 0.8
      }
    }
  })

  // Calculate the total number of blocks
  const totalBlocks = blocks.length || 8 // Fallback to a default value

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Transformer blocks */}
      <instancedMesh ref={blocksRef} args={[undefined, undefined, totalBlocks]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#ff9e4a"
          emissive="#ff9e4a"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </instancedMesh>

      {/* Connections */}
      <lineSegments ref={connectionsRef}>
        <lineBasicMaterial color="#ff9e4a" transparent opacity={0.6} linewidth={1} />
      </lineSegments>
    </group>
  )
}
