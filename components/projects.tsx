import { ArrowUpRight, Github } from "lucide-react"
import { projects, repositories, siteConfig } from "@/lib/portfolio-data"
import FeaturedProject from "./featured-project"
import Reveal from "./reveal"
import SectionHeading from "./section-heading"

export default function Projects() {
  const featured = projects.filter((project) => project.featured)

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

        <div className="repository-index">
          <Reveal className="repository-heading">
            <div>
              <p className="eyebrow">FULL GITHUB INDEX</p>
              <h3>More experiments, builds, and studies.</h3>
            </div>
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub profile <ArrowUpRight size={16} />
            </a>
          </Reveal>
          <div className="repository-list">
            {repositories.map((repository, index) => (
              <Reveal key={repository.name} delay={(index % 4) * 45}>
                <a className="repository-row" href={repository.href} target="_blank" rel="noreferrer">
                  <span className="repository-number">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{repository.name}</strong>
                  <span className="repository-topic">{repository.topic}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
