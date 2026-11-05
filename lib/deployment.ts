import type { Metadata } from "next"
import { siteConfig } from "@/lib/portfolio-data"

// Preview hosts can opt out explicitly without changing the production canonical.
export const isIndexableDeployment =
  process.env.NODE_ENV === "production" &&
  process.env.PORTFOLIO_PREVIEW !== "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production")

export const productionSiteUrl = new URL(siteConfig.website)

export function canonicalUrl(pathname = "/") {
  return new URL(pathname, productionSiteUrl).toString()
}

export const indexingRobots: Metadata["robots"] = {
  index: isIndexableDeployment,
  follow: isIndexableDeployment,
}
