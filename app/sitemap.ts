import type { MetadataRoute } from "next"
import { publishedProjects } from "@/lib/portfolio-data"
import { canonicalUrl, isIndexableDeployment } from "@/lib/deployment"

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexableDeployment) return []

  return [
    { url: canonicalUrl("/") },
    { url: canonicalUrl("/work") },
    { url: canonicalUrl("/about") },
    { url: canonicalUrl("/contact") },
    ...publishedProjects.map((project) => ({ url: canonicalUrl(`/projects/${project.slug}`) })),
  ]
}
