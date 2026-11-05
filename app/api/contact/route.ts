import { createContactHandler } from "@/lib/contact-service.mjs"
import { siteConfig } from "@/lib/portfolio-data"
import { createGmailSender } from "@/lib/gmail-smtp.mjs"

export const runtime = "nodejs"

const handleContact = createContactHandler({ recipient: siteConfig.email, sendMail: createGmailSender({ recipient: siteConfig.email }) })

export async function POST(request: Request) {
  return handleContact(request)
}
