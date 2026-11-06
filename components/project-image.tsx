"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ProjectMedia } from "@/lib/portfolio-data"

export default function ProjectImage({ media, primary = false }: { media: ProjectMedia; primary?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  return <>
    <a
      href={media.src}
      target="_blank"
      rel="noopener noreferrer"
      className="project-image-trigger"
      aria-label={`View full-size image: ${media.alt}`}
      aria-haspopup="dialog"
      onClick={(event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
        if (!dialogRef.current) return
        event.preventDefault()
        dialogRef.current.showModal()
        setOpen(true)
      }}
    >
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        priority={primary}
        className="case-media-content"
        style={{ width: `min(100%, ${media.width}px)` }}
        unoptimized
      />
    </a>
    <dialog
      ref={dialogRef}
      className="project-image-dialog"
      aria-label={`Full-size image: ${media.alt}`}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close()
      }}
    >
      <button type="button" className="project-image-close" aria-label="Close full-size image" onClick={() => dialogRef.current?.close()}>
        <X size={26} aria-hidden="true" />
      </button>
      {open ? <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        className="project-image-full"
        unoptimized
      /> : null}
    </dialog>
  </>
}
