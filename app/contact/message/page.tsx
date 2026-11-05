import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactForm, { type ContactFormInitialStatus } from "@/components/contact-form"
import { siteConfig } from "@/lib/portfolio-data"
import { canonicalUrl } from "@/lib/deployment"

export const metadata: Metadata = {
  title: "Send a message",
  description: "Send a message to Zaenal Syamsyul Arief about a project or engineering opportunity.",
  alternates: { canonical: canonicalUrl("/contact/message") },
  robots: { index: false, follow: true },
  openGraph: { title: "Send a message | Zaenal Syamsyul Arief", url: canonicalUrl("/contact/message") },
}

export default async function MessagePage({ searchParams }: { searchParams: Promise<{ status?: string | string[] }> }) {
  const query = await searchParams
  const status: ContactFormInitialStatus = typeof query.status === "string" && ["sent", "unavailable", "pending", "error", "invalid"].includes(query.status) ? query.status as ContactFormInitialStatus : undefined
  return <>
    <Header active="contact" />
    <main id="main-content" tabIndex={-1} className="message-page section-shell">
      <Link className="editorial-link message-back" href="/contact"><ArrowLeft size={17} aria-hidden="true" /> Contact</Link>
      <div className="message-layout">
        <header className="message-heading"><p className="page-label">Get in touch</p><h1>Start a<br /><em>conversation.</em></h1><p>Tell me a little about your project, opportunity, or idea. Leave your email so I can get back to you.</p></header>
        <ContactForm recipientEmail={siteConfig.email} initialStatus={status} />
      </div>
    </main>
    <Footer />
  </>
}
