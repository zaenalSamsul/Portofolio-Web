import { experiences } from "@/lib/portfolio-data"
import ExperienceTimeline from "./experience-timeline"

export default function Experience() {
  return (
    <section id="experience" className="section editorial-experience" aria-labelledby="experience-title">
      <div className="section-shell">
        <header className="editorial-section-heading">
          <h2 id="experience-title">Experience.</h2>
          <p>Work across data engineering, applied AI, and technical education.</p>
        </header>
        <ExperienceTimeline experiences={experiences} />
      </div>
    </section>
  )
}
