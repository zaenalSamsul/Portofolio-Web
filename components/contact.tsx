import Image from "next/image"
import Link from "next/link"
import { FileUser, Github, Linkedin } from "lucide-react"
import { contactProfile, siteConfig } from "@/lib/portfolio-data"

export default function Contact({ headingLevel = 1 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2"

  return (
    <section id="contact" className="contact-page" aria-labelledby="contact-title">
      <figure className="contact-photo">
        <Image
          src={contactProfile.photo.src}
          alt={contactProfile.photo.alt}
          fill
          sizes="(max-width: 600px) 100vw, 72vw"
          className="contact-photo-image"
          preload
        />
        <figcaption>{contactProfile.photo.caption}</figcaption>
      </figure>
      <div className="section-shell contact-layout">
        <div className="contact-copy">
          <header className="contact-intro">
            <p className="page-label">Contact</p>
            <Heading id="contact-title" className="contact-title">Let&apos;s <em>talk.</em></Heading>
            <p className="contact-description">{contactProfile.description}</p>
          </header>
          <div className="contact-details">
            <div className="contact-email-block">
              <Link className="contact-email" href="/contact/message" aria-label={`Send a message to ${siteConfig.email}`}><span className="contact-email-address">{siteConfig.email}</span></Link>
            </div>
            <nav className="contact-links" aria-label="Professional profiles and CV">
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin aria-hidden="true" /></a>
              <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github aria-hidden="true" /></a>
              <Link href="/cv" aria-label="Read my CV" title="Read my CV"><FileUser aria-hidden="true" /></Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
