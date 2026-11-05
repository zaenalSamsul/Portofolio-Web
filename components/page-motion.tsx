"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useMotionPolicy } from "./motion-provider"

const entrySelector = [
  ".home-profile > *",
  ".home-navigation > a",
  ".page-heading > *",
  ".contact-intro > *",
  ".message-heading > *",
  ".case-header > *",
].join(",")

const scrollSelector = ".project-article, .work-closing, .editorial-section-heading"

function milliseconds(value: string, fallback: number) {
  const duration = parseFloat(value)
  return Number.isFinite(duration) ? duration * (value.trim().endsWith("ms") ? 1 : 1000) : fallback
}

export default function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const curtain = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { allowMotion } = useMotionPolicy()

  useEffect(() => {
    const scope = root.current
    const screen = curtain.current
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    if (!scope || !allowMotion || preference.matches || typeof scope.animate !== "function") return

    const tokens = getComputedStyle(document.documentElement)
    const duration = Math.max(0, Math.min(800, milliseconds(tokens.getPropertyValue("--duration-page"), 750)))
    const stagger = Math.max(0, Math.min(90, milliseconds(tokens.getPropertyValue("--duration-stagger"), 90)))
    const easing = tokens.getPropertyValue("--ease-out").trim() || "cubic-bezier(0.23, 1, 0.32, 1)"
    const entryEasing = tokens.getPropertyValue("--ease-page").trim() || tokens.getPropertyValue("--ease-in-out").trim() || easing
    const screenDuration = Math.max(0, Math.min(1000, milliseconds(tokens.getPropertyValue("--duration-screen"), 900)))
    const screenEasing = tokens.getPropertyValue("--ease-screen").trim() || "cubic-bezier(0.43, 0.14, 0.31, 1.03)"
    const animations = new Map<HTMLElement, Animation>()
    const waiting = new Set<HTMLElement>()
    let observer: IntersectionObserver | undefined
    let stopped = false
    let frame = 0

    const stop = () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      waiting.clear()
      for (const animation of animations.values()) {
        animation.onfinish = null
        animation.oncancel = null
        animation.cancel()
      }
      animations.clear()
    }

    const trackAnimation = (element: HTMLElement, animation: Animation) => {
      animations.set(element, animation)
      // Release the effect rather than retaining a transform or clipping a focus ring.
      animation.onfinish = () => {
        animations.delete(element)
        animation.cancel()
      }
      animation.oncancel = () => { animations.delete(element) }
    }

    const animate = (element: HTMLElement, index = 0, text = false, startDelay = 0) => {
      if (stopped || preference.matches || !element.isConnected || element.contains(document.activeElement) || duration === 0) return
      const delay = startDelay + Math.min(index, 3) * stagger
      const distance = element.matches(".home-navigation > a") ? 36 : 28
      // Preserve the stagger at both ends, instead of making later items rush to finish together.
      const elementDuration = duration * (text ? 0.8 : 0.65)
      const animation = element.animate([
        { opacity: 0, transform: `translate3d(0, ${distance}px, 0)`, clipPath: text ? "inset(0 0 100% 0)" : "inset(0 0 6% 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)" },
      ], { duration: elementDuration, delay, easing: text ? entryEasing : easing, fill: "both" })
      trackAnimation(element, animation)
    }

    const onPreferenceChange = () => { if (preference.matches) stop() }
    const onFocus = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      for (const [element, animation] of animations) {
        if (element === screen || element.contains(target)) animation.cancel()
      }
      for (const element of waiting) {
        if (element.contains(target)) {
          waiting.delete(element)
          observer?.unobserve(element)
        }
      }
    }

    preference.addEventListener("change", onPreferenceChange)
    scope.addEventListener("focusin", onFocus)

    frame = requestAnimationFrame(() => {
      if (stopped || preference.matches) return
      let appearanceDelay = 0
      if (screen && screenDuration > 0 && !scope.contains(document.activeElement)) {
        trackAnimation(screen, screen.animate([
          { transform: "scaleY(1)" },
          { transform: "scaleY(0)" },
        ], { duration: screenDuration, easing: screenEasing, fill: "both" }))
        appearanceDelay = pathname === "/" ? 350 : 200
      }
      const entries = Array.from(scope.querySelectorAll<HTMLElement>(entrySelector))
      const candidates = [...entries, ...scope.querySelectorAll<HTMLElement>(scrollSelector)]
      // An outer target owns the reveal; descendants keep their own hover transforms.
      const targets = candidates.filter((element, index) => candidates.indexOf(element) === index && !candidates.some((other) => other !== element && other.contains(element)))
      const siblingOrder = new Map<Element | null, number>()
      const viewportHeight = window.innerHeight

      for (const element of targets) {
        const bounds = element.getBoundingClientRect()
        if (bounds.height === 0 || bounds.bottom <= 0) continue
        if (bounds.top < viewportHeight) {
          const index = siblingOrder.get(element.parentElement) ?? 0
          siblingOrder.set(element.parentElement, index + 1)
          const text = entries.includes(element)
          animate(element, index, text, text ? appearanceDelay : 0)
        } else {
          waiting.add(element)
        }
      }

      if (!waiting.size || typeof IntersectionObserver === "undefined") return
      observer = new IntersectionObserver((observations) => {
        let index = 0
        for (const observation of observations) {
          if (!observation.isIntersecting) continue
          const element = observation.target as HTMLElement
          observer?.unobserve(element)
          waiting.delete(element)
          animate(element, index++, entries.includes(element))
        }
      }, { rootMargin: "0px 0px 60px 0px", threshold: 0.08 })
      for (const element of waiting) observer.observe(element)
    })

    return () => {
      stop()
      preference.removeEventListener("change", onPreferenceChange)
      scope.removeEventListener("focusin", onFocus)
    }
  }, [allowMotion, pathname])

  return <div ref={root} className="page-transition"><div ref={curtain} className="page-curtain" data-direction={pathname === "/" ? "down" : "up"} data-tone={pathname === "/contact" ? "light" : "dark"} aria-hidden="true" />{children}</div>
}
