import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Github, Play } from "lucide-react"
import type { Project } from "@/lib/portfolio-data"
import TechBadge from "./tech-badge"

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="case-section">
      <p className="case-section-index">/ {title.toUpperCase()}</p>
      <div>{children}</div>
    </section>
  )
}

export default function CaseStudy({ project }: { project: Project }) {
  return (
    <main className="case-page">
      <div className="section-shell">
        <Link href="/#projects" className="back-link"><ArrowLeft size={17} /> Back to projects</Link>
        <header className="case-hero">
          <p className="project-category">{project.category}</p>
          <h1>{project.name}</h1>
          <p className="case-intro">{project.description}</p>
          <div className="case-meta">
            {project.role ? <div><span>Role</span><strong>{project.role}</strong></div> : null}
            {project.timeline ? <div><span>Timeline</span><strong>{project.timeline}</strong></div> : null}
            <div><span>Category</span><strong>{project.category}</strong></div>
          </div>
        </header>

        <div className="case-image">
          <Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" />
          {project.metric ? <div className="case-metric"><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div> : null}
        </div>

        <div className="case-body">
          <DetailSection title="The Problem"><p className="case-large-copy">{project.problem}</p></DetailSection>
          <DetailSection title="The Approach"><p className="case-large-copy">{project.approach}</p></DetailSection>
          <DetailSection title="Architecture / Workflow">
            <ol className="workflow">
              {project.workflow.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}
            </ol>
          </DetailSection>
          <DetailSection title="What I Built"><ul className="case-list">{project.built.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>
          <DetailSection title="Technical Challenges"><ul className="case-list">{project.challenges.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>
          <DetailSection title="Results"><ul className="case-list">{project.results.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>
          <DetailSection title="Key Learnings"><ul className="case-list">{project.learnings.map((item) => <li key={item}>{item}</li>)}</ul></DetailSection>
          <DetailSection title="Tech Stack"><div className="badge-list">{project.tech.map((tech) => <TechBadge key={tech}>{tech}</TechBadge>)}</div></DetailSection>
          {project.links.length ? (
            <DetailSection title="Links">
              <div className="case-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="button button-secondary">
                    {link.kind === "github" ? <Github size={18} /> : <Play size={18} />}{link.label}<ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </DetailSection>
          ) : null}
        </div>
      </div>
    </main>
  )
}
