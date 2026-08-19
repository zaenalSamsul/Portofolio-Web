import Image from "next/image"
import { ArrowDownRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/portfolio-data"

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="section-shell hero-layout">
        <div className="hero-copy">
          <p className="hero-name hero-enter hero-delay-2">Hi, I&apos;m Zaenal Syamsyul Arief.</p>
          <h1 className="hero-enter hero-delay-3">
            AI Engineer <span>&amp; Data Scientist.</span>
          </h1>
          <p className="hero-kicker hero-enter hero-delay-4">Building intelligent systems from data to deployment.</p>
          <p className="hero-description hero-enter hero-delay-5">
            I build AI-powered applications using Machine Learning, NLP, Computer Vision, and LLMs—from experimentation
            to real-world deployment.
          </p>

          <div className="hero-cta hero-enter hero-delay-6">
            <a href="#projects" className="button button-primary">
              Explore my work <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a href={siteConfig.resume} download className="button button-secondary">
              Download resume <Download size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-meta hero-enter hero-delay-7">
            <div className="social-list" aria-label="Social links">
              <a href={siteConfig.github} target="_blank" rel="noreferrer">
                <Github size={16} aria-hidden="true" /> GitHub
              </a>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} aria-hidden="true" /> LinkedIn
              </a>
              <a href={`mailto:${siteConfig.email}`}>
                <Mail size={16} aria-hidden="true" /> Email
              </a>
            </div>
            <span className="hero-location"><MapPin size={15} aria-hidden="true" /> {siteConfig.location}</span>
          </div>
        </div>

        <div className="hero-visual hero-enter hero-delay-4">
          <div className="portrait-frame">
            <div className="portrait-index" aria-hidden="true">01 / PROFILE</div>
            <Image
              src="/profile.webp"
              alt="Zaenal Syamsyul Arief"
              fill
              priority
              sizes="(max-width: 767px) 84vw, 38vw"
              className="portrait-image"
            />
          </div>
          <div className="tech-line" aria-label="Core technologies">
            <span>Python</span><i />
            <span>Machine Learning</span><i />
            <span>NLP</span><i />
            <span>Computer Vision</span>
          </div>
        </div>
      </div>
    </section>
  )
}
