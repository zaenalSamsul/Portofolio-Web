import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://zaenalsyamsyularief-porto.vercel.app"),
  title: {
    default: "Zaenal Syamsyul Arief | AI Engineer & Data Scientist",
    template: "%s | Zaenal Syamsyul Arief",
  },
  description:
    "AI Engineer and Data Scientist building applications across Machine Learning, NLP, Computer Vision, data engineering, and LLM integration.",
  authors: [{ name: "Zaenal Syamsyul Arief" }],
  creator: "Zaenal Syamsyul Arief",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Zaenal Syamsyul Arief | AI Engineer & Data Scientist",
    description: "Building intelligent systems from data to deployment.",
    siteName: "Zaenal Syamsyul Arief Portfolio",
    images: [{ url: "/profile.webp", width: 1200, height: 1200, alt: "Zaenal Syamsyul Arief" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaenal Syamsyul Arief | AI Engineer & Data Scientist",
    description: "Building intelligent systems from data to deployment.",
    images: ["/profile.webp"],
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
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
