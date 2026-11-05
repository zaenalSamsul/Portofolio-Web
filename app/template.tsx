import type { ReactNode } from "react"
import PageMotion from "@/components/page-motion"

export default function PageTemplate({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>
}
