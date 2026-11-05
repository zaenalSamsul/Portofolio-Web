import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/lib/portfolio-data"
import SweepText from "./sweep-text"

const sections = [
  { id: "work", label: "Work", note: "Selected projects" },
  { id: "about", label: "About", note: "The person & the practice" },
  { id: "contact", label: "Contact", note: "Start a conversation" },
] as const

export default function Hero() {
  return <section id="home" className="home-intro section-shell" aria-labelledby="hero-title">
    <div className="home-profile">
      <p className="home-name">{siteConfig.name}</p>
      <h1 id="hero-title">Data &amp; AI<br /><strong className="role-highlight"><em>Engineer.</em></strong></h1>
      <p className="home-description">I turn complex data into useful systems — from pipelines and models to intelligent applications.</p>
    </div>
    <nav className="home-navigation" aria-label="Explore the portfolio">
      {sections.map((section) => (
        <Link id={section.id} href={`/${section.id}`} key={section.id}>
          <span className="home-nav-display">
            <SweepText text={section.label} className="home-nav-word" />
            <ArrowUpRight aria-hidden="true" />
          </span>
          <span className="home-nav-note">{section.note}</span>
        </Link>
      ))}
    </nav>
    <p className="home-footnote">Data. Models. <em>Possibilities.</em></p>
    <span id="projects" className="legacy-anchor" aria-hidden="true" />
    <span id="experience" className="legacy-anchor" aria-hidden="true" />
    <span id="skills" className="legacy-anchor" aria-hidden="true" />
  </section>
}
