"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface LinearRegressionProps {
  position: [number, number, number]
  scale?: number
}

export function LinearRegression({ position, scale = 1 }: LinearRegressionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const lineRef = useRef<THREE.Line>(null)
  const [points, setPoints] = useState<THREE.Vector3[]>([])

  // Create data points and regression line
  useEffect(() => {
    // Generate random data points with a linear trend
    const numPoints = 20
    const dataPoints: THREE.Vector3[] = []

    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 4 - 2
      // y = mx + b + noise
      const y = 0.8 * x + 0.5 + (Math.random() - 0.5)
      const z = 0

      dataPoints.push(new THREE.Vector3(x, y, z))
    }

    setPoints(dataPoints)
  }, [])

  // Update regression line
  useEffect(() => {
    if (lineRef.current && points.length > 0) {
      // Simple linear regression
      let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0

      points.forEach((point) => {
        sumX += point.x
        sumY += point.y
        sumXY += point.x * point.y
        sumX2 += point.x * point.x
      })

      const n = points.length
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // Create line geometry
      const linePoints = [
        new THREE.Vector3(-2.5, slope * -2.5 + intercept, 0),
        new THREE.Vector3(2.5, slope * 2.5 + intercept, 0),
      ]

      const geometry = new THREE.BufferGeometry().setFromPoints(linePoints)

      if (lineRef.current.geometry) {
        lineRef.current.geometry.dispose()
      }

      lineRef.current.geometry = geometry
    }
  }, [points])

  // Update data points
  useEffect(() => {
    if (pointsRef.current && points.length > 0) {
      const positions = new Float32Array(points.length * 3)

      points.forEach((point, i) => {
        positions[i * 3] = point.x
        positions[i * 3 + 1] = point.y
        positions[i * 3 + 2] = point.z
      })

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      if (pointsRef.current.geometry) {
        pointsRef.current.geometry.dispose()
      }

      pointsRef.current.geometry = geometry
    }
  }, [points])

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2

      // Pulse effect on line
      if (lineRef.current && lineRef.current.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
        lineRef.current.material.opacity = 0.5 + pulse * 0.5
      }
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Data points */}
      <points ref={pointsRef}>
        <pointsMaterial color="#ff4a9e" size={0.1} sizeAttenuation />
      </points>

      {/* Regression line */}
      <line ref={lineRef}>
        <lineBasicMaterial color="#ff4a9e" transparent opacity={0.8} linewidth={2} />
      </line>
    </group>
  )
}
