"use client"

import { useEffect, useRef } from "react"
import type { ProjectMedia } from "@/lib/portfolio-data"

type ProjectVideoProps = {
  media: ProjectMedia
  poster?: string
}

export default function ProjectVideo({ media, poster }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || media.kind !== "video") return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    let visible = false
    let disposed = false

    const updatePlayback = () => {
      if (disposed) return
      if (!visible || document.hidden || reducedMotion.matches || connection?.saveData) {
        video.pause()
        return
      }
      // Browsers may reject autoplay; the native controls remain available.
      void video.play().catch(() => {})
    }

    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2
      updatePlayback()
    }, { threshold: [0, 0.2] })

    observer?.observe(video)
    reducedMotion.addEventListener("change", updatePlayback)
    document.addEventListener("visibilitychange", updatePlayback)

    return () => {
      disposed = true
      observer?.disconnect()
      reducedMotion.removeEventListener("change", updatePlayback)
      document.removeEventListener("visibilitychange", updatePlayback)
      video.pause()
    }
  }, [media.kind, media.src])

  if (media.kind !== "video") return null

  return <video
    ref={videoRef}
    className="project-visual-video"
    src={media.src}
    poster={poster ?? media.poster?.src}
    width={media.width}
    height={media.height}
    aria-label={media.alt}
    controls
    muted
    loop
    playsInline
    preload="metadata"
  >
    Your browser does not support this video. <a href={media.src}>Download the project preview (MP4)</a>.
  </video>
}
