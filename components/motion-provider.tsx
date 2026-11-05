"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const MotionContext = createContext({ allowMotion: false, reducedMotion: true })

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(true)
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setReducedMotion(preference.matches)
      document.documentElement.dataset.motion = preference.matches ? "static" : "active"
    }
    sync()
    preference.addEventListener("change", sync)
    return () => preference.removeEventListener("change", sync)
  }, [])
  return <MotionContext.Provider value={{ allowMotion: !reducedMotion, reducedMotion }}>{children}</MotionContext.Provider>
}

export function useMotionPolicy() { return useContext(MotionContext) }
