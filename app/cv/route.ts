import { siteConfig } from "@/lib/portfolio-data"
import { isIndexableDeployment } from "@/lib/deployment"

export function GET() {
  const response = new Response(null, {
    status: 307,
    headers: { Location: siteConfig.resume },
  })

  if (!isIndexableDeployment) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  return response
}
