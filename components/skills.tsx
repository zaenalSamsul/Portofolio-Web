import { BrainCircuit, CloudCog, Database, ScanText } from "lucide-react"
import { skillGroups } from "@/lib/portfolio-data"
import Reveal from "./reveal"
import SectionHeading from "./section-heading"

const icons = [BrainCircuit, ScanText, Database, CloudCog]

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="04 / CAPABILITIES"
            title="A focused toolkit for shipping AI systems."
            description="Grouped by the work they enable—not subjective proficiency scores."
          />
        </Reveal>
        <div className="skills-grid">
          {skillGroups.map((group, index) => {
            const Icon = icons[index]
            return (
              <Reveal key={group.title} delay={index * 80} className="skill-group">
                <div className="skill-title"><Icon size={21} aria-hidden="true" /><h3>{group.title}</h3></div>
                <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
