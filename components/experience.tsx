"use client"

import { useEffect, useState } from "react"
import { Briefcase, Code2, Zap } from "lucide-react"

export default function Experience() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("experience-section")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  const experiences = [
    {
      id: 1,
      title: "Data Science Intern",
      company: "NoLimit Indonesia",
      period: "JUL 2025 - NOV 2025",
      icon: Briefcase,
      description: [
        "Mengembangkan data pipeline otomatis untuk ekstraksi, transformasi, dan pemrosesan data media sosial secara real-time",
        "Mengembangkan sistem klasifikasi sentimen untuk data publik dengan tingkat akurasi tinggi",
        "Membuat tools internal berbasis Python untuk mempercepat analisis data",
      ],
      techStack: ["Python", "TensorFlow", "Elasticsearch", "SQL", "Machine Learning"],
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "ML Engineer Cohort",
      company: "Coding Camp - DBS Foundation",
      period: "FEB 2025 - JUL 2025",
      icon: Code2,
      description: [
        "Mengembangkan model machine learning end-to-end menggunakan Python, TensorFlow, dan Scikit-learn",
        "Menerapkan teknik deep learning untuk NLP dan Computer Vision",
        "Merancang dan mengimplementasikan pipeline ETL yang andal",
      ],
      techStack: ["Python", "TensorFlow", "Scikit-learn", "NLP", "Computer Vision"],
      color: "from-cyan-400 to-cyan-600",
    },
    {
      id: 3,
      title: "Capstone Project Lead",
      company: "MyCareAi - Emotion Detection",
      period: "JUN 2025",
      icon: Zap,
      description: [
        "Mengembangkan model klasifikasi emosi dari curhatan pengguna menggunakan teknik NLP",
        "Merancang arsitektur Dual-AI yang inovatif mencapai akurasi 92%",
        "Mengintegrasikan model ke dalam chatbot interaktif berbasis web",
      ],
      techStack: ["Python", "TensorFlow", "NLP", "Google Vertex AI", "React"],
      color: "from-amber-400 to-amber-600",
    },
  ]

  const getTechStackColor = (tech: string) => {
    const colors: { [key: string]: string } = {
      Python: "bg-blue-100 text-blue-700",
      TensorFlow: "bg-orange-100 text-orange-700",
      Elasticsearch: "bg-yellow-100 text-yellow-700",
      SQL: "bg-purple-100 text-purple-700",
      "Machine Learning": "bg-pink-100 text-pink-700",
      "Scikit-learn": "bg-green-100 text-green-700",
      NLP: "bg-red-100 text-red-700",
      "Computer Vision": "bg-indigo-100 text-indigo-700",
      "Google Vertex AI": "bg-cyan-100 text-cyan-700",
      React: "bg-blue-100 text-blue-700",
    }
    return colors[tech] || "bg-gray-100 text-gray-700"
  }

  return (
    <section id="experience-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className={`text-sm font-semibold tracking-widest text-accent uppercase mb-4 transition-all duration-700 ${
              isVisible ? "animate-fade-in" : "opacity-0"
            }`}
          >
            E X P E R I E N C E
          </p>
          <h2
            className={`text-4xl sm:text-5xl font-bold text-foreground text-balance transition-all duration-700 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"
            }`}
          >
            Pengalaman Profesional
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon
            return (
              <div
                key={exp.id}
                className={`group relative transition-all duration-700 ${
                  isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-accent/20 hover:border-accent/50 transition-all duration-500 h-full flex flex-col hover:shadow-xl hover:shadow-accent/10">
                  <div className="mb-6 inline-flex">
                    <div
                      className={`bg-gradient-to-br ${exp.color} p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                    {exp.title}
                  </h3>
                  <p className="text-accent font-semibold mb-2">{exp.company}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {exp.period}
                  </p>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className={`text-sm text-muted-foreground leading-relaxed flex gap-2 transition-all duration-500 ${
                          isVisible ? "animate-slide-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${index * 150 + i * 100}ms` }}
                      >
                        <span className="text-accent font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-accent/10">
                    {exp.techStack.map((tech, i) => (
                      <span
                        key={tech}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getTechStackColor(
                          tech,
                        )} transition-all duration-300 hover:scale-110 ${isVisible ? "animate-scale-in" : "opacity-0"}`}
                        style={{ animationDelay: `${index * 150 + i * 50}ms` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
