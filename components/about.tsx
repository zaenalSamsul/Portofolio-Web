import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { aboutProfile, achievements, education, siteConfig, training } from "@/lib/portfolio-data"

export default function About({ children }: { children?: React.ReactNode }) {
  return (
    <section id="about" className="about-page section-shell" aria-labelledby="about-title">
      <header className="page-heading about-heading">
        <p className="page-label">About</p>
        <h1 id="about-title">Grounded in data.<br /><em>Driven by curiosity.</em></h1>
      </header>

      <div className="about-profile-grid">
        <figure className="about-profile">
          <Image
            src={siteConfig.photo}
            alt="Zaenal Syamsyul Arief wearing a black suit and glasses"
            width={1254}
            height={1254}
            sizes="(max-width: 767px) 90vw, (max-width: 1100px) 40vw, 440px"
            className="about-portrait-image"
            priority
          />
          <figcaption className="about-profile-caption"><span>{siteConfig.name}</span><strong className="role-highlight">{siteConfig.role}</strong></figcaption>
        </figure>
        <div className="about-copy">
          <p className="about-lead">{aboutProfile.lead}</p>
          {aboutProfile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph.split(/(freelance Data & AI Engineer)/i).map((part, index) => /^freelance Data & AI Engineer$/i.test(part) ? <strong key={index} className="role-highlight">{part}</strong> : part)}</p>)}
        </div>
      </div>

      {children}

      <section className="about-education" aria-labelledby="education-title">
        <h2 id="education-title">Education &amp; continued learning.</h2>
        <div className="about-education-grid">
          <article className="education-entry">
            <p className="entry-date">{education.period}</p>
            <h3>{education.institution}</h3>
            <p>{education.degree}</p>
            <p>GPA {education.gpa}</p>
          </article>
          {training.map((item) => (
            <article className="education-entry" key={item.title}>
              <p className="entry-date">{item.period}</p>
              <h3>{item.title}</h3>
              <p>{item.provider}</p>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-certifications" aria-labelledby="certifications-title">
        <h2 id="certifications-title">Selected certifications.</h2>
        <ul className="certification-list">
          {achievements.map((item) => (
            <li key={item.title}>
              <p className="entry-date">{item.date}</p>
              <div>
                <h3>{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.title}</a> : item.title}</h3>
                <p className="certification-provider">{item.provider}</p>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <a className="editorial-link certificates-link" href={siteConfig.certificates} target="_blank" rel="noopener noreferrer">
          View all certificates <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>
    </section>
  )
}
