import Link from "next/link"
import { siteConfig } from "@/lib/portfolio-data"

const navigation = [
  { label: "Work", href: "/work", key: "work" },
  { label: "About", href: "/about", key: "about" },
  { label: "Contact", href: "/contact", key: "contact" },
] as const

export default function Header({ active, home = false }: { active?: "work" | "about" | "contact"; home?: boolean }) {
  return <header className={`site-header${home ? " site-header-home" : ""}`}>
    <div className={`section-shell header-inner${home ? " header-inner-home" : ""}`}>
      <Link className="wordmark" href="/" aria-label={`${siteConfig.name}, home`}>za<span>.</span></Link>
      {!home && <nav className="header-links" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined}>{item.label}</Link>)}
      </nav>}
    </div>
  </header>
}
