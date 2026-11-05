import test from "node:test"
import assert from "node:assert/strict"
import { EventEmitter } from "node:events"
import { buildGmailMessage, createGmailSender, readGmailSmtpConfig } from "../lib/gmail-smtp.mjs"
import { createContactHandler } from "../lib/contact-service.mjs"

// All credentials and transport acknowledgements below are fixtures. No real
// transport is constructed, no TLS connection is opened, and verify is never run.
const recipient = "owner@example.test"
const envFixture = () => ({ GMAIL_USER: "sender@example.test", GMAIL_APP_PASSWORD: "abcd efgh ijkl mnop" })
const contact = () => ({ name: "Ada Lovelace", email: "ada@example.test", subject: "A data project", message: "Let us discuss a useful data engineering project.", formUrl: "https://portfolio.example/contact/message" })
const receipt = () => ({ accepted: [recipient], rejected: [], messageId: "mock-only" })

class MockSocket extends EventEmitter {
  authorized = true
  destroyed = false
  destroy() { this.destroyed = true; return this }
}

function senderFixture(options = {}, send = async () => receipt()) {
  const calls = { transports: [], messages: [], sockets: [], closed: 0, verified: 0 }
  const sender = createGmailSender({
    recipient,
    readEnv: envFixture,
    createTransport(settings) {
      calls.transports.push(settings)
      return {
        sendMail(message) { calls.messages.push(message); return send(settings, message) },
        close() { calls.closed++ },
        verify() { calls.verified++; throw new Error("Verification is forbidden in this test") },
      }
    },
    openTlsSocket() { throw new Error("Unexpected TLS attempt: every socket must be explicitly mocked") },
    ...options,
  })
  return { sender, calls }
}

test("reads grouped App Passwords and defaults the SMTP user to the fixed recipient", () => {
  assert.deepEqual(readGmailSmtpConfig({ GMAIL_APP_PASSWORD: "abcd efgh ijkl mnop" }, recipient), { user: recipient, password: "abcdefghijklmnop" })
})

for (const invalid of [
  {}, { GMAIL_APP_PASSWORD: "" }, { GMAIL_APP_PASSWORD: "too-short" },
  { GMAIL_APP_PASSWORD: "abcd\tefghijklmnop" },
  { GMAIL_APP_PASSWORD: "abcdefghijklmnop\n" },
  { GMAIL_APP_PASSWORD: "abcd!efghijklmnO" },
  { GMAIL_USER: "not-an-email", GMAIL_APP_PASSWORD: "abcdefghijklmnop" },
  { GMAIL_USER: "sender@example.test\r\nBcc:other@example.test", GMAIL_APP_PASSWORD: "abcdefghijklmnop" },
]) {
  test("invalid or missing local configuration never constructs a transport: " + Object.keys(invalid).join(","), async () => {
    const { sender, calls } = senderFixture({ readEnv: () => invalid })
    await assert.rejects(sender(contact()), (error) => error.code === "CONTACT_CONFIGURATION_REQUIRED" && !error.message.includes("abcdefghijklmnop"))
    assert.equal(calls.transports.length, 0)
    assert.equal(calls.verified, 0)
  })
}

test("credentials are read per send, so an initially empty configuration is not frozen", async () => {
  let environment = {}
  const { sender, calls } = senderFixture({ readEnv: () => environment })
  await assert.rejects(sender(contact()), (error) => error.code === "CONTACT_CONFIGURATION_REQUIRED")
  environment = envFixture()
  await sender(contact())
  environment = { GMAIL_USER: "changed@example.test", GMAIL_APP_PASSWORD: "ponm lkji hgfe dcba" }
  await sender(contact())
  assert.equal(calls.transports.length, 2)
  assert.equal(calls.transports[0].auth.user, "sender@example.test")
  assert.equal(calls.transports[1].auth.user, "changed@example.test")
  assert.equal(calls.closed, 2)
})

test("configures only Gmail port 465 with verified TLS, bounded timeouts and no debug logging", async () => {
  const { sender, calls } = senderFixture({ readEnv: () => ({ ...envFixture(), GMAIL_HOST: "attacker.example" }) })
  await sender(contact())
  const settings = calls.transports[0]
  assert.equal(settings.host, "smtp.gmail.com")
  assert.equal(settings.port, 465)
  assert.equal(settings.secure, true)
  assert.equal(settings.pool, false)
  assert.deepEqual(settings.tls, { servername: "smtp.gmail.com", rejectUnauthorized: true, minVersion: "TLSv1.2" })
  for (const key of ["connectionTimeout", "greetingTimeout", "dnsTimeout", "socketTimeout"]) assert.ok(settings[key] > 0 && settings[key] <= 10_000)
  assert.equal(settings.auth.pass, "abcdefghijklmnop")
  assert.equal(settings.disableFileAccess, true)
  assert.equal(settings.disableUrlAccess, true)
  assert.equal(settings.maxRecipients, 1)
  assert.equal(settings.logger, false)
  assert.equal(settings.debug, false)
  assert.equal(calls.verified, 0)
})

test("constructs a fixed-recipient plain-text message using authenticated From and visitor Reply-To", () => {
  const input = { ...contact(), from: "attacker@example.test", to: "attacker@example.test", cc: "attacker@example.test", bcc: "attacker@example.test", attachments: ["private.txt"], html: "<script>bad</script>" }
  const message = buildGmailMessage(input, "authenticated@example.test", recipient)
  assert.deepEqual(message.from, { name: "Portfolio contact", address: "authenticated@example.test" })
  assert.equal(message.to, recipient)
  assert.deepEqual(message.envelope, { from: "authenticated@example.test", to: [recipient] })
  assert.deepEqual(message.replyTo, { name: input.name, address: input.email })
  assert.equal(message.subject, "Portfolio inquiry: A data project")
  assert.match(message.text, /Name: Ada Lovelace/)
  assert.match(message.text, /Email: ada@example\.test/)
  assert.ok(message.text.includes(input.message))
  assert.ok(message.text.includes(input.formUrl))
  for (const key of ["html", "attachments", "cc", "bcc", "auth"]) assert.equal(Object.hasOwn(message, key), false)
})

test("header injection is rejected even if the SMTP message builder is called directly", () => {
  assert.throws(() => buildGmailMessage({ ...contact(), subject: "Hi\r\nBcc:other@example.test" }, "sender@example.test", recipient), (error) => error.code === "EMESSAGE")
})

test("uses a verified TLS socket through the supported Nodemailer getSocket hook", async () => {
  const socket = new MockSocket()
  let socketOptions, callbackCount = 0
  const { sender, calls } = senderFixture({ openTlsSocket: (options) => { socketOptions = options; queueMicrotask(() => socket.emit("secureConnect")); return socket } }, (settings) => new Promise((resolve, reject) => {
    settings.getSocket(settings, (error, connection) => {
      callbackCount++
      if (error) return reject(error)
      assert.equal(connection.connection, socket)
      assert.equal(connection.secured, true)
      resolve(receipt())
    })
  }))
  assert.deepEqual(await sender(contact()), receipt())
  assert.deepEqual(socketOptions, { host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com", rejectUnauthorized: true, minVersion: "TLSv1.2" })
  assert.equal(callbackCount, 1)
  assert.equal(socket.destroyed, true)
  assert.equal(calls.closed, 1)
})

test("never hands an unverified TLS socket to SMTP authentication", async () => {
  const socket = new MockSocket(); socket.authorized = false
  const { sender, calls } = senderFixture({ openTlsSocket: () => { queueMicrotask(() => socket.emit("secureConnect")); return socket } }, (settings) => new Promise((resolve, reject) => {
    settings.getSocket(settings, (error) => error ? reject(error) : resolve(receipt()))
  }))
  await assert.rejects(sender(contact()), (error) => error.code === "ETLS")
  assert.equal(socket.destroyed, true)
  assert.equal(calls.closed, 1)
})

test("an SMTP deadline closes an in-flight handshake and does not retry", async () => {
  const socket = new MockSocket()
  let callbacks = 0
  const { sender, calls } = senderFixture({ timeoutMs: 5, openTlsSocket: () => socket }, (settings) => new Promise((resolve, reject) => {
    settings.getSocket(settings, (error) => { callbacks++; if (error) reject(error); else resolve(receipt()) })
  }))
  await assert.rejects(sender(contact()), (error) => error.code === "ETIMEDOUT")
  socket.emit("secureConnect")
  assert.equal(callbacks, 1)
  assert.equal(socket.destroyed, true)
  assert.equal(calls.closed, 1)
  assert.equal(calls.messages.length, 1)
})

test("request cancellation destroys the socket and releases the transport", async () => {
  const socket = new MockSocket(), controller = new AbortController()
  const { sender, calls } = senderFixture({ openTlsSocket: () => socket }, (settings) => new Promise((resolve, reject) => {
    settings.getSocket(settings, (error) => error ? reject(error) : resolve(receipt()))
  }))
  const delivery = sender(contact(), { signal: controller.signal })
  controller.abort()
  await assert.rejects(delivery, (error) => error.code === "ECONNECTION")
  assert.equal(socket.destroyed, true)
  assert.equal(calls.closed, 1)
})

test("SMTP failures close the transport without invoking verify or a second send", async () => {
  const { sender, calls } = senderFixture({}, async () => { throw Object.assign(new Error("Mock authentication failure"), { code: "EAUTH" }) })
  await assert.rejects(sender(contact()), (error) => error.code === "EAUTH")
  assert.equal(calls.closed, 1)
  assert.equal(calls.messages.length, 1)
  assert.equal(calls.verified, 0)
})

test("the actual handler and missing-config adapter return 503 without network activity", async () => {
  const { sender, calls } = senderFixture({ readEnv: () => ({}) })
  const handler = createContactHandler({ recipient, sendMail: sender })
  const response = await handler(new Request("https://portfolio.example/api/contact", {
    method: "POST", headers: { "content-type": "application/json", origin: "https://portfolio.example" },
    body: JSON.stringify(contact()),
  }))
  assert.equal(response.status, 503)
  assert.equal((await response.json()).status, "configuration_required")
  assert.equal(calls.transports.length, 0)
})
