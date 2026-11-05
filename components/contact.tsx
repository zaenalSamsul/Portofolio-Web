import Image from "next/image"
import Link from "next/link"
import { contactProfile, siteConfig } from "@/lib/portfolio-data"

export default function Contact({ headingLevel = 1 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2"

  return (
    <section id="contact" className="contact-page" aria-labelledby="contact-title">
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
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub</a>
              <Link href="/cv">Read my CV</Link>
            </nav>
          </div>
        </div>
        <figure className="contact-photo">
          <Image
            src={contactProfile.photo.src}
            alt={contactProfile.photo.alt}
            width={contactProfile.photo.width}
            height={contactProfile.photo.height}
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 280px, 360px"
            className="contact-photo-image"
            priority
          />
          <figcaption>{contactProfile.photo.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
