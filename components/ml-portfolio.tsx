"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
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
import { useAudio } from "@/hooks/use-audio"

export default function MLPortfolio() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useMobile()
  const [userInteracted, setUserInteracted] = useState(false);

  // Destructure the audio element itself from the hook
  const { play: playAmbientSound, stop: stopAmbientSound, audio: audioInstance, isPlaying } = useAudio("/ambient.mp3", {
    loop: true,
    volume: 0.5, // Start with a reasonable volume, not blasting unless for temporary debug
  });

  const attemptPlay = useCallback(() => {
    if (audioInstance && audioInstance.paused && (audioInstance.readyState >= 2 || audioInstance.readyState === HTMLMediaElement.HAVE_CURRENT_DATA || audioInstance.readyState === HTMLMediaElement.HAVE_FUTURE_DATA || audioInstance.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA)) { // Check if audio is available and ready
      console.log("Attempting to play audio now. Ready state:", audioInstance.readyState);
      audioInstance.play()
        .then(() => {
          console.log("Audio playback started successfully.");
          // The useAudio hook's internal setIsPlaying should handle this
        })
        .catch(error => {
          console.warn("Audio play attempt failed:", error.name, error.message);
          // This catch is important, especially for autoplay issues.
        });
    } else if (audioInstance) {
      console.log("Audio not ready or already playing. Ready state:", audioInstance.readyState, "Paused:", audioInstance.paused);
    } else {
      console.log("Audio instance not available yet.");
    }
  }, [audioInstance]); // Removed playAmbientSound as it's the function itself from the hook, not a dep here.

  // Effect for initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Effect to attempt playing audio when page is loaded and audio element is available
  useEffect(() => {
    if (isLoaded && audioInstance) {
      console.log("Page loaded and audio instance available. Attempting initial play.");
      attemptPlay();
    }
    // Cleanup audio when the main portfolio component unmounts
    return () => {
      if (stopAmbientSound) { // Check if stop function exists
         console.log("Stopping ambient sound on MLPortfolio unmount.");
        stopAmbientSound();
      }
    };
  }, [isLoaded, audioInstance, attemptPlay, stopAmbientSound]);


  // Handler for user interaction
  const handleFirstInteraction = useCallback(() => {
    if (!userInteracted) {
      console.log("First user interaction detected.");
      setUserInteracted(true);
      // attemptPlay(); // Attempt to play immediately on first interaction
    }
  }, [userInteracted /*, attemptPlay */]); // attemptPlay here might cause loop if not careful

  // Effect for user interaction driven play (if initial play failed)
   useEffect(() => {
    if (isLoaded && userInteracted && audioInstance && audioInstance.paused) {
      console.log("User has interacted and audio is paused. Attempting play.");
      attemptPlay();
    }
  }, [isLoaded, userInteracted, audioInstance, attemptPlay]);


  useEffect(() => {
    // Add event listeners for the first user interaction
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      // Clean up global event listeners
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [handleFirstInteraction]); // Re-attach if handleFirstInteraction changes (it shouldn't with useCallback if deps are right)


  const handleSectionChange = (section: string | null) => {
    setActiveSection(section);
    handleFirstInteraction(); // Any significant interaction should count
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#050510] overflow-hidden"
      // Adding interaction listeners directly to the main div for broader coverage
      onClick={handleFirstInteraction} 
      onKeyDown={handleFirstInteraction} 
      tabIndex={0} // Make div focusable for keydown
    >
      {!isLoaded && <LoadingScreen />}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="w-full h-full"
        onClick={handleFirstInteraction} // Also on canvas
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