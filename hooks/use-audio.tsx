"use client"

import { useState, useEffect, useCallback } from "react"

interface AudioOptions {
  volume?: number
  loop?: boolean
  autoplay?: boolean
}

export function useAudio(src: string, options: AudioOptions = {}) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Only create audio element in browser environment
    if (typeof window !== "undefined") {
      const audioElement = new Audio()

      // Set properties before setting src to avoid issues
      if (options.volume !== undefined) {
        audioElement.volume = options.volume
      }

      if (options.loop !== undefined) {
        audioElement.loop = options.loop
      }

      // Add error handler
      const handleError = (e: ErrorEvent) => {
        console.warn("Audio error:", e)
      }

      audioElement.addEventListener("error", handleError as EventListener)

      // Set source last
      audioElement.src = src

      setAudio(audioElement)

      return () => {
        audioElement.pause()
        audioElement.removeEventListener("error", handleError as EventListener)
        audioElement.src = ""
      }
    }

    return undefined
  }, [src, options.volume, options.loop])

  useEffect(() => {
    if (audio && options.autoplay) {
      play()
    }
  }, [audio, options.autoplay])

  const play = useCallback(() => {
    if (audio) {
      // Create user interaction promise
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.warn("Error playing audio:", error)
            // Don't update state on error
          })
      }
    }
  }, [audio])

  const pause = useCallback(() => {
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }, [audio])

  const stop = useCallback(() => {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }, [audio])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  return { play, pause, stop, toggle, isPlaying }
}
