import Link from "next/link"
import { siteConfig } from "@/lib/portfolio-data"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <div className="footer-signature"><Link href="/" className="footer-wordmark" aria-label={`${siteConfig.name}, home`}>Zaenal Arief.</Link><span>© {new Date().getFullYear()}</span></div>
        <p className="footer-location">{siteConfig.location}</p>
        <nav className="footer-links" aria-label="Professional profiles">
          <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </div>
    </footer>
  )
}
