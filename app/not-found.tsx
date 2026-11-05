import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="not-found">
        <div className="section-shell">
          <div className="case-hero">
            <p className="page-label">404</p>
            <h1>Page not found.</h1>
            <p className="case-intro">The page you are looking for is unavailable. Explore my selected work to find projects and case studies.</p>
            <div className="case-links">
              <Link href="/work" className="editorial-link">
                <ArrowLeft size={17} aria-hidden="true" /> Back to work
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
