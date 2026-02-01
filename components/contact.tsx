"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Phone } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/zaenal-syamsyul-arief", label: "LinkedIn" },
    { icon: Mail, href: "mailto:zaenalsyamsyularief@gmail.com", label: "Email" },
    { icon: Phone, href: "tel:+6281213861662", label: "Phone" },
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Mari Berkolaborasi</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Saya selalu terbuka untuk proyek baru dan peluang menarik di bidang Data Science dan Machine Learning. Hubungi
          saya untuk diskusi lebih lanjut.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nama
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Tulis pesan Anda di sini..."
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Kirim Pesan
            </Button>
          </form>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Hubungi Saya</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Email:</span> zaenalsyamsyularief@gmail.com
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Phone:</span> +62 812 1386 1662
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Lokasi:</span> Kabupaten Garut, Indonesia
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Respons Time:</span> 24 jam
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Ikuti Saya</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-3 bg-muted hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={20} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
