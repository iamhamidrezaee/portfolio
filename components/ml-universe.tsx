"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { NeuralNetwork } from "@/components/ml-models/neural-network"
import { DecisionTree } from "@/components/ml-models/decision-tree"
import { LinearRegression } from "@/components/ml-models/linear-regression"
import { SigmoidFunction } from "@/components/ml-models/sigmoid-function"
import { Clustering } from "@/components/ml-models/clustering"
import { Transformer } from "@/components/ml-models/transformer"
import { NavigationNode } from "@/components/navigation-node"
import { useMobile } from "@/hooks/use-mobile"

interface MLUniverseProps {
  activeSection: string | null
  onSectionChange: (section: string | null) => void
  isLoaded: boolean
}

export function MLUniverse({ activeSection, onSectionChange, isLoaded }: MLUniverseProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const [hovered, setHovered] = useState<string | null>(null)
  const { camera, mouse } = useThree()
  const isMobile = useMobile()

  // Track mouse position for interactions
  useFrame(() => {
    mouseRef.current.x = mouse.x
    mouseRef.current.y = mouse.y

    if (groupRef.current && isLoaded) {
      // Gentle rotation of the entire universe
      groupRef.current.rotation.y += 0.001

      // Subtle breathing animation
      const breathingScale = 1 + Math.sin(Date.now() * 0.001) * 0.02
      groupRef.current.scale.set(breathingScale, breathingScale, breathingScale)
    }
  })

  // Handle random click animations
  const handleCanvasClick = (event: THREE.Event) => {
    if (activeSection) return // Don't trigger if a section is open

    // Prevent the click from propagating to navigation nodes
    if ((event.object as any).isNavigationNode) return

    // Generate random animation effect
    const randomEffect = Math.floor(Math.random() * 3)
    // Animation logic would be implemented here
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust camera and positions based on screen size
      if (isMobile) {
        camera.position.z = 20
      } else {
        camera.position.z = 15
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [camera, isMobile])

  // Fade in animation when loaded
  useEffect(() => {
    if (groupRef.current) {
      // Initially hide the group
      groupRef.current.visible = false

      // Add a small delay to ensure all models are properly initialized
      const timer = setTimeout(() => {
        if (isLoaded && groupRef.current) {
          groupRef.current.scale.set(1, 1, 1)
          groupRef.current.visible = true
        } else if (groupRef.current) {
          groupRef.current.scale.set(0.1, 0.1, 0.1)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  return (
    <group ref={groupRef} onClick={handleCanvasClick}>
      {/* ML Concept Models */}
      <NeuralNetwork position={[0, 0, 0]} scale={isMobile ? 0.8 : 1} />
      <DecisionTree position={[6, 3, -2]} scale={isMobile ? 0.6 : 0.8} />
      <LinearRegression position={[-5, 2, -3]} scale={isMobile ? 0.6 : 0.8} />
      <SigmoidFunction position={[5, -3, -2]} scale={isMobile ? 0.6 : 0.8} />
      <Clustering position={[-5, -3, -2]} scale={isMobile ? 0.6 : 0.8} />
      <Transformer position={[0, -6, -3]} scale={isMobile ? 0.6 : 0.8} />

      {/* Navigation Nodes */}
      <NavigationNode
        position={[-5, 2.5, -3]}
        label="About Me"
        section="about"
        icon="linear-regression"
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        hovered={hovered === "about"}
        setHovered={setHovered}
      />

      <NavigationNode
        position={[0, 0, 0]}
        label="Projects"
        section="projects"
        icon="neural-network"
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        hovered={hovered === "projects"}
        setHovered={setHovered}
      />

      <NavigationNode
        position={[6, 3, -2]}
        label="Skills"
        section="skills"
        icon="decision-tree"
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        hovered={hovered === "skills"}
        setHovered={setHovered}
      />

      <NavigationNode
        position={[5, -3, -2]}
        label="Writings"
        section="writings"
        icon="sigmoid"
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        hovered={hovered === "writings"}
        setHovered={setHovered}
      />

      <NavigationNode
        position={[0, -6, -3]}
        label="Contact"
        section="contact"
        icon="transformer"
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        hovered={hovered === "contact"}
        setHovered={setHovered}
      />

      {/* Ambient particles */}
      <ParticlesComponent count={isMobile ? 100 : 200} />

      {/* Title */}
      <Text
        position={[0, 6, 0]}
        fontSize={isMobile ? 0.8 : 1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        Hamid Rezaee
      </Text>

      <Text
        position={[0, 5, 0]}
        fontSize={isMobile ? 0.4 : 0.5}
        color="#8a8aff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        Machine Learning Engineer
      </Text>
    </group>
  )
}

// Separate component to avoid issues with instancedMesh
function ParticlesComponent({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const [dummy] = useState(() => new THREE.Object3D())

  useEffect(() => {
    // Position particles randomly in space
    if (mesh.current) {
      // Ensure count is valid
      const particleCount = count > 0 ? count : 100

      for (let i = 0; i < particleCount; i++) {
        const radius = 10 + Math.random() * 10
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI

        dummy.position.x = radius * Math.sin(phi) * Math.cos(theta)
        dummy.position.y = radius * Math.sin(phi) * Math.sin(theta)
        dummy.position.z = radius * Math.cos(phi)

        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      }
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [count, dummy])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0003
      mesh.current.rotation.y += 0.0005
    }
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count || 100]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#4040ff" transparent opacity={0.6} />
    </instancedMesh>
  )
}
