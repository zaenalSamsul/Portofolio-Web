import type { Experience } from "@/lib/portfolio-data"

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="experience-list">
      {experiences.map((experience) => (
        <article key={experience.id} id={`experience-entry-${experience.id}`} className="experience-entry" aria-labelledby={`experience-role-${experience.id}`}>
          <p className="entry-date experience-date">{experience.period}</p>
          <div className="experience-details">
            <header>
              <p className="experience-company">{experience.company}</p>
              <h3 id={`experience-role-${experience.id}`}><strong className="role-highlight">{experience.role}</strong></h3>
              <p className="experience-summary">{experience.summary}</p>
            </header>
            <ul className="experience-highlights">{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            <p className="experience-tools">Tools: {experience.tech.join(", ")}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
