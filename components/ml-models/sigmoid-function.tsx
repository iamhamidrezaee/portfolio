"use client"
import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SigmoidFunctionProps {
  position: [number, number, number]
  scale?: number
}

export function SigmoidFunction({ position, scale = 1 }: SigmoidFunctionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const curveRef = useRef<THREE.Line>(null)
  const xAxisRef = useRef<THREE.Line>(null)
  const yAxisRef = useRef<THREE.Line>(null)

  // Create properly initialized geometries
  const initialCurveGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    // Initialize with a minimal valid geometry
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]
    geometry.setFromPoints(points)
    return geometry
  }, [])

  const xAxisGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const points = [new THREE.Vector3(-5, -1, 0), new THREE.Vector3(5, -1, 0)]
    geometry.setFromPoints(points)
    return geometry
  }, [])

  const yAxisGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const points = [new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 0)]
    geometry.setFromPoints(points)
    return geometry
  }, [])

  // Create sigmoid curve with adjustable steepness
  useEffect(() => {
    if (curveRef.current) {
      const points: THREE.Vector3[] = []
      
      // Steepness parameter - higher values make the curve steeper
      const steepness = 4.0
      
      // Generate sigmoid curve points
      for (let x = -5; x <= 5; x += 0.1) {
        const sigmoid = 1 / (1 + Math.exp(-steepness * x))
        points.push(new THREE.Vector3(x, sigmoid * 2 - 1, 0))
      }
      
      // Create the new geometry from points
      const newGeometry = new THREE.BufferGeometry()
      newGeometry.setFromPoints(points)
      
      // Dispose the old geometry if it exists and is not the initial one
      if (curveRef.current.geometry && curveRef.current.geometry !== initialCurveGeometry) {
        curveRef.current.geometry.dispose()
      }
      
      // Assign the new populated geometry
      curveRef.current.geometry = newGeometry
    }
  }, [initialCurveGeometry])

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

  // Cleanup function
  useEffect(() => {
    return () => {
      // Cleanup geometries on unmount
      if (curveRef.current?.geometry && curveRef.current.geometry !== initialCurveGeometry) {
        curveRef.current.geometry.dispose()
      }
      initialCurveGeometry.dispose()
      xAxisGeometry.dispose()
      yAxisGeometry.dispose()
    }
  }, [initialCurveGeometry, xAxisGeometry, yAxisGeometry])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Sigmoid curve */}
      <line ref={curveRef} geometry={initialCurveGeometry}>
        <lineBasicMaterial color="#9e4aff" transparent opacity={0.8} linewidth={2} />
      </line>
      
      {/* X-axis line */}
      <line ref={xAxisRef} geometry={xAxisGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </line>
      
      {/* Y-axis line */}
      <line ref={yAxisRef} geometry={yAxisGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </line>
    </group>
  )
}