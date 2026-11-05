import Link from "next/link"
import { publishedProjects, skillGroups } from "@/lib/portfolio-data"

export default function Skills() {
  return (
    <section id="skills" className="section editorial-skills" aria-labelledby="skills-title">
      <div className="section-shell">
        <header className="editorial-section-heading">
          <h2 id="skills-title">Tools, in context.</h2>
          <p>A practical toolkit for preparing data, developing models, and bringing AI into applications.</p>
        </header>
        <div className="skill-list">
          {skillGroups.map((group) => {
            const relatedProjects = group.relatedProjectSlugs.flatMap((slug) => {
              const project = publishedProjects.find((item) => item.slug === slug)
              return project ? [project] : []
            })
            return (
              <article key={group.title} className="skill-entry">
                <h3>{group.title}</h3>
                <div className="skill-details">
                  <p className="skill-tools">{group.skills.join(", ")}</p>
                  {relatedProjects.length ? (
                    <ul className="skill-evidence-links" aria-label={`${group.title} project examples`}>
                      {relatedProjects.map((project) => <li key={project.slug}><Link href={`/projects/${project.slug}`}>{project.shortName}</Link></li>)}
                    </ul>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
