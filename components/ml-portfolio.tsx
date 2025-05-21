"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Html } from "@react-three/drei"
import { MLUniverse } from "@/components/ml-universe"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { WritingsSection } from "@/components/sections/writings-section"
import { ContactSection } from "@/components/sections/contact-section"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { useMobile } from "@/hooks/use-mobile"
import { useAudio } from "@/hooks/use-audio" // Import useAudio

export default function MLPortfolio() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useMobile()

  // Initialize audio hook for ambient sound
  const { play: playAmbientSound, stop: stopAmbientSound, isReady } = useAudio("/ambient.mp3", {
    loop: true,
    volume: 0.6, // Blast it for testing
  })

  // Handle section changes
  const handleSectionChange = (section: string | null) => {
    setActiveSection(section)
  }

  // Simulate loading delay for the intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Attempt to play ambient sound when loaded and when the audio is ready
  useEffect(() => {
    if (isLoaded && isReady) {
      console.log("Attempting to play ambient sound (isLoaded && isReady)")
      playAmbientSound()
    } else {
      console.log("Ambient sound not playing:", { isLoaded, isReady })
    }

    // Cleanup: stop the sound if the component unmounts
    return () => {
      console.log("Stopping ambient sound on unmount")
      stopAmbientSound()
    }
  }, [isLoaded, isReady, playAmbientSound, stopAmbientSound])

  // Optionally, try to play again after a short delay in case of loading issues
  useEffect(() => {
    if (isLoaded && !isReady) {
      const retryTimer = setTimeout(() => {
        console.log("Retrying to play ambient sound after a delay")
        playAmbientSound()
      }, 500)
      return () => clearTimeout(retryTimer)
    }
  }, [isLoaded, isReady, playAmbientSound])

  return (
    <div className="relative w-full h-screen bg-[#050510] overflow-hidden">
      {!isLoaded && <LoadingScreen />}

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={<LoaderComponent />}>
          <MLUniverse activeSection={activeSection} onSectionChange={handleSectionChange} isLoaded={isLoaded} />
          <Environment preset="night" />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Content Sections */}
      {activeSection === "about" && <AboutSection onClose={() => setActiveSection(null)} />}
      {activeSection === "projects" && <ProjectsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "skills" && <SkillsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "writings" && <WritingsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "contact" && <ContactSection onClose={() => setActiveSection(null)} />}
    </div>
  )
}

// Separate component to avoid state updates during render
function LoaderComponent() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <Html center>
      <div className="text-white text-xl font-light">{Math.floor(progress)}% loaded</div>
    </Html>
  )
}