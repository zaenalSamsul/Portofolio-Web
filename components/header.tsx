"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 16)
    updateScroll()
    window.addEventListener("scroll", updateScroll, { passive: true })

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: "-20% 0px -65%", threshold: [0.01, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener("scroll", updateScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link href="/#home" className="wordmark" aria-label="Zaenal Syamsyul Arief, home">
          <Image src="/za-logo.png" alt="" width={44} height={44} priority className="wordmark-logo" />
        </Link>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/${item.href}`}
              className={activeSection === item.id ? "active" : ""}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={`mobile-nav ${isOpen ? "is-open" : ""}`}>
        {navItems.map((item, index) => (
          <Link key={item.id} href={`/${item.href}`} onClick={() => setIsOpen(false)}>
            <span>0{index + 1}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
