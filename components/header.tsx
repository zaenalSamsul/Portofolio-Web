"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Github, Linkedin, Menu, X } from "lucide-react"
import { siteConfig } from "@/lib/portfolio-data"

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
          <span>ZA</span>
          <span className="wordmark-dot" aria-hidden="true" />
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
          <a className="resume-link" href={siteConfig.resume} download>
            <FileText size={16} aria-hidden="true" /> Resume
          </a>
          <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="Open Zaenal's GitHub profile">
            <Github size={18} aria-hidden="true" />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="Open Zaenal's LinkedIn profile">
            <Linkedin size={18} aria-hidden="true" />
          </a>
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
        <a href={siteConfig.resume} download onClick={() => setIsOpen(false)}>
          <span>07</span>
          Resume <FileText size={16} aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}
