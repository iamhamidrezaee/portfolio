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

export default function MLPortfolio() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Effect for initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section: string | null) => {
    setActiveSection(section);
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#050510] overflow-hidden"
    >
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
            zoomSpeed={0.2}
          />
        </Suspense>
      </Canvas>

      {/* Interaction Hint */}
      {isLoaded && !activeSection && (
        <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/10 text-sm font-light animate-in fade-in duration-1000 pointer-events-none">
          <span className="flex items-center gap-2">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
              />
            </svg>
            Click + drag to look around
          </span>
        </div>
      )}

      {/* Content Sections */}
      {activeSection === "about" && <AboutSection onClose={() => setActiveSection(null)} />}
      {activeSection === "projects" && <ProjectsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "skills" && <SkillsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "writings" && <WritingsSection onClose={() => setActiveSection(null)} />}
      {activeSection === "contact" && <ContactSection onClose={() => setActiveSection(null)} />}
    </div>
  );
}

// LoaderComponent remains the same
function LoaderComponent() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <Html center>
      <div className="text-white text-xl font-light">{Math.floor(progress)}% loaded</div>
    </Html>
  );
}