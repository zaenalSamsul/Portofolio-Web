import { siteConfig } from "@/lib/portfolio-data"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <p><strong>{siteConfig.name}</strong> — {siteConfig.role}</p>
        <p>© {new Date().getFullYear()} Built around data, models, and useful products.</p>
      </div>
    </footer>
  )
}
