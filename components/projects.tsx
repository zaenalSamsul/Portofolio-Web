import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { featuredProjects, publishedProjects, repositories, siteConfig } from "@/lib/portfolio-data"
import FeaturedProject from "./featured-project"
import SweepText from "./sweep-text"

export default function Projects() {
  return <section id="work" className="work-page section-shell" aria-labelledby="work-title">
    <header className="page-heading work-heading">
      <div><p className="page-label">{String(featuredProjects.length).padStart(2, "0")} selected projects</p><h1 id="work-title">Work<span>.</span></h1></div>
      <p className="page-intro">An exploration of data, machine learning, and the systems that make them useful. A closer look at the problems, process, and work behind each project.</p>
    </header>
    <div className="work-grid">{featuredProjects.map((project, index) => <FeaturedProject key={project.slug} project={project} index={index} total={featuredProjects.length} />)}</div>
    <section className="work-archive" aria-labelledby="archive-title">
      <div className="archive-intro"><h2 id="archive-title">From the archive.</h2><p>More experiments, tools, and technical explorations.</p></div>
      <div className="archive-list">
        {publishedProjects.filter((project) => !project.featured).map((project) => <Link className="archive-item" href={`/projects/${project.slug}`} key={project.slug}><span>{project.shortName}</span><span>{project.category}</span><ArrowUpRight size={23} aria-hidden="true" /></Link>)}
        {repositories.filter((repository) => !publishedProjects.some((project) => project.links.some((link) => link.href === repository.href))).map((repository) => <a className="archive-item" key={repository.href} href={repository.href} target="_blank" rel="noreferrer"><span>{repository.name}<span className="archive-description">{repository.description}</span></span><span>{repository.topic}</span><ArrowUpRight size={23} aria-hidden="true" /></a>)}
      </div>
      <a className="editorial-link" href={siteConfig.github} target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>
    </section>
    <div className="work-closing"><p>Have something in mind?</p><Link href="/contact" className="sweep-link"><SweepText text="Let's talk" /><ArrowUpRight aria-hidden="true" /></Link></div>
  </section>
}
