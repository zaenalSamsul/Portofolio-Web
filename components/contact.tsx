import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { siteConfig } from "@/lib/portfolio-data"
import Reveal from "./reveal"

export default function Contact() {
  const emailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Portfolio inquiry")}`

  return (
    <section id="contact" className="section contact-section">
      <div className="section-shell">
        <Reveal className="contact-panel">
          <p className="eyebrow">05 / CONTACT</p>
          <div className="contact-layout">
            <div className="contact-copy">
              <h2>Have an idea worth building?</h2>
              <p>I&apos;m open to opportunities in AI Engineering, Data Science, Machine Learning, and applied AI.</p>
            </div>
            <a className="contact-email" href={emailHref} aria-label={`Send an email to ${siteConfig.email}`}>
              <span>LET&apos;S TALK</span>
              <div>
                <strong>{siteConfig.email}</strong>
                <ArrowUpRight size={24} aria-hidden="true" />
              </div>
            </a>
          </div>
          <div className="contact-links">
            <a href={siteConfig.github} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
            <a href={emailHref}><Mail size={18} /> Email</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
