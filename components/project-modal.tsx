"use client"

import { X, ExternalLink, Github, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectModalProps {
  isOpen: boolean
  project: {
    title: string
    subtitle: string
    description: string
    fullDescription: string
    tags: string[]
    highlights: (
      | string
      | {
          label: string
          url: string
        }
    )[]
    githubUrl?: string
    link?: string
    pdfUrl?: string
    imageUrl?: string
  } | null
  onClose: () => void
}


export default function ProjectModal({ isOpen, project, onClose }: ProjectModalProps) {
  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
            <p className="text-accent mt-1">{project.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={project.imageUrl || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Short Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Tentang Proyek</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.fullDescription}</p>
          </div>

          {project.highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3 text-muted-foreground">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent flex-shrink-0 mt-0.5">
              ✓
            </span>
            <span>
              {typeof highlight === "string" ? (
                highlight
              ) : (
                <a
                  href={highlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  {highlight.label}
                  <ExternalLink size={14} />
                </a>
              )}
            </span>
          </li>
        ))}

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Teknologi & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted text-foreground hover:bg-accent/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Github size={18} />
                  GitHub
                </Button>
              </a>
            )}
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <ExternalLink size={18} />
                  Kunjungi Proyek
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
