import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Play } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import TechBadge from "./tech-badge"

export default function FeaturedProject({ project, index }: { project: Project; index: number }) {
  return (
    <article className="featured-project">
      <Link href={`/projects/${project.slug}`} className="project-media" aria-label={`Read ${project.name} case study`}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 899px) 100vw, 54vw"
          className="project-image"
        />
        <span className="project-index">0{index + 1}</span>
        {project.metric ? (
          <div className="metric-card"><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div>
        ) : null}
      </Link>

      <div className="project-content">
        <p className="project-category">{project.category}</p>
        <h3><Link href={`/projects/${project.slug}`}>{project.name}</Link></h3>
        <p className="project-description">{project.description}</p>
        <dl className="project-brief">
          <div><dt>Problem</dt><dd>{project.problem}</dd></div>
          <div><dt>Solution</dt><dd>{project.approach}</dd></div>
        </dl>
        <div className="badge-list">
          {project.tech.slice(0, 6).map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}
        </div>
        <div className="project-actions">
          <Link href={`/projects/${project.slug}`} className="text-link">Case study <ArrowUpRight size={17} /></Link>
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="icon-link">
              {link.kind === "github" ? <Github size={16} /> : <Play size={16} />}{link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
