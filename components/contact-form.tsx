"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight } from "lucide-react"

type State = "idle" | "sending" | "sent" | "unavailable" | "error"
type Field = "name" | "email" | "subject" | "message"
type Errors = Partial<Record<Field, string>>
export type ContactFormInitialStatus = "sent" | "unavailable" | "pending" | "error" | "invalid" | undefined

const fields: Field[] = ["name", "email", "subject", "message"]
const initialState = (status: ContactFormInitialStatus): State => status === "sent" ? "sent" : status === "unavailable" || status === "pending" ? "unavailable" : status === "error" || status === "invalid" ? "error" : "idle"
const messages: Record<State, string> = {
  idle: "",
  sending: "Sending your message…",
  sent: "Thank you. Your message has been submitted. I’ll reply by email.",
  unavailable: "Email delivery is being set up. Your message has not been sent. Please try again later.",
  error: "Your message could not be sent. Please try again later.",
}

export default function ContactForm({ recipientEmail, initialStatus }: { recipientEmail: string; initialStatus?: ContactFormInitialStatus }) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)
  const [state, setState] = useState<State>(initialState(initialStatus))
  const [message, setMessage] = useState(messages[initialState(initialStatus)])
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (state === "sent" || state === "unavailable") statusRef.current?.focus({ preventScroll: true })
  }, [state])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sendingRef.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = Object.fromEntries([...fields, "website"].map((key) => [key, String(data.get(key) ?? "")]))
    sendingRef.current = true
    setErrors({})
    setState("sending")
    setMessage(messages.sending)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20_000)
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload), signal: controller.signal })
      const result = await response.json()
      if (response.ok && result.status === "sent") {
        form.reset()
        setState("sent")
        setMessage(messages.sent)
      } else if (response.status === 503 && result.status === "configuration_required") {
        setState("unavailable")
        setMessage(messages.unavailable)
      } else {
        const nextErrors: Errors = {}
        for (const field of fields) if (typeof result.errors?.[field] === "string") nextErrors[field] = result.errors[field]
        setErrors(nextErrors)
        setState("error")
        setMessage(response.status === 422 ? "Please check the highlighted fields." : response.status === 429 ? "Too many messages were submitted. Please wait a few minutes and try again." : messages.error)
        const firstError = fields.find((field) => nextErrors[field])
        if (firstError) (form.elements.namedItem(firstError) as HTMLElement | null)?.focus()
      }
    } catch {
      setState("error")
      setMessage("The message could not be sent. Your text is still here — please try again later.")
    } finally {
      clearTimeout(timeout)
      sendingRef.current = false
    }
  }

  const errorProps = (field: Field) => ({ "aria-invalid": Boolean(errors[field]) || undefined, "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined })

  return <form ref={formRef} className="message-form" action="/api/contact" method="post" onSubmit={submit} aria-busy={state === "sending"}>
    <p className="message-required">All fields are required.</p>
    <fieldset disabled={state === "sending"} className="message-fields">
      <legend className="sr-only">Your message</legend>
      <div className="message-field"><label htmlFor={`${id}-name`}>Name</label><input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} {...errorProps("name")} />{errors.name && <p id={`${id}-name-error`} className="field-error">{errors.name}</p>}</div>
      <div className="message-field"><label htmlFor={`${id}-email`}>Email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...errorProps("email")} />{errors.email && <p id={`${id}-email-error`} className="field-error">{errors.email}</p>}</div>
      <div className="message-field message-field-wide"><label htmlFor={`${id}-subject`}>Subject</label><input id={`${id}-subject`} name="subject" required maxLength={160} {...errorProps("subject")} />{errors.subject && <p id={`${id}-subject-error`} className="field-error">{errors.subject}</p>}</div>
      <div className="message-field message-field-wide"><label htmlFor={`${id}-message`}>Message</label><textarea id={`${id}-message`} name="message" rows={7} required minLength={10} maxLength={5000} {...errorProps("message")} />{errors.message && <p id={`${id}-message-error`} className="field-error">{errors.message}</p>}</div>
      <div className="message-trap" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
    </fieldset>
    <button className="message-submit" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}<ArrowUpRight size={19} aria-hidden="true" /></button>
    <div ref={statusRef} className={`message-status message-status-${state}`} role={state === "error" ? "alert" : "status"} aria-live={state === "error" ? "assertive" : "polite"} aria-atomic="true" tabIndex={-1}>{message}</div>
    <p className="message-delivery">To: {recipientEmail}</p>
  </form>
}
