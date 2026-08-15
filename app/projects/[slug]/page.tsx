import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CaseStudy from "@/components/case-study"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { projects } from "@/lib/portfolio-data"

type ProjectPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) return {}

  return {
    title: `${project.name} Case Study`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — AI Engineering Case Study`,
      description: project.description,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) notFound()

  return <><Header /><CaseStudy project={project} /><Footer /></>
}
