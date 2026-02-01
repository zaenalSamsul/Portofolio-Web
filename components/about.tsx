"use client"

import { useEffect, useState } from "react"

export default function About() {
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

    const element = document.getElementById("about-section")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card" id="about-section">
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-4xl sm:text-5xl font-bold text-foreground mb-12 text-balance transition-all duration-700 ${
            isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"
          }`}
        >
          Tentang Saya
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p
              className={`text-lg text-muted-foreground leading-relaxed transition-all duration-700 ${
                isVisible ? "animate-slide-in-left animation-delay-100" : "opacity-0 -translate-x-10"
              }`}
            >
              Mahasiswa Teknik Informatika semester 7 dengan IPK 3.91/4.00 yang memiliki dedikasi tinggi terhadap
              pengembangan teknologi berbasis kecerdasan buatan. Memiliki fondasi kuat dalam analisis data, machine
              learning, dan deep learning.
            </p>
            <p
              className={`text-lg text-muted-foreground leading-relaxed transition-all duration-700 ${
                isVisible ? "animate-slide-in-left animation-delay-200" : "opacity-0 -translate-x-10"
              }`}
            >
              Berpengalaman membangun model machine learning end-to-end untuk berbagai kasus seperti analisis sentimen
              (NLP), klasifikasi gambar (Computer Vision), sistem rekomendasi, serta pengembangan pipeline data dan
              integrasi sistem berbasis AI.
            </p>
            <div className="space-y-3 pt-4">
              {[
                "Data Science Intern di NoLimit Indonesia (Juli - Nov 2025)",
                "Coding Camp ML Engineer - DBS Foundation (Feb - Juli 2025)",
                "Spesialis dalam NLP, Computer Vision, dan Sistem Rekomendasi",
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-700 ${
                    isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"
                  }`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0 animate-glow-pulse" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative flex items-center justify-center transition-all duration-700 ${
              isVisible ? "animate-flip-in" : "opacity-0"
            }`}
          >
            {/* Animated circular background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-rotate-slow" />
              <div className="absolute w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl animate-pulse" />
            </div>

            {/* Stats content */}
            <div className="relative z-10 text-center space-y-6">
              <div className="space-y-2">
                <div
                  className={`text-7xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent transition-all duration-700 ${
                    isVisible ? "animate-scale-in" : "opacity-0 scale-50"
                  }`}
                  style={{ animationDelay: "200ms" }}
                >
                  3.91
                </div>
                <p className="text-foreground text-xl font-semibold">IPK / 4.00</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Institut Teknologi Garut</p>
                <p className="text-accent text-sm font-medium">Teknik Informatika - Semester 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
