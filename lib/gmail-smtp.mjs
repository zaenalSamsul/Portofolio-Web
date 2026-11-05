import { connect as connectTls } from "node:tls"
import nodemailer from "nodemailer"

const SMTP_HOST = "smtp.gmail.com"
const SMTP_PORT = 465
const CONFIGURATION_ERROR = "CONTACT_CONFIGURATION_REQUIRED"
const HEADER_CONTROLS = /[\u0000-\u001f\u007f\u2028\u2029]/u

function configurationError() {
  const error = new Error("Email sending configuration is unavailable")
  error.code = CONFIGURATION_ERROR
  return error
}

function smtpError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

/** Read server-only credentials on every send, never when the route module is imported. */
export function readGmailSmtpConfig(env, defaultUser) {
  const configuredUser = env?.GMAIL_USER
  if (configuredUser !== undefined && typeof configuredUser !== "string") throw configurationError()
  const user = typeof configuredUser === "string" && configuredUser.trim() ? configuredUser.trim() : defaultUser
  const rawPassword = env?.GMAIL_APP_PASSWORD
  const password = typeof rawPassword === "string" ? rawPassword.replace(/ /g, "") : ""
  if (typeof user !== "string" || user.length > 254 || HEADER_CONTROLS.test(configuredUser ?? user) || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(user) || !/^[a-z0-9]{16}$/i.test(password)) throw configurationError()
  return { user, password }
}

export function buildGmailMessage(contact, user, recipient) {
  if ([contact.name, contact.email, contact.subject].some((value) => typeof value !== "string" || HEADER_CONTROLS.test(value))) throw smtpError("EMESSAGE", "Invalid message fields")
  return {
    from: { name: "Portfolio contact", address: user },
    to: recipient,
    replyTo: { name: contact.name, address: contact.email },
    subject: `Portfolio inquiry: ${contact.subject}`,
    text: [
      "Portfolio contact message", "",
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Subject: ${contact.subject}`, "",
      "Message:", contact.message, "",
      `Submitted from: ${contact.formUrl}`,
    ].join("\n"),
    envelope: { from: user, to: [recipient] },
    disableFileAccess: true,
    disableUrlAccess: true,
  }
}

/**
 * Constructing this function does not connect, authenticate, verify, or send.
 * getSocket is a supported Nodemailer hook; retaining the TLS socket allows a
 * request deadline to actually close an in-flight non-pooled SMTP connection.
 */
export function createGmailSender({
  recipient,
  readEnv = () => process.env,
  createTransport = (options) => nodemailer.createTransport(options),
  openTlsSocket = (options) => connectTls(options),
  timeoutMs = 10_000,
}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("A positive SMTP timeout is required")
  if (typeof recipient !== "string" || HEADER_CONTROLS.test(recipient) || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(recipient)) throw new Error("A valid fixed recipient is required")

  return async function sendGmail(contact, { signal } = {}) {
    let config
    try { config = readGmailSmtpConfig(readEnv(), recipient) } catch { throw configurationError() }
    const { user, password } = config
    if (signal?.aborted) throw smtpError("ECONNECTION", "Sending was cancelled")
    let transport
    let socket
    let cancelled = false
    let closed = false
    let timer
    let rejectCancellation
    let cancelHandshake = () => {}
    const cancellation = new Promise((_, reject) => { rejectCancellation = reject })
    const close = () => {
      if (closed) return
      closed = true
      socket?.on("error", () => {})
      socket?.destroy()
      try { transport?.close() } catch { /* Cleanup must not replace the delivery outcome. */ }
    }
    const cancel = (error) => {
      if (cancelled) return
      cancelled = true
      try { cancelHandshake(error) } finally { close(); rejectCancellation(error) }
    }
    const onAbort = () => cancel(smtpError("ECONNECTION", "Sending was cancelled"))
    signal?.addEventListener("abort", onAbort, { once: true })
    timer = setTimeout(() => cancel(smtpError("ETIMEDOUT", "SMTP sending timed out")), timeoutMs)

    try {
      const tls = { servername: SMTP_HOST, rejectUnauthorized: true, minVersion: "TLSv1.2" }
      transport = createTransport({
        host: SMTP_HOST, port: SMTP_PORT, secure: true, pool: false,
        auth: { user, pass: password },
        tls,
        connectionTimeout: timeoutMs,
        greetingTimeout: Math.min(timeoutMs, 8000),
        dnsTimeout: Math.min(timeoutMs, 5000),
        socketTimeout: timeoutMs,
        logger: false, debug: false, transactionLog: false,
        disableFileAccess: true, disableUrlAccess: true, maxRecipients: 1,
        getSocket(_options, callback) {
          if (cancelled || signal?.aborted) { callback(smtpError("ECONNECTION", "Sending was cancelled")); return }
          let returned = false
          const finish = (error, connected) => {
            if (returned) return
            returned = true
            socket?.removeListener("error", onSocketError)
            socket?.removeListener("secureConnect", onSecure)
            callback(error, connected)
          }
          const onSocketError = (error) => finish(error)
          cancelHandshake = (error) => finish(error)
          const onSecure = () => {
            if (cancelled || signal?.aborted) { socket.destroy(); finish(smtpError("ECONNECTION", "Sending was cancelled")); return }
            if (socket.authorized !== true) { socket.destroy(); finish(smtpError("ETLS", "SMTP certificate could not be verified")); return }
            finish(null, { connection: socket, secured: true })
          }
          try {
            socket = openTlsSocket({ host: SMTP_HOST, port: SMTP_PORT, ...tls })
            socket.once("error", onSocketError)
            socket.once("secureConnect", onSecure)
          } catch (error) { finish(error) }
        },
      })
      const message = buildGmailMessage(contact, user, recipient)
      return await Promise.race([transport.sendMail(message), cancellation])
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener("abort", onAbort)
      close()
    }
  }
}
