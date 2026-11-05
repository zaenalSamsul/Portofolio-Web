import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CaseStudy from "@/components/case-study"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { publishedProjects, siteConfig } from "@/lib/portfolio-data"
import { canonicalUrl, indexingRobots } from "@/lib/deployment"

type ProjectPageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = publishedProjects.find((item) => item.slug === slug)
  if (!project) notFound()
  const socialImage = project.image.replace(/\.svg$/, ".png")

  return {
    title: `${project.name} Case Study`,
    description: project.description,
    alternates: { canonical: canonicalUrl(`/projects/${project.slug}`) },
    robots: indexingRobots,
    openGraph: {
      type: "article",
      siteName: `${siteConfig.name} Portfolio`,
      url: canonicalUrl(`/projects/${project.slug}`),
      title: `${project.name} — AI Engineering Case Study`,
      description: project.description,
      images: [{ url: socialImage, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteConfig.name}`,
      description: project.description,
      images: [socialImage],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = publishedProjects.find((item) => item.slug === slug)
  if (!project) notFound()

  return <><Header active="work" /><CaseStudy project={project} /><Footer /></>
}
