import test, { after } from "node:test"
import assert from "node:assert/strict"
import {
  createContactHandler,
  createContactRateLimiter,
  MAX_CONTACT_BODY_BYTES,
  resolveContactOrigin,
  smtpAcceptedRecipient,
  validateContactInput,
} from "../lib/contact-service.mjs"

// SMTP is mocked and this additional guard forbids a regression to real HTTP delivery.
const originalFetch = globalThis.fetch
globalThis.fetch = () => { throw new Error("Real network access is forbidden in contact-service tests") }
after(() => { globalThis.fetch = originalFetch })

const recipient = "owner@example.test"
const acceptedReceipt = () => ({ accepted: [recipient], rejected: [], messageId: "mock-message-only" })
const fixture = () => ({ name: "Ada Lovelace", email: "ada@example.test", subject: "An AI project", message: "I would like to discuss a data engineering project.", website: "" })
const noSend = async () => { throw new Error("Mail sender must not be called") }
const codedError = (code, message = "Mock SMTP failure") => Object.assign(new Error(message), { code })

function request(input = fixture(), { native = false, headers: extra = {}, raw, url = "http://localhost:3001/api/contact", body } = {}) {
  const headers = new Headers({
    "content-type": native ? "application/x-www-form-urlencoded;charset=UTF-8" : "application/json",
    host: "portfolio.example", origin: "https://portfolio.example", "x-forwarded-proto": "https",
    "cf-connecting-ip": "203.0.113.7",
  })
  for (const [name, value] of Object.entries(extra)) {
    if (value === null) headers.delete(name)
    else headers.set(name, value)
  }
  return new Request(url, {
    method: "POST", headers,
    body: body ?? raw ?? (native ? new URLSearchParams(input).toString() : JSON.stringify(input)),
    ...(body instanceof ReadableStream ? { duplex: "half" } : {}),
  })
}

function mockHandler(info = acceptedReceipt(), options = {}) {
  const calls = []
  const handler = createContactHandler({
    recipient,
    sendMail: async (contact, settings) => { calls.push({ contact, settings }); return info },
    ...options,
  })
  return { handler, calls }
}

test("reports sent only after SMTP explicitly accepts the fixed recipient without rejection", async () => {
  const { handler, calls } = mockHandler()
  const response = await handler(request())
  assert.equal(response.status, 200)
  assert.equal((await response.json()).status, "sent")
  assert.equal(calls.length, 1)
  assert.equal(response.headers.get("cache-control"), "no-store")
  assert.equal(smtpAcceptedRecipient({ accepted: [recipient.toUpperCase()], rejected: [] }, recipient), true)
})

for (const info of [
  null, true, {}, { messageId: "not-enough" }, { success: true },
  { accepted: [], rejected: [] },
  { accepted: ["other@example.test"], rejected: [] },
  { accepted: [recipient], rejected: [recipient] },
  { accepted: [recipient, "other@example.test"], rejected: [] },
  { accepted: [recipient] },
]) {
  test("does not infer SMTP delivery from " + JSON.stringify(info), async () => {
    const { handler } = mockHandler(info)
    const response = await handler(request())
    assert.equal(response.status, 502)
    assert.equal((await response.json()).status, "error")
  })
}

test("passes only validated contact fields and a public form URL to the fixed server mail sender", async () => {
  const input = { ...fixture(), to: "attacker@example.test", cc: "attacker@example.test", bcc: "attacker@example.test", from: "attacker@example.test", replyTo: "attacker@example.test", html: "<b>Injected</b>", auth: { pass: "injected" }, attachments: ["private.txt"] }
  const { handler, calls } = mockHandler()
  await handler(request(input, { headers: { host: "localhost:3001", "x-forwarded-host": "public-preview.trycloudflare.com", origin: "https://public-preview.trycloudflare.com" } }))
  assert.equal(calls.length, 1)
  assert.deepEqual(Object.keys(calls[0].contact).sort(), ["name", "email", "subject", "message", "formUrl"].sort())
  assert.equal(calls[0].contact.formUrl, "https://public-preview.trycloudflare.com/contact/message")
  assert.equal(calls[0].contact.email, input.email)
  assert.equal(calls[0].contact.subject, input.subject)
  assert.equal(calls[0].settings.signal instanceof AbortSignal, true)
})

test("honors the public Host header when Next request.url remains localhost", () => {
  assert.equal(resolveContactOrigin(request()), "https://portfolio.example")
})

for (const [name, headers] of [
  ["a foreign Origin", { origin: "https://attacker.example" }],
  ["an opaque Origin", { origin: "null" }],
  ["an Origin with a path", { origin: "https://portfolio.example/other" }],
  ["cross-site browser metadata", { "sec-fetch-site": "cross-site" }],
  ["a mismatched protocol", { origin: "http://portfolio.example" }],
  ["an ambiguous forwarded host", { "x-forwarded-host": "portfolio.example,attacker.example" }],
  ["host credentials", { "x-forwarded-host": "user@portfolio.example" }],
  ["host path injection", { "x-forwarded-host": "portfolio.example/elsewhere" }],
  ["missing Origin and Referer", { origin: null }],
]) {
  test(`blocks ${name} without calling the provider`, async () => {
    const handler = createContactHandler({ recipient, sendMail: noSend })
    const response = await handler(request(fixture(), { headers }))
    assert.equal(response.status, 403)
    assert.equal((await response.json()).status, "error")
  })
}

test("supports a same-origin native Referer without exposing its query in _url", async () => {
  const { handler, calls } = mockHandler()
  const response = await handler(request(fixture(), { native: true, headers: { origin: null, referer: "https://portfolio.example/contact/message?email=private" } }))
  assert.equal(response.status, 303)
  assert.equal(calls[0].contact.formUrl, "https://portfolio.example/contact/message")
  assert.equal(response.headers.get("location"), "/contact/message?status=sent")
})

const invalidInputs = [
  ["short name", { name: "A" }, "name"],
  ["long name", { name: "a".repeat(101) }, "name"],
  ["name header injection", { name: "Ada\r\nBcc: other@example.test" }, "name"],
  ["malformed email", { email: "not-an-address" }, "email"],
  ["email header injection", { email: "ada@example.test\r\nBcc:other@example.test" }, "email"],
  ["display-name email", { email: "Other <ada@example.test>" }, "email"],
  ["empty subject", { subject: "   " }, "subject"],
  ["long subject", { subject: "a".repeat(161) }, "subject"],
  ["subject header injection", { subject: "Hello\r\nBcc: other@example.test" }, "subject"],
  ["short message", { message: "Too short" }, "message"],
  ["long message", { message: "a".repeat(5001) }, "message"],
  ["message control character", { message: "Hello\u0000there, this is invalid" }, "message"],
  ["non-string name", { name: { value: "Ada" } }, "name"],
]
for (const [name, update, field] of invalidInputs) {
  test(`validates ${name}`, async () => {
    const handler = createContactHandler({ recipient, sendMail: noSend })
    const response = await handler(request({ ...fixture(), ...update }))
    const result = await response.json()
    assert.equal(response.status, 422)
    assert.equal(result.status, "error")
    assert.equal(typeof result.errors[field], "string")
  })
}

test("accepts boundary lengths and preserves legitimate Unicode", () => {
  const maxEmail = `${"l".repeat(64)}@${"a".repeat(63)}.${"b".repeat(63)}.${"c".repeat(61)}`
  assert.equal(maxEmail.length, 254)
  assert.ok(validateContactInput({ ...fixture(), name: "张三", email: maxEmail, subject: "s".repeat(160), message: "界".repeat(5000) }).values)
  assert.ok(validateContactInput({ ...fixture(), name: "n".repeat(100), message: "1234567890" }).values)
  assert.ok(validateContactInput({ ...fixture(), email: maxEmail + "x" }).errors.email)
})

test("normalizes native textarea CRLF before applying the character limit", () => {
  const result = validateContactInput({ ...fixture(), message: `a${"\r\n".repeat(4998)}b` })
  assert.equal(result.values.message.length, 5000)
  assert.equal(result.values.message.includes("\r"), false)
})

test("the server honeypot never reaches the provider and never claims delivery", async () => {
  const handler = createContactHandler({ recipient, sendMail: noSend })
  const response = await handler(request({ ...fixture(), website: "https://spam.example" }))
  assert.equal(response.status, 422)
  assert.equal((await response.json()).status, "error")
})

for (const input of [null, [], "message", {}]) {
  test(`rejects a non-form JSON payload ${JSON.stringify(input)}`, async () => {
    const handler = createContactHandler({ recipient, sendMail: noSend })
    assert.equal((await handler(request(input))).status, 422)
  })
}

test("rejects malformed JSON and unsupported content types before sending", async () => {
  const handler = createContactHandler({ recipient, sendMail: noSend })
  assert.equal((await handler(request({}, { raw: "{broken" }))).status, 422)
  assert.equal((await handler(request(fixture(), { headers: { "content-type": "text/plain" } }))).status, 415)
})

test("enforces declared and streamed body limits rather than trusting Content-Length", async () => {
  const handler = createContactHandler({ recipient, sendMail: noSend })
  assert.equal((await handler(request(fixture(), { headers: { "content-length": String(MAX_CONTACT_BODY_BYTES + 1) } }))).status, 413)
  let cancelled = false
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_CONTACT_BODY_BYTES + 1)) }, cancel() { cancelled = true } })
  assert.equal((await handler(request({}, { body: stream }))).status, 413)
  assert.equal(cancelled, true)
})

test("a maximally sized URL-encoded Unicode message fits the byte budget", async () => {
  const { handler, calls } = mockHandler()
  const response = await handler(request({ ...fixture(), message: "界".repeat(5000) }, { native: true }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/contact/message?status=sent")
  assert.equal(calls[0].contact.message.length, 5000)
})

test("rejects duplicate native visitor fields, including a masked honeypot", async () => {
  const handler = createContactHandler({ recipient, sendMail: noSend })
  const form = new URLSearchParams(fixture()); form.append("website", "spam")
  const response = await handler(request({}, { native: true, raw: form.toString() }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/contact/message?status=invalid")
})

test("rate limits validated attempts and supplies a retry delay", async () => {
  const { handler, calls } = mockHandler(acceptedReceipt(), { rateLimiter: createContactRateLimiter({ limit: 2 }) })
  assert.equal((await handler(request())).status, 200)
  assert.equal((await handler(request())).status, 200)
  const blocked = await handler(request())
  assert.equal(blocked.status, 429)
  assert.ok(Number(blocked.headers.get("retry-after")) > 0)
  assert.equal(calls.length, 2)
})

test("limiter memory is bounded and expired entries can be reused", () => {
  let time = 0
  const limiter = createContactRateLimiter({ limit: 2, windowMs: 1000, maxEntries: 2, now: () => time })
  assert.equal(limiter.consume("first").allowed, true)
  assert.equal(limiter.consume("second").allowed, true)
  assert.equal(limiter.consume("third").allowed, false)
  assert.equal(limiter.size, 2)
  time = 1001
  assert.equal(limiter.consume("third").allowed, true)
  assert.equal(limiter.size, 1)
})

test("network failure is an honest error and is not retried", async () => {
  let attempts = 0
  const handler = createContactHandler({ recipient, sendMail: async () => { attempts++; throw codedError("ECONNECTION") } })
  const response = await handler(request())
  assert.equal(response.status, 502)
  assert.equal((await response.json()).status, "error")
  assert.equal(attempts, 1)
})

test("missing SMTP configuration returns unavailable rather than sent", async () => {
  const handler = createContactHandler({ recipient, sendMail: async () => { throw codedError("CONTACT_CONFIGURATION_REQUIRED", "Private configuration detail") } })
  const response = await handler(request())
  assert.equal(response.status, 503)
  const result = await response.json()
  assert.equal(result.status, "configuration_required")
  assert.equal(JSON.stringify(result).includes("Private configuration"), false)
})

for (const code of ["EAUTH", "ENOAUTH", "ECONFIG"]) {
  test("SMTP " + code + " returns a generic 503 without leaking credentials", async () => {
    const handler = createContactHandler({ recipient, sendMail: async () => { throw codedError(code, "Secret user and password details must stay private") } })
    const response = await handler(request())
    assert.equal(response.status, 503)
    const result = await response.json()
    assert.equal(result.status, "error")
    assert.equal(JSON.stringify(result).includes("Secret"), false)
  })
}

test("a native SMTP timeout maps to 504", async () => {
  const handler = createContactHandler({ recipient, sendMail: async () => { throw codedError("ETIMEDOUT") } })
  assert.equal((await handler(request())).status, 504)
})

test("the request deadline aborts a mail sender that does not settle", async () => {
  let signal
  const handler = createContactHandler({ recipient, timeoutMs: 5, sendMail: async (_contact, settings) => { signal = settings.signal; return new Promise(() => {}) } })
  const response = await handler(request())
  assert.equal(response.status, 504)
  assert.equal((await response.json()).status, "error")
  assert.equal(signal.aborted, true)
})

for (const [info, status] of [[acceptedReceipt(), "sent"], [{ accepted: [], rejected: [recipient] }, "error"]]) {
  test("native forms use a safe status-only redirect for " + status, async () => {
    const { handler } = mockHandler(info)
    const response = await handler(request(fixture(), { native: true }))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get("location"), "/contact/message?status=" + status)
    assert.equal(await response.text(), "")
    assert.equal(response.headers.get("location").includes("ada"), false)
  })
}

test("native missing configuration redirects to unavailable without PII", async () => {
  const handler = createContactHandler({ recipient, sendMail: async () => { throw codedError("CONTACT_CONFIGURATION_REQUIRED") } })
  const response = await handler(request(fixture(), { native: true }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/contact/message?status=unavailable")
})

test("native invalid submissions redirect without putting visitor data in URLs", async () => {
  const handler = createContactHandler({ recipient, sendMail: noSend })
  const response = await handler(request({ ...fixture(), name: "A" }, { native: true }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/contact/message?status=invalid")
})
