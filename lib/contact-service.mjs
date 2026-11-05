import { isIP } from "node:net"

export const MAX_CONTACT_BODY_BYTES = 64 * 1024
const FORM_PATH = "/contact/message"
const FIELD_NAMES = ["name", "email", "subject", "message", "website"]
const ONE_LINE_CONTROLS = /[\u0000-\u001f\u007f\u2028\u2029]/u
const MESSAGE_CONTROLS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u

const messages = {
  invalid: "Please check the form fields and try again.",
  blocked: "The message could not be submitted. Please reload the form and try again.",
  origin: "This request could not be verified. Please submit the form from this website.",
  unsupported: "This form submission format is not supported.",
  oversized: "The form submission is too large. Please shorten your message and try again.",
  limited: "Too many messages were submitted. Please wait a few minutes before trying again.",
  provider: "The sending service did not confirm your message. Please try again later.",
  timeout: "The sending service timed out before confirming your message. Please try again later.",
  configuration: "The contact form is not ready to send messages yet. Please try again later.",
  sent: "Your message was accepted for sending. Thank you for getting in touch.",
}

function validEmail(value) {
  if (typeof value !== "string" || value.length > 254 || ONE_LINE_CONTROLS.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return false
  const labels = domain.split(".")
  return labels.length > 1 && labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
}

/** Validate only visitor fields. Provider configuration and destinations never come from input. */
export function validateContactInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { errors: { form: messages.invalid } }
  const errors = {}
  const values = {}
  for (const field of ["name", "email", "subject", "message"]) {
    if (typeof input[field] !== "string") errors[field] = "This field is required."
    else values[field] = field === "message" ? input[field].trim().replace(/\r\n?/g, "\n") : input[field].trim()
  }
  if (input.website !== undefined && typeof input.website !== "string") errors.form = messages.invalid
  if (typeof input.website === "string" && input.website.trim()) return { honeypot: true, errors: { form: messages.blocked } }
  if (values.name !== undefined && (values.name.length < 2 || values.name.length > 100 || ONE_LINE_CONTROLS.test(input.name))) errors.name = "Enter a name between 2 and 100 characters on one line."
  if (values.email !== undefined && (!validEmail(values.email) || ONE_LINE_CONTROLS.test(input.email))) errors.email = "Enter a valid email address, up to 254 characters."
  if (values.subject !== undefined && (!values.subject || values.subject.length > 160 || ONE_LINE_CONTROLS.test(input.subject))) errors.subject = "Enter a subject of up to 160 characters on one line."
  if (values.message !== undefined && (values.message.length < 10 || values.message.length > 5000 || MESSAGE_CONTROLS.test(values.message))) errors.message = "Enter a message between 10 and 5,000 characters."
  if (Object.keys(errors).length) return { errors }
  return { values: { name: values.name, email: values.email, subject: values.subject, message: values.message.replace(/\r\n?/g, "\n") } }
}

function authority(value, protocol) {
  if (!value || /[\s,@/\\?#]/u.test(value)) return null
  try {
    const parsed = new URL(`${protocol}//${value}`)
    return parsed.username || parsed.password ? null : parsed.host
  } catch { return null }
}

/** Resolve the visitor's origin without using Next's potentially local request.url host. */
export function resolveContactOrigin(request) {
  const site = request.headers.get("sec-fetch-site")
  if (site && !["same-origin", "none"].includes(site)) return null
  let internal
  try { internal = new URL(request.url) } catch { return null }
  const forwardedHost = request.headers.get("x-forwarded-host")
  const requestHost = forwardedHost ?? request.headers.get("host") ?? internal.host
  const forwardedProtocol = request.headers.get("x-forwarded-proto")
  if (forwardedProtocol && !["http", "https"].includes(forwardedProtocol)) return null
  const protocol = forwardedProtocol ? `${forwardedProtocol}:` : authority(requestHost, internal.protocol) === internal.host ? internal.protocol : "https:"
  const host = authority(requestHost, protocol)
  if (!host) return null
  const expected = new URL(`${protocol}//${host}`).origin
  const origin = request.headers.get("origin")
  const candidate = origin ?? request.headers.get("referer")
  if (!candidate || candidate === "null") return null
  try {
    const parsed = new URL(candidate)
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.origin !== expected) return null
    if (origin && (parsed.pathname !== "/" || parsed.search || parsed.hash)) return null
    return parsed.origin
  } catch { return null }
}

/** A bounded, per-process abuse brake, not a shared or distributed quota. */
export function createContactRateLimiter({ limit = 5, windowMs = 10 * 60 * 1000, maxEntries = 1000, now = Date.now } = {}) {
  if (limit < 1 || windowMs < 1 || maxEntries < 1) throw new Error("Invalid contact rate limit")
  const entries = new Map()
  return {
    consume(key) {
      const time = now()
      for (const [id, entry] of entries) if (entry.expires <= time) entries.delete(id)
      let entry = entries.get(key)
      if (!entry && entries.size >= maxEntries) {
        const earliest = Math.min(...Array.from(entries.values(), (item) => item.expires))
        return { allowed: false, retryAfter: Math.max(1, Math.ceil((earliest - time) / 1000)) }
      }
      if (!entry) { entry = { count: 0, expires: time + windowMs }; entries.set(key, entry) }
      if (entry.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.expires - time) / 1000)) }
      entry.count++
      return { allowed: true, retryAfter: 0 }
    },
    get size() { return entries.size },
  }
}

function clientKey(request) {
  for (const value of [request.headers.get("cf-connecting-ip"), request.headers.get("x-real-ip"), request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()]) {
    if (value && isIP(value)) return value
  }
  return "unidentified-client"
}

class BodyLimitError extends Error {}

async function boundedText(message, maxBytes) {
  const length = message.headers.get("content-length")
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new BodyLimitError()
  if (!message.body) return ""
  const reader = message.body.getReader()
  const decoder = new TextDecoder("utf-8", { fatal: true })
  let bytes = 0
  let output = ""
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > maxBytes) throw new BodyLimitError()
      output += decoder.decode(value, { stream: true })
    }
    return output + decoder.decode()
  } catch (error) {
    await reader.cancel().catch(() => {})
    throw error
  } finally { reader.releaseLock() }
}

export function smtpAcceptedRecipient(info, recipient) {
  return !!info && Array.isArray(info.accepted) && info.accepted.length === 1 &&
    typeof info.accepted[0] === "string" && info.accepted[0].toLowerCase() === recipient.toLowerCase() &&
    Array.isArray(info.rejected) && info.rejected.length === 0
}

function resultResponse(native, statusCode, result, extraHeaders = {}) {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extraHeaders }
  if (native) {
    const state = result.status === "sent" ? "sent" : result.status === "configuration_required" ? "unavailable" : statusCode === 422 || statusCode === 413 ? "invalid" : "error"
    return new Response(null, { status: 303, headers: { ...headers, Location: `${FORM_PATH}?status=${state}` } })
  }
  return Response.json(result, { status: statusCode, headers })
}

/**
 * @param {{recipient: string, sendMail: (contact: {name: string, email: string, subject: string, message: string, formUrl: string}, options: {signal: AbortSignal}) => Promise<unknown>, timeoutMs?: number, rateLimiter?: ReturnType<typeof createContactRateLimiter>}} options
 * @returns {(request: Request) => Promise<Response>}
 */
export function createContactHandler({ recipient, sendMail, timeoutMs = 12_000, rateLimiter = createContactRateLimiter() }) {
  if (!validEmail(recipient) || recipient !== recipient.trim()) throw new Error("A valid fixed contact recipient is required")
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("A positive provider timeout is required")
  if (typeof sendMail !== "function") throw new Error("A server-side mail sender is required")

  return async function handleContact(request) {
    const format = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase()
    const native = format === "application/x-www-form-urlencoded"
    const respond = (status, result, headers) => resultResponse(native, status, result, headers)
    if (format !== "application/json" && !native) return respond(415, { status: "error", message: messages.unsupported })
    const origin = resolveContactOrigin(request)
    if (!origin) return respond(403, { status: "error", message: messages.origin })

    let input
    try {
      const text = await boundedText(request, MAX_CONTACT_BODY_BYTES)
      if (native) {
        const form = new URLSearchParams(text)
        if (FIELD_NAMES.some((name) => form.getAll(name).length > 1)) return respond(422, { status: "error", message: messages.invalid })
        input = Object.fromEntries(form)
      } else input = JSON.parse(text)
    } catch (error) {
      return respond(error instanceof BodyLimitError ? 413 : 422, { status: "error", message: error instanceof BodyLimitError ? messages.oversized : messages.invalid })
    }
    const validated = validateContactInput(input)
    if (validated.errors) return respond(422, { status: "error", message: validated.honeypot ? messages.blocked : messages.invalid, errors: validated.errors })
    const quota = rateLimiter.consume(clientKey(request))
    if (!quota.allowed) return respond(429, { status: "error", message: messages.limited }, { "Retry-After": String(quota.retryAfter) })

    const values = validated.values
    const contact = {
      name: values.name, email: values.email, subject: values.subject, message: values.message,
      formUrl: new URL(FORM_PATH, origin).href,
    }
    const controller = new AbortController()
    const abort = () => controller.abort()
    request.signal.addEventListener("abort", abort, { once: true })
    if (request.signal.aborted) abort()
    let timedOut = false
    let timer
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => { timedOut = true; controller.abort(); reject(new Error("Contact provider timed out")) }, timeoutMs)
    })
    try {
      const acknowledgement = await Promise.race([sendMail(contact, { signal: controller.signal }), deadline])
      return smtpAcceptedRecipient(acknowledgement, recipient)
        ? respond(200, { status: "sent", message: messages.sent })
        : respond(502, { status: "error", message: messages.provider })
    } catch (error) {
      if (error?.code === "CONTACT_CONFIGURATION_REQUIRED") return respond(503, { status: "configuration_required", message: messages.configuration })
      if (["EAUTH", "ENOAUTH", "ECONFIG"].includes(error?.code) || [534, 535].includes(error?.responseCode)) return respond(503, { status: "error", message: messages.provider })
      const timeout = timedOut || error?.code === "ETIMEDOUT" || error?.name === "TimeoutError"
      return respond(timeout ? 504 : 502, { status: "error", message: timeout ? messages.timeout : messages.provider })
    } finally {
      clearTimeout(timer)
      request.signal.removeEventListener("abort", abort)
    }
  }
}
