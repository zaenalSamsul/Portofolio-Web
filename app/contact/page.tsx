import type { Metadata } from "next"
import Header from "@/components/header"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { canonicalUrl } from "@/lib/deployment"

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Zaenal Syamsyul Arief about data, AI projects, or engineering opportunities.", alternates: { canonical: canonicalUrl("/contact") }, openGraph: { title: "Contact | Zaenal Syamsyul Arief", url: canonicalUrl("/contact") } }
export default function ContactPage() { return <><Header active="contact" /><main id="main-content" tabIndex={-1}><Contact /></main><Footer /></> }
