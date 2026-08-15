import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  )
}
