import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import { siteConfig } from "@/lib/portfolio-data"

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.website,
    jobTitle: siteConfig.role,
    email: `mailto:${siteConfig.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Garut", addressCountry: "ID" },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    knowsAbout: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Data Engineering", "LLM Integration"],
  }

  return (
    <>
      <Header home />
      <main id="main-content" tabIndex={-1} className="home-main">
        <Hero />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
