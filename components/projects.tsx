"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import ProjectModal from "./project-modal"

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("projects")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  const projects = [
    {
      title: "MyCareAi",
      subtitle: "Web Deteksi Emosi dengan Chatbot AI",
      description:
        "Capstone project dengan model klasifikasi emosi menggunakan NLP dan Dual-AI architecture mencapai akurasi 92%",
      fullDescription: `MyCareAi adalah aplikasi kesehatan mental inovatif yang dirancang untuk memberikan dukungan dan pemantauan kondisi emosional pengguna. Proyek ini menggabungkan teknologi web modern untuk front-end dan kecerdasan buatan (AI) pada back-end untuk menganalisis dan mengklasifikasikan suasana hati (mood) pengguna berdasarkan masukan teks.

Aplikasi ini dibangun dengan arsitektur modern yang memisahkan front-end dan back-end, di mana front-end dikembangkan menggunakan HTML, CSS, dan JavaScript, sedangkan back-end menggunakan Node.js (Express) untuk layanan utama dan Python (Flask) untuk layanan klasifikasi mood berbasis AI.`,
      highlights: [
        "Analisis Mood: Pengguna dapat memasukkan catatan harian atau teks tentang perasaan mereka, yang kemudian akan dianalisis oleh model machine learning untuk menentukan kondisi emosional",
        "Chatbot Interaktif: Menyediakan chatbot yang didukung oleh Model llama-4-maverick-17b-128e-instruct-maas untuk interaksi dan dukungan langsung kepada pengguna",
        "Catatan Emosi: Fitur untuk mencatat dan melacak riwayat emosi dari waktu ke waktu, membantu pengguna memahami pola suasana hati mereka",
        "Artikel Edukasi: Menyediakan akses ke artikel-artikel informatif seputar kesehatan mental",
      ],
      tags: ["Python", "TensorFlow", "NLP", "Google Vertex AI", "Node.js", "Flask", "Machine Learning"],
      link: "#",
      githubUrl: "https://github.com/zaenalSamsul/MyCareAi.git",
      imageUrl: "/projects/mycareai.png",
    },
    {
      title: "StuntLytics",
      subtitle: "Sistem Prediksi Risiko Stunting",
      description:
        "Sistem prediksi berbasis AI untuk pemerintah daerah dengan dataset sintetis 100.000 data dan dashboard Streamlit",
      fullDescription: `StuntLytics adalah sistem prediksi risiko stunting yang komprehensif dirancang khusus untuk membantu pemerintah daerah dalam mengidentifikasi dan mengelola risiko stunting pada anak-anak. Sistem ini menggunakan machine learning untuk menganalisis berbagai faktor yang berkontribusi terhadap stunting.

Dengan dataset sintetis yang mencakup 100.000 data poin, sistem ini mampu memberikan prediksi yang akurat dan actionable insights untuk pengambilan keputusan kebijakan publik.`,
      highlights: [
        "Machine Learning Model: Algoritma prediksi yang dilatih dengan dataset sintetis 100.000 data poin",
        "Interactive Dashboard: Dashboard Streamlit yang user-friendly untuk visualisasi data dan hasil prediksi",
        "Feature Engineering: Ekstraksi dan transformasi fitur untuk meningkatkan akurasi model",
        "API Integration: Integrasi dengan sistem pemerintah untuk real-time monitoring dan reporting",
        {
          label: "Demo Video",
          url: "https://www.youtube.com/watch?v=9pT6OBXhEdw",
        },
      ],
      tags: ["Python", "Scikit-learn", "Streamlit", "Elasticsearch", "Data Analysis", "Machine Learning"],
      link: "#",
      githubUrl: "https://github.com/zaenalSamsul/StuntLytics-Aphacton.git",
      imageUrl: "/projects/stuntlytics.jpg",
    },
    {
      title: "Data Pipeline & Sentiment Analysis",
      subtitle: "Sistem Analisis Sentimen Real-time",
      description:
        "Pipeline otomatis untuk ekstraksi, transformasi, dan pemrosesan data media sosial real-time dengan sistem klasifikasi sentimen",
      fullDescription: `Proyek ini mengimplementasikan pipeline data end-to-end yang mampu mengekstraksi, mentransformasi, dan memproses data dari berbagai sumber media sosial secara real-time. Sistem ini dilengkapi dengan model klasifikasi sentimen yang canggih untuk menganalisis sentimen dari teks-teks yang diekstraksi.

Pipeline ini dirancang dengan skalabilitas tinggi menggunakan Elasticsearch sebagai storage dan indexing engine untuk performa query yang optimal.`,
      highlights: [
        "Real-time Data Extraction: Pengambilan data dari multiple social media sources secara real-time",
        "ETL Pipeline: Proses ekstraksi, transformasi, dan loading data yang otomatis dan reliable",
        "Sentiment Classification: Model NLP untuk klasifikasi sentimen dengan akurasi tinggi",
        "Elasticsearch Integration: Indexing dan querying data berskala besar dengan performa optimal",
      ],
      tags: ["Python", "Elasticsearch", "Machine Learning", "Data Engineering", "NLP", "ETL"],
      link: "#",
      githubUrl: "https://github.com/zaenalSamsul",
      imageUrl: "/projects/data-pipeline.jpg",
    },
    {
      title: "Sistem Rekomendasi Hybrid",
      subtitle: "Multi-Algorithm Recommendation Engine",
      description:
        "Implementasi sistem rekomendasi fungsional dengan algoritma content-based, collaborative filtering, dan hybrid approach",
      fullDescription: `Sistem rekomendasi hybrid yang menggabungkan multiple algoritma untuk memberikan rekomendasi yang lebih akurat dan personalisasi. Sistem ini mengintegrasikan content-based filtering yang menganalisis karakteristik item dengan collaborative filtering yang memanfaatkan user behavior patterns.

Implementasi hybrid approach memastikan rekomendasi yang optimal bahkan dalam kondisi cold-start problem atau data sparsity.`,
      highlights: [
        "Content-Based Filtering: Analisis karakteristik item untuk menemukan kesamaan dan memberikan rekomendasi berbasis atribut",
        "Collaborative Filtering: Memanfaatkan user-item interactions untuk menemukan user dengan preferensi serupa",
        "Hybrid Approach: Kombinasi kedua metode untuk rekomendasi yang lebih robust dan akurat",
        "Scalable Implementation: Desain yang dapat scale untuk handling large-scale user dan item data",
      ],
      tags: ["Python", "Scikit-learn", "Machine Learning", "Recommendation Systems", "Data Analysis"],
      link: "#",
      githubUrl: "https://github.com/zaenalSamsul/System-Rekomendasi-Film",
      imageUrl: "/projects/recommendation-system.jpg",
    },
  ]

  const handleOpenModal = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-4xl sm:text-5xl font-bold text-foreground mb-12 text-balance transition-all duration-700 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-10"
            }`}
          >
            Proyek Terbaru
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card
                key={index}
                onClick={() => handleOpenModal(project)}
                className={`bg-card border-border hover:border-accent transition-all duration-500 hover:shadow-lg hover:shadow-accent/20 hover:scale-105 cursor-pointer ${
                  isVisible ? "animate-bounce-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-foreground group-hover:text-accent transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-accent text-sm font-medium mb-2">{project.subtitle}</CardDescription>
                  <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`bg-muted text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110 ${
                          isVisible ? "animate-slide-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: `${index * 150 + tagIndex * 50}ms` }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-all duration-300 font-medium hover:gap-3 group">
                    Lihat Detail
                    <ExternalLink size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal isOpen={isModalOpen} project={selectedProject} onClose={handleCloseModal} />
    </>
  )
}
