import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import {
  getProjectEvidence,
  publishedProjects,
  type EvidenceSource,
  type Project,
  type ProjectMedia,
} from "@/lib/portfolio-data"

function DetailSection({
  title,
  children,
  id,
}: {
  title: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section id={id} className="case-section">
      <h2>{title}</h2>
      <div className="case-section-content">{children}</div>
    </section>
  )
}

function SourceReference({ source, className }: { source: EvidenceSource; className: string }) {
  const href = source.href ?? source.localRef

  return href ? (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {source.label}<ArrowUpRight size={15} aria-hidden="true" />
    </a>
  ) : <span className={className}>{source.label}</span>
}

function ProjectMediaFigure({
  media,
  caption,
  source,
  projectSlug,
  primary = false,
}: {
  media: ProjectMedia
  caption?: string
  source?: EvidenceSource
  projectSlug: string
  primary?: boolean
}) {
  return (
    <figure className={primary ? "case-cover" : "case-gallery-item"}>
      <div className={`case-media case-media-${media.kind} case-media-${projectSlug}`}>
        {media.kind === "video" ? (
          <video
            className="case-media-content"
            width={media.width}
            height={media.height}
            controls
            muted
            playsInline
            preload="metadata"
            poster={media.poster?.src}
            aria-label={media.alt}
          >
            <source src={media.src} type="video/mp4" />
            Your browser does not support video. <a href={media.src}>Open the project video</a>.
          </video>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            priority={primary}
            sizes={primary ? "(max-width: 767px) 100vw, 1120px" : "(max-width: 767px) 100vw, 600px"}
            className="case-media-content"
            unoptimized={media.src.endsWith(".svg")}
          />
        )}
      </div>
      <figcaption className="case-media-caption">
        <p>{caption ?? media.alt}</p>
        {source ? <SourceReference source={source} className="case-media-source" /> : null}
      </figcaption>
    </figure>
  )
}

export default function CaseStudy({ project }: { project: Project }) {
  const evidence = getProjectEvidence(project)
  const gallery = project.gallery ?? []
  const status = { "in-progress": "In progress", completed: "Completed", prototype: "Prototype" }[project.status]
  const hasDocumentedRole = project.role.trim().toLowerCase() !== "not specified"
  const currentIndex = publishedProjects.findIndex((item) => item.slug === project.slug)
  const nextProject = currentIndex >= 0 && publishedProjects.length > 1
    ? publishedProjects[(currentIndex + 1) % publishedProjects.length]
    : undefined

  return (
    <main id="main-content" tabIndex={-1} className="case-page case-editorial">
      <div className="section-shell case-shell">
        <Link href="/work" className="case-back">
          <ArrowLeft size={18} aria-hidden="true" /> All work
        </Link>

        <header className="case-header">
          <p className="case-category">{project.category}</p>
          <h1>{project.name}</h1>
          <p className="case-summary">{project.description}</p>
          <dl className="case-meta">
            <div><dt>{hasDocumentedRole ? "Role" : "Contribution"}</dt><dd>{hasDocumentedRole ? <strong className="role-highlight">{project.role}</strong> : <a href="#case-contribution">Implementation &amp; scope</a>}</dd></div>
            <div><dt>Period</dt><dd>{project.period.label}</dd></div>
            <div><dt>Status</dt><dd>{status}</dd></div>
          </dl>
        </header>

        <ProjectMediaFigure media={project.media} projectSlug={project.slug} primary />

        <div className="case-story">
          <DetailSection title="The problem" id="case-problem">
            <p className="case-lead">{project.problem}</p>
          </DetailSection>

          <DetailSection title="Contribution & scope" id="case-contribution">
            <p className="case-role-summary">
              {hasDocumentedRole
                ? <>Documented role: <strong className="role-highlight">{project.role}</strong>.</>
                : "An individual role is not specified in the available project material."}
            </p>
            <h3 className="case-subheading">Project implementation</h3>
            <ul className="case-list">{project.built.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailSection>

          <DetailSection title="The approach" id="case-approach">
            <p className="case-lead">{project.approach}</p>
            <h3 className="case-subheading">Architecture & workflow</h3>
            <ol className="case-workflow" aria-label={`${project.name} workflow`}>
              {project.workflow.map((step, index) => (
                <li key={step}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
            <h3 className="case-subheading">Technical challenges</h3>
            <ul className="case-list">{project.challenges.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailSection>

          {gallery.length ? (
            <DetailSection title="Project views" id="case-gallery">
              <div className="case-gallery" aria-label={`${project.name} supporting project images`}>
                {gallery.map((item) => (
                  <ProjectMediaFigure
                    key={item.src}
                    media={item}
                    caption={item.caption}
                    source={item.source}
                    projectSlug={project.slug}
                  />
                ))}
              </div>
            </DetailSection>
          ) : null}

          <DetailSection title="Outcomes" id="case-outcomes">
            <ul className="case-list">{project.results.map((item) => <li key={item}>{item}</li>)}</ul>
            {evidence.length ? (
              <div className="case-evidence">
                <h3 className="case-subheading">Evidence & context</h3>
                <ul className="case-evidence-list">
                  {evidence.map((item) => (
                    <li key={item.id} className="case-evidence-item">
                      <p className="case-evidence-claim">{item.claim}</p>
                      <p className="case-evidence-context">{item.context}</p>
                      <SourceReference source={item.source} className="case-evidence-source" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </DetailSection>

          <DetailSection title="Scope & limitations" id="case-limitations">
            <ul className="case-list">{project.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailSection>

          <DetailSection title="What I learned" id="case-learnings">
            <ul className="case-list">{project.learnings.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailSection>

          <DetailSection title="Built with" id="case-stack">
            <ul className="case-stack" aria-label="Technologies used">
              {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </DetailSection>

          {project.links.length ? (
            <DetailSection title="Explore the project" id="case-links">
              <div className="case-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="case-link">
                    {link.label}<ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </DetailSection>
          ) : null}
        </div>

        {nextProject ? (
          <nav className="case-next" aria-label="More project case studies">
            <Link href={`/projects/${nextProject.slug}`} className="case-next-link">
              <span className="case-next-label">Next project</span>
              <h2>{nextProject.name}</h2>
              <span className="case-next-category">{nextProject.category}</span>
              <ArrowUpRight size={36} aria-hidden="true" />
            </Link>
            <Link href="/work" className="case-back">View all work</Link>
          </nav>
        ) : null}
      </div>
    </main>
  )
}
