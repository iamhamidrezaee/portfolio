"use client"

import { useState, useEffect, useCallback } from "react"

interface AudioOptions {
  volume?: number
  loop?: boolean
  autoplay?: boolean // Kept for completeness, though MLPortfolio might override
}

export function useAudio(src: string, options: AudioOptions = {}) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false) // New state for readiness

  useEffect(() => {
    // Only create audio element in browser environment
    if (typeof window !== "undefined") {
      const audioElement = new Audio()
      console.log(`useAudio: Creating new Audio element for ${src}`)

      audioElement.preload = "auto"; // Hint to the browser to load the audio

      // Set properties before setting src to avoid issues
      if (options.volume !== undefined) {
        // Clamp volume between 0 and 1
        audioElement.volume = Math.max(0, Math.min(1, options.volume))
      }
      if (options.loop !== undefined) {
        audioElement.loop = options.loop
      }

      // Event Handlers
      const handleError = (e: Event) => { // HTMLMediaElement error event is just Event
        console.warn(`useAudio: Audio error for ${src}`, e)
        setIsReady(false); // Audio is not ready if an error occurs
      }
      const handleCanPlayThrough = () => {
        console.log(`useAudio: Audio for ${src} can play through.`)
        setIsReady(true)
      }
      const handlePlaying = () => {
        setIsPlaying(true);
      };
      const handlePause = () => {
        setIsPlaying(false);
      };
      const handleEnded = () => {
        if (!audioElement.loop) { // Only set isPlaying to false if not looping
            setIsPlaying(false);
        }
      };


      audioElement.addEventListener("error", handleError)
      audioElement.addEventListener("canplaythrough", handleCanPlayThrough)
      audioElement.addEventListener("playing", handlePlaying);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);


      audioElement.src = src // Set source last
      setAudio(audioElement) // This will trigger re-render where hook is used

      return () => {
        console.log(`useAudio: Cleaning up Audio element for ${src}`)
        audioElement.pause()
        audioElement.removeEventListener("error", handleError)
        audioElement.removeEventListener("canplaythrough", handleCanPlayThrough)
        audioElement.removeEventListener("playing", handlePlaying);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
        audioElement.src = "" // Release the resource
        setAudio(null)      // Clear the audio element from state
        setIsReady(false)   // Reset readiness state
        setIsPlaying(false) // Reset playing state
      }
    }
    return undefined // For server-side or if window is undefined
  }, [src, options.volume, options.loop]) // options.autoplay handled in another effect

  // Autoplay effect - will attempt to play if options.autoplay is true AND audio is ready
  useEffect(() => {
    if (audio && isReady && options.autoplay && !isPlaying) {
      console.log(`useAudio: Autoplay triggered for ${src}`);
      audio.play().catch(error => {
        // This catch is for autoplay attempts within the hook
        console.warn(`useAudio: Autoplay for ${src} failed. Browser policy likely prevented it.`, error);
      });
    }
  }, [audio, isReady, options.autoplay, isPlaying]); // Removed play from here, direct audio.play()

  const play = useCallback(async (): Promise<void> => {
    if (audio && audio.paused) { // Check if audio exists and is actually paused
      console.log("useAudio: play() called by component");
      try {
        await audio.play();
        // isPlaying state will be updated by the 'playing' event listener
      } catch (error) {
        console.warn("useAudio: Error in play() caught:", error);
        // isPlaying state should be handled by 'pause' or 'error' listeners if play fails
        throw error; // Re-throw so the calling component can also catch it
      }
    } else if (audio && !audio.paused) {
      console.log("useAudio: play() called, but audio already playing.");
      return Promise.resolve(); // Indicate success as it's already playing
    } else {
      console.warn("useAudio: play() called, but audio element is not available or ready.");
      return Promise.reject(new Error("Audio element not available or not ready."));
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      // isPlaying state will be updated by the 'pause' event listener
    }
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset time
      // isPlaying state will be updated by the 'pause' event listener
    }
  }, [audio]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      // play() already returns a promise and handles errors.
      // The catch here is mostly for completeness if play() itself threw an unhandled error
      // before reaching audio.play() (e.g., audio not available).
      try {
        await play();
      } catch (error) {
        console.warn("useAudio: Error in toggle (during play attempt):", error);
      }
    }
  }, [isPlaying, pause, play]);

  // Return the audio element itself, and the new isReady state
  return { audio, play, pause, stop, toggle, isPlaying, isReady };
}