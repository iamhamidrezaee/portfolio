"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Text } from "@react-three/drei"
import * as THREE from "three"

interface NavigationNodeProps {
  position: [number, number, number]
  label: string
  section: string
  icon: string
  activeSection: string | null
  onSectionChange: (section: string | null) => void
  hovered: boolean
  setHovered: (section: string | null) => void
}

export function NavigationNode({
  position,
  label,
  section,
  icon,
  activeSection,
  onSectionChange,
  hovered,
  setHovered,
}: NavigationNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [scale, setScale] = useState(1)
  const [glowing, setGlowing] = useState(false)

  // Handle hover state
  const handlePointerOver = () => {
    setHovered(section)
    setGlowing(true)
  }

  const handlePointerOut = () => {
    setHovered(null)
    setGlowing(false)
  }

  // Handle click
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation()
    onSectionChange(section)
    // Mark this object to prevent global click handler
    ;(e.object as any).isNavigationNode = true
  }

  // Animation effects
  useFrame(() => {
    if (groupRef.current) {
      // Hover animation
      const targetScale = hovered || activeSection === section ? 1.2 : 1
      setScale(THREE.MathUtils.lerp(scale, targetScale, 0.1))

      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1

      // Rotation animation
      groupRef.current.rotation.y += 0.01
    }
  })

  // Determine the node color based on the icon type
  const getNodeColor = () => {
    switch (icon) {
      case "neural-network":
        return "#4a9eff"
      case "decision-tree":
        return "#4aff9e"
      case "linear-regression":
        return "#ff4a9e"
      case "sigmoid":
        return "#9e4aff"
      case "transformer":
        return "#ff9e4a"
      default:
        return "#ffffff"
    }
  }

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Node sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={getNodeColor()}
          emissiveIntensity={glowing ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Label */}
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}

      {/* Icon based on type */}
      {icon === "neural-network" && (
        <mesh position={[0, 0, 0.3]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}

      {icon === "decision-tree" && (
        <group position={[0, 0, 0.3]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.15, -0.15, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.15, -0.15, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {icon === "linear-regression" && (
        <group position={[0, 0, 0.3]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.4, 0.05, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {icon === "sigmoid" && (
        <group position={[0, 0, 0.3]}>
          <mesh>
            <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {icon === "transformer" && (
        <group position={[0, 0, 0.3]}>
          <mesh>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>
        </group>
      )}
    </group>
  )
}
