import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { siteConfig } from "@/lib/portfolio-data"
import { canonicalUrl, indexingRobots, productionSiteUrl } from "@/lib/deployment"
import { MotionProvider } from "@/components/motion-provider"
import LegacyAnchors from "@/components/legacy-anchors"

const editorialFont = localFont({
  src: [
    { path: "../public/fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
  adjustFontFallback: "Times New Roman",
})

export const metadata: Metadata = {
  metadataBase: productionSiteUrl,
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: "%s | Zaenal Syamsyul Arief",
  },
  description:
    "Data & AI Engineer building dependable data pipelines, machine learning systems, and LLM-powered applications. Explore selected projects and engineering experience.",
  authors: [{ name: "Zaenal Syamsyul Arief" }],
  creator: "Zaenal Syamsyul Arief",
  alternates: { canonical: canonicalUrl("/") },
  robots: indexingRobots,
  openGraph: {
    type: "website",
    url: canonicalUrl("/"),
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: "Building intelligent systems from data to deployment.",
    siteName: "Zaenal Syamsyul Arief Portfolio",
    images: [{ url: "/zaenal-portrait.png", width: 1254, height: 1254, alt: "Zaenal Syamsyul Arief" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: "Building intelligent systems from data to deployment.",
    images: ["/zaenal-portrait.png"],
  },
  icons: {
    icon: "/za-logo.png",
    shortcut: "/za-logo.png",
    apple: "/za-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={editorialFont.variable} data-motion="static" suppressHydrationWarning>
      <body>
        <MotionProvider><LegacyAnchors />{children}</MotionProvider>
      </body>
    </html>
  )
}
