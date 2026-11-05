import type { Metadata } from "next"
import Header from "@/components/header"
import About from "@/components/about"
import Experience from "@/components/experience"
import Skills from "@/components/skills"
import Footer from "@/components/footer"
import { canonicalUrl } from "@/lib/deployment"

export const metadata: Metadata = { title: "About", description: "Meet Zaenal Syamsyul Arief, a Data & AI Engineer based in Garut, Indonesia. Experience, education, and the tools behind the work.", alternates: { canonical: canonicalUrl("/about") }, openGraph: { title: "About | Zaenal Syamsyul Arief", url: canonicalUrl("/about") } }
export default function AboutPage() { return <><Header active="about" /><main id="main-content" tabIndex={-1}><About><Experience /></About><Skills /></main><Footer /></> }
