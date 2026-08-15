import { experiences } from "@/lib/portfolio-data"
import Reveal from "./reveal"
import SectionHeading from "./section-heading"
import TechBadge from "./tech-badge"

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-shell">
        <Reveal>
          <SectionHeading eyebrow="02 / EXPERIENCE" title="Building across data, models, and applications." />
        </Reveal>
        <div className="timeline">
          {experiences.map((experience, index) => (
            <Reveal key={`${experience.company}-${experience.role}`} delay={index * 100} className="timeline-row">
              <div className="timeline-marker"><span>0{index + 1}</span></div>
              <div className="timeline-date">{experience.period}</div>
              <article className="experience-card">
                <div className="experience-heading">
                  <div><p>{experience.company}</p><h3>{experience.role}</h3></div>
                  <p className="experience-summary">{experience.summary}</p>
                </div>
                <ul>
                  {experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <div className="badge-list">
                  {experience.tech.map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
