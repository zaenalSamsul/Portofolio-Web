import type { Metadata } from "next"
import Header from "@/components/header"
import Projects from "@/components/projects"
import Footer from "@/components/footer"
import { canonicalUrl } from "@/lib/deployment"

export const metadata: Metadata = { title: "Selected Work", description: "Selected data engineering, machine learning, and applied AI projects by Zaenal Syamsyul Arief.", alternates: { canonical: canonicalUrl("/work") }, openGraph: { title: "Selected Work | Zaenal Syamsyul Arief", url: canonicalUrl("/work") } }
export default function WorkPage() { return <><Header active="work" /><main id="main-content" tabIndex={-1}><Projects /></main><Footer /></> }
