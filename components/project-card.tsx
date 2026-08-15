import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import TechBadge from "./tech-badge"

export default function ProjectCard({ project }: { project: Project }) {
  const githubLink = project.links.find((link) => link.kind === "github")

  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} className="project-card-media">
        <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 767px) 100vw, 50vw" />
      </Link>
      <div className="project-card-body">
        <p className="project-category">{project.category}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="badge-list">{project.tech.slice(0, 4).map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}</div>
        <div className="project-actions">
          <Link href={`/projects/${project.slug}`} className="text-link">Case study <ArrowUpRight size={17} /></Link>
          {githubLink ? <a href={githubLink.href} target="_blank" rel="noreferrer" className="icon-link"><Github size={16} /> GitHub</a> : null}
        </div>
      </div>
    </article>
  )
}
