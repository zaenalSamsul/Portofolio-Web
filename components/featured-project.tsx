import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import ProjectVideo from "./project-video"

export default function FeaturedProject({ project, index, total }: { project: Project; index: number; total: number }) {
  const status = { "in-progress": "In progress", completed: "Completed", prototype: "Prototype" }[project.status]
  const screenshot = project.slug === "data-pipeline-sentiment-analysis" ? project.gallery?.[0] : undefined
  const cover = screenshot ?? (project.media.kind === "video" ? project.media.poster! : project.media)
  return <article id={`work-${project.slug}`} className={`project-article project-${project.slug}`}>
    {project.media.kind === "video" ? (
      <div className="project-visual">
        <ProjectVideo media={project.media} poster={project.gallery?.[0]?.src} />
      </div>
    ) : <Link className="project-visual-link" href={`/projects/${project.slug}`} aria-label={`Explore ${project.name} case study`}>
      <div className="project-visual">
        <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 102px) / 2), (max-width: 1440px) calc((100vw - 156px) / 2), 642px" className="project-visual-image" unoptimized={cover.src.endsWith(".svg")} />
      </div>
    </Link>}
    <div className="project-caption"><p><span className="project-index">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>{project.category}</p><span>{status}</span></div>
    <h2><Link href={`/projects/${project.slug}`}>{project.shortName}</Link></h2>
    <p className="project-description">{project.description}</p>
    <p className="project-tech">{project.tech.slice(0, 3).join(" / ")}</p>
    <Link className="editorial-link" href={`/projects/${project.slug}`}>View case study <ArrowUpRight size={17} aria-hidden="true" /></Link>
  </article>
}
