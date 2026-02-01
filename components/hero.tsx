"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer rotating circle */}
        <div
          className="absolute w-96 h-96 border border-border/30 rounded-full animate-rotate-slow"
          style={{ animationDuration: "30s" }}
        ></div>
        {/* Middle pulsing circle */}
        <div
          className="absolute w-[28rem] h-[28rem] border border-border/20 rounded-full animate-pulse-glow"
          style={{ animationDuration: "4s", animationDelay: "0.5s" }}
        ></div>
        {/* Inner circle with glow */}
        <div
          className="absolute w-64 h-64 border border-accent/20 rounded-full animate-glow-pulse"
          style={{ animationDuration: "3s", animationDelay: "1s" }}
        ></div>
        {/* Shimmer effect circle */}
        <div
          className="absolute w-80 h-80 border border-transparent rounded-full animate-shimmer"
          style={{ animationDuration: "3s", animationDelay: "0.2s" }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Profile Section */}
        <div className="space-y-6 animate-fade-in">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-accent shadow-lg animate-bounce-in group">
              <Image
                src="/profile.webp"
                alt="Zaenal Syamsyul Arief"
                width={128}
                height={128}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              {/* Animated glow ring around profile */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500 animate-pulse-glow"></div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 animate-slide-up animation-delay-100">
            <p className="text-sm tracking-widest text-muted-foreground uppercase font-medium animate-text-reveal">
              Data Science Engineer
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Hi, the name's <span className="text-accent animate-glow-pulse">Zaenal</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground text-balance animate-slide-up animation-delay-200 max-w-xl mx-auto">
            Mahasiswa Teknik Informatika dengan IPK 3.91/4.00 yang passionate tentang Machine Learning, NLP, dan
            Computer Vision
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 pt-4 animate-slide-up animation-delay-300 text-sm font-medium">
          <a
            href="#about"
            className="text-muted-foreground hover:text-accent transition-all duration-300 relative group"
          >
            ABOUT
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#experience"
            className="text-muted-foreground hover:text-accent transition-all duration-300 relative group"
          >
            EXPERIENCE
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#projects"
            className="text-muted-foreground hover:text-accent transition-all duration-300 relative group"
          >
            PROJECTS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#skills"
            className="text-muted-foreground hover:text-accent transition-all duration-300 relative group"
          >
            SKILLS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up animation-delay-400">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50 animate-glow-pulse"
          >
            Lihat Proyek
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted transition-all duration-300 hover:scale-105 bg-transparent hover:border-accent"
          >
            Hubungi Saya
          </Button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 animate-slide-up animation-delay-500 text-sm text-muted-foreground">
          <a
            href="mailto:zaenalsyamsyularief@gmail.com"
            className="flex items-center gap-2 hover:text-accent transition-all duration-300 hover:gap-3 group"
          >
            <Mail className="w-4 h-4 group-hover:animate-bounce" />
            zaenalsyamsyularief@gmail.com
          </a>
          <a
            href="tel:+6281213861662"
            className="flex items-center gap-2 hover:text-accent transition-all duration-300 hover:gap-3 group"
          >
            <Phone className="w-4 h-4 group-hover:animate-bounce" />
            +62 812 1386 1662
          </a>
          <div className="flex items-center gap-2 group">
            <MapPin className="w-4 h-4 group-hover:animate-bounce" />
            Kabupaten Garut
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
