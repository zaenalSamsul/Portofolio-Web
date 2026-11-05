"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function LegacyAnchors() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (pathname !== "/") return
    const migrate = () => {
      const hash = window.location.hash.slice(1)
      const target = hash === "work" || hash === "projects" ? "/work" : hash.startsWith("work-") ? `/work#${hash}` : hash === "about" ? "/about" : hash === "experience" || hash === "skills" ? `/about#${hash}` : hash === "contact" ? "/contact" : null
      if (target) router.replace(target)
    }
    migrate()
    window.addEventListener("hashchange", migrate)
    return () => window.removeEventListener("hashchange", migrate)
  }, [pathname, router])
  return null
}
