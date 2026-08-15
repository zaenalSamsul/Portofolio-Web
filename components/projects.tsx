import { projects } from "@/lib/portfolio-data"
import FeaturedProject from "./featured-project"
import ProjectCard from "./project-card"
import Reveal from "./reveal"
import SectionHeading from "./section-heading"

export default function Projects() {
  const featured = projects.filter((project) => project.featured)
  const moreProjects = projects.filter((project) => !project.featured)

  return (
    <section id="projects" className="section section-projects">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="03 / SELECTED WORK"
            title="Featured Projects"
            description="Selected projects where I turn data and AI models into working products."
          />
        </Reveal>

        <div className="featured-list">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <FeaturedProject project={project} index={index} />
            </Reveal>
          ))}
        </div>

        {moreProjects.length ? (
          <div className="more-projects">
            <Reveal><h3 className="more-projects-title">More Projects</h3></Reveal>
            <div className="more-projects-grid">
              {moreProjects.map((project, index) => (
                <Reveal key={project.slug} delay={index * 90}><ProjectCard project={project} /></Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
