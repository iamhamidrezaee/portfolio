"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface DecisionTreeProps {
  position: [number, number, number]
  scale?: number
}

export function DecisionTree({ position, scale = 1 }: DecisionTreeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const [nodes, setNodes] = useState<THREE.Vector3[]>([])
  const [edges, setEdges] = useState<number[][]>([])
  const [dummy] = useState(() => new THREE.Object3D())

  // Create decision tree structure
  useEffect(() => {
    const nodePositions: THREE.Vector3[] = []
    const connections: number[][] = []

    // Root node
    nodePositions.push(new THREE.Vector3(0, 2, 0))

    // Level 1
    nodePositions.push(new THREE.Vector3(-1.5, 0.5, 0))
    nodePositions.push(new THREE.Vector3(1.5, 0.5, 0))

    // Connect root to level 1
    connections.push([0, 1])
    connections.push([0, 2])

    // Level 2 (left branch)
    nodePositions.push(new THREE.Vector3(-2.5, -1, 0))
    nodePositions.push(new THREE.Vector3(-0.5, -1, 0))

    // Connect level 1 left to level 2
    connections.push([1, 3])
    connections.push([1, 4])

    // Level 2 (right branch)
    nodePositions.push(new THREE.Vector3(0.5, -1, 0))
    nodePositions.push(new THREE.Vector3(2.5, -1, 0))

    // Connect level 1 right to level 2
    connections.push([2, 5])
    connections.push([2, 6])

    // Level 3 (leaf nodes)
    nodePositions.push(new THREE.Vector3(-3, -2.5, 0))
    nodePositions.push(new THREE.Vector3(-2, -2.5, 0))
    nodePositions.push(new THREE.Vector3(-1, -2.5, 0))
    nodePositions.push(new THREE.Vector3(0, -2.5, 0))
    nodePositions.push(new THREE.Vector3(1, -2.5, 0))
    nodePositions.push(new THREE.Vector3(2, -2.5, 0))
    nodePositions.push(new THREE.Vector3(3, -2.5, 0))

    // Connect level 2 to level 3
    connections.push([3, 7])
    connections.push([3, 8])
    connections.push([4, 9])
    connections.push([4, 10])
    connections.push([5, 11])
    connections.push([5, 12])
    connections.push([6, 13])

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

      // Subtle breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1
      groupRef.current.scale.set(breathe * scale, breathe * scale, breathe * scale)
    }
  })

  // Calculate the total number of nodes
  const totalNodes = nodes.length || 14 // Fallback to a default value

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, totalNodes]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#4aff9e"
          emissive="#4aff9e"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>

      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <lineBasicMaterial color="#4aff9e" transparent opacity={0.6} linewidth={1} />
      </lineSegments>
    </group>
  )
}
