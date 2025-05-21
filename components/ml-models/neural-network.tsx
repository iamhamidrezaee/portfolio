"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface NeuralNetworkProps {
  position: [number, number, number]
  scale?: number
}

export function NeuralNetwork({ position, scale = 1 }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const [nodes, setNodes] = useState<THREE.Vector3[]>([])
  const [edges, setEdges] = useState<number[][]>([])
  const [dummy] = useState(() => new THREE.Object3D())

  // Create neural network structure
  useEffect(() => {
    const layerSizes = [4, 6, 6, 4]
    const layerDistance = 2
    const nodePositions: THREE.Vector3[] = []
    const connections: number[][] = []

    // Create nodes
    let nodeIndex = 0
    layerSizes.forEach((size, layerIndex) => {
      for (let i = 0; i < size; i++) {
        const x = layerIndex * layerDistance - ((layerSizes.length - 1) * layerDistance) / 2
        const y = i * 1.2 - (size - 1) * 0.6
        const z = 0

        nodePositions.push(new THREE.Vector3(x, y, z))

        // Connect to next layer
        if (layerIndex < layerSizes.length - 1) {
          for (let j = 0; j < layerSizes[layerIndex + 1]; j++) {
            connections.push([nodeIndex, nodeIndex + size + j])
          }
        }

        nodeIndex++
      }
    })

    setNodes(nodePositions)
    setEdges(connections)
  }, [])

  // Update node instances
  useEffect(() => {
    if (nodesRef.current && nodes.length > 0) {
      // Ensure we have a valid instance mesh
      if (!nodesRef.current.count) return

      nodes.forEach((pos, i) => {
        if (i < nodesRef.current!.count) {
          dummy.position.copy(pos)
          dummy.updateMatrix()
          nodesRef.current?.setMatrixAt(i, dummy.matrix)
        }
      })
      nodesRef.current.instanceMatrix.needsUpdate = true
    }
  }, [nodes, dummy])

  // Update edges
  useEffect(() => {
    if (edgesRef.current && edges.length > 0 && nodes.length > 0) {
      const positions: number[] = []

      edges.forEach(([from, to]) => {
        // Make sure both nodes exist before accessing their properties
        if (nodes[from] && nodes[to]) {
          positions.push(nodes[from].x, nodes[from].y, nodes[from].z, nodes[to].x, nodes[to].y, nodes[to].z)
        }
      })

      // Only create geometry if we have valid positions
      if (positions.length > 0) {
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

        if (edgesRef.current.geometry) {
          edgesRef.current.geometry.dispose()
        }

        edgesRef.current.geometry = geometry
      }
    }
  }, [edges, nodes])

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Pulse effect on edges
      if (edgesRef.current && edgesRef.current.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
        edgesRef.current.material.opacity = 0.2 + pulse * 0.8
      }
    }
  })

  // Calculate the total number of nodes
  const totalNodes = nodes.length || 20 // Fallback to a default value

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, totalNodes]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#4a9eff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <lineBasicMaterial color="#4a9eff" transparent opacity={0.6} linewidth={1} />
      </lineSegments>
    </group>
  )
}
