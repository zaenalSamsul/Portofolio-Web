import { ArrowUpRight, Braces, Database, ScanSearch } from "lucide-react"
import Reveal from "./reveal"
import SectionHeading from "./section-heading"

const focusAreas = [
  { icon: Braces, title: "Build", text: "Machine-learning and LLM-powered applications connected to real interfaces." },
  { icon: Database, title: "Engineer", text: "Data pipelines and model services designed as complete systems." },
  { icon: ScanSearch, title: "Evaluate", text: "NLP, Computer Vision, and recommendation workflows grounded in measurable output." },
]

export default function About() {
  return (
    <section id="about" className="section section-muted">
      <div className="section-shell">
        <Reveal><SectionHeading eyebrow="01 / ABOUT" title="From model experiments to usable products." /></Reveal>
        <div className="about-layout">
          <Reveal className="about-copy">
            <p className="about-lead">
              I enjoy building AI systems that bridge the gap between machine-learning experiments and products people
              can actually use.
            </p>
            <p>
              My work spans NLP, Computer Vision, data engineering, recommendation systems, and LLM integration. I care
              about the full path: preparing data, training and evaluating models, exposing inference through services,
              and shaping the final application around a clear user need.
            </p>
            <a href="#projects" className="text-link">See how I work <ArrowUpRight size={17} aria-hidden="true" /></a>
          </Reveal>
          <div className="focus-list">
            {focusAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <Reveal key={area.title} delay={index * 90} className="focus-item">
                  <span className="focus-number">0{index + 1}</span>
                  <Icon size={20} aria-hidden="true" />
                  <div><h3>{area.title}</h3><p>{area.text}</p></div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <Reveal className="education-strip">
          <div><p className="eyebrow">EDUCATION</p><h3>Institut Teknologi Garut</h3></div>
          <p>Informatics Engineering</p>
          <p><span>GPA</span> 3.92 / 4.00</p>
        </Reveal>
      </div>
    </section>
  )
}
