import { expect, test, type Page } from "@playwright/test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001"
const email = "zaenalsyamsyularief@gmail.com"
const featuredSlugs = ["modnance", "stuntlytics", "mycareai", "data-pipeline-sentiment-analysis"]
const projectSlugs = [...featuredSlugs, "hybrid-recommendation-system"]
const publicPaths = ["/", "/work", "/about", "/contact", ...projectSlugs.map((slug) => `/projects/${slug}`)]
const messagePath = "/contact/message"
const pagePaths = [...publicPaths, messagePath]
const browserErrors = new WeakMap<Page, string[]>()
const expectedContactFailures = new WeakMap<Page, Set<number>>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  browserErrors.set(page, errors)
  expectedContactFailures.set(page, new Set())
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() !== "error") return
    const status = message.text().match(/status of (\d{3})/)
    if (message.location().url.split("?")[0].endsWith("/api/contact") && status && expectedContactFailures.get(page)?.has(Number(status[1]))) return
    errors.push(message.text())
  })
})

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page) ?? [], "Public pages must not produce browser errors").toEqual([])
})

async function focusByKeyboard(page: Page, selector: string) {
  for (let step = 0; step < 24; step++) {
    if (await page.locator(selector).evaluate((element) => document.activeElement === element)) return
    await page.keyboard.press("Tab")
  }
  await expect(page.locator(selector)).toBeFocused()
}

type ContactResponse = {
  status: "sent" | "configuration_required" | "error"
  message: string
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>
}

const testMessage = {
  name: "Portfolio Test Visitor",
  email: "portfolio-test@example.com",
  subject: "Automated portfolio test",
  message: "This is an intercepted browser regression and must not be delivered.",
}

async function mockContactAPI(page: Page, httpStatus: number, response: ContactResponse, gate?: Promise<void>) {
  const submissions: Array<Record<string, unknown>> = []
  const unexpectedPosts: string[] = []
  if (httpStatus >= 400) expectedContactFailures.get(page)?.add(httpStatus)
  // A second safety guard blocks a mistaken direct provider/form action.
  // No filled browser test can reach the real backend or send a message.
  await page.route("**/*", async (route) => {
    if (route.request().method() === "POST") {
      unexpectedPosts.push(route.request().url())
      await route.abort("blockedbyclient")
      return
    }
    await route.fallback()
  })
  await page.route("**/api/contact", async (route) => {
    let fields: Record<string, unknown> = {}
    try { fields = route.request().postDataJSON() as Record<string, unknown> } catch { /* Assertions below expose a request-format regression. */ }
    submissions.push(fields)
    if (gate) await gate
    await route.fulfill({ status: httpStatus, contentType: "application/json", body: JSON.stringify(response) })
  })
  return { submissions, unexpectedPosts }
}

async function fillContactForm(page: Page) {
  await page.getByRole("textbox", { name: "Name", exact: true }).fill(testMessage.name)
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(testMessage.email)
  await page.getByRole("textbox", { name: "Subject", exact: true }).fill(testMessage.subject)
  await page.getByRole("textbox", { name: "Message", exact: true }).fill(testMessage.message)
}

async function expectContactValues(page: Page, values = testMessage) {
  for (const key of ["name", "email", "subject", "message"] as const) {
    await expect(page.getByRole("textbox", { name: key[0].toUpperCase() + key.slice(1), exact: true })).toHaveValue(values[key])
  }
}

function auditGraphicsRequests(page: Page) {
  const graphicsBundles: string[] = []
  const wasmRequests: string[] = []
  const pendingReads: Promise<void>[] = []
  page.on("request", (request) => { if (/\.wasm(?:$|\?)/i.test(request.url())) wasmRequests.push(request.url()) })
  page.on("response", (response) => {
    if (!/\.js(?:$|\?)/i.test(response.url())) return
    pendingReads.push(response.body().then((body) => {
      if (/za-lanyard-engine-v1|rapier_wasm3d|THREE\.WebGLRenderer/.test(body.toString())) graphicsBundles.push(response.url())
    }).catch(() => { /* An aborted prefetch response has no body. */ }))
  })
  return async () => {
    await page.waitForLoadState("networkidle")
    await Promise.all(pendingReads)
    expect(graphicsBundles, "Editorial pages must not download obsolete graphics engines").toEqual([])
    expect(wasmRequests).toEqual([])
  }
}

test.describe("editorial pages and navigation", () => {
  test("Home presents large Work, About and Contact links that open their own pages", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Data & AI")
    const navigation = page.locator(".home-navigation")
    await expect(navigation.locator("a")).toHaveCount(3)
    for (const [label, href] of [["Work", "/work"], ["About", "/about"], ["Contact", "/contact"]]) {
      const link = navigation.locator(`a[href='${href}']`)
      await expect(link).toContainText(label)
      const bounds = await link.boundingBox()
      expect(bounds?.height, `${label} should be a prominent navigation target`).toBeGreaterThanOrEqual(44)
      await link.click()
      await expect(page).toHaveURL(new URL(href, baseURL).href)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      await page.goto("/")
    }
  })

  test("Work has four distinct featured case studies and preserves the Validator route", async ({ page }) => {
    await page.goto("/work")
    await expect(page.locator(".project-article")).toHaveCount(4)
    const video = page.locator(".project-stuntlytics .project-visual-video")
    await expect(video).toHaveAttribute("src", "/projects/stuntlytics-preview.mp4")
    await video.scrollIntoViewIfNeeded()
    await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.2)
    expect(await video.evaluate((element) => (element as HTMLVideoElement).controls && (element as HTMLVideoElement).muted)).toBe(true)
    await page.locator(".work-closing").scrollIntoViewIfNeeded()
    await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(true)
    const links = page.locator(".project-article .editorial-link")
    const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")))
    expect(hrefs).toEqual(featuredSlugs.map((slug) => `/projects/${slug}`))
    expect(new Set(hrefs).size).toBe(4)
    const openedTitles: string[] = []
    for (let index = 0; index < featuredSlugs.length; index++) {
      const title = await page.locator(".project-article h2").nth(index).innerText()
      await links.nth(index).click()
      await expect(page).toHaveURL(new URL(`/projects/${featuredSlugs[index]}`, baseURL).href)
      await expect(page.locator(".case-page h1")).toBeVisible()
      openedTitles.push(await page.locator(".case-page h1").innerText())
      expect(title).not.toBe("")
      await expect(page.locator(".case-back").first()).toHaveAttribute("href", "/work")
      await page.locator(".case-back").first().click()
      await expect(page).toHaveURL(new URL("/work", baseURL).href)
    }
    expect(new Set(openedTitles).size, "Distinct case routes must render distinct project titles").toBe(4)
  })

  test("Work keeps four equal preview frames aligned in two rows at desktop and tablet widths", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const width of [1440, 768]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto("/work")
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator(".project-visual")).toHaveCount(4)
      const frames = await page.locator(".project-visual").evaluateAll((elements) => elements.map((element) => {
        const { x, y, width, height, right, bottom } = element.getBoundingClientRect()
        return { x, y, width, height, right, bottom }
      }))
      const context = `${width}px work grid`
      expect(Math.max(...frames.map((frame) => frame.width)) - Math.min(...frames.map((frame) => frame.width)), `${context}: equal preview widths`).toBeLessThanOrEqual(1)
      expect(Math.max(...frames.map((frame) => frame.height)) - Math.min(...frames.map((frame) => frame.height)), `${context}: equal preview heights`).toBeLessThanOrEqual(1)
      for (const [left, right] of [[frames[0], frames[1]], [frames[2], frames[3]]]) {
        expect(Math.abs(left.y - right.y), `${context}: both previews start on the same row`).toBeLessThanOrEqual(1)
        expect(right.x, `${context}: columns do not overlap`).toBeGreaterThan(left.right)
      }
      for (const [top, bottom] of [[frames[0], frames[2]], [frames[1], frames[3]]]) {
        expect(Math.abs(top.x - bottom.x), `${context}: columns stay aligned between rows`).toBeLessThanOrEqual(1)
        expect(bottom.y, `${context}: the second row follows the first`).toBeGreaterThan(top.bottom)
      }
    }
  })

  test("primary navigation has visible keyboard focus and Enter follows native links", async ({ page }) => {
    await page.goto("/")
    await focusByKeyboard(page, ".home-navigation a[href='/work']")
    await expect(page.locator(".home-navigation a[href='/work']")).toBeFocused()
    const focus = await page.locator(".home-navigation a[href='/work']").evaluate((element) => {
      const style = getComputedStyle(element)
      return { visible: element.matches(":focus-visible"), outlineWidth: parseFloat(style.outlineWidth), outlineStyle: style.outlineStyle, boxShadow: style.boxShadow }
    })
    expect(focus.visible).toBe(true)
    expect((focus.outlineWidth > 0 && focus.outlineStyle !== "none") || focus.boxShadow !== "none").toBe(true)
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(new URL("/work", baseURL).href)
    await expect(page.locator(".header-links a[aria-current='page']")).toHaveAttribute("href", "/work")
    await page.locator(".header-links a[href='/work']").focus()
    await page.keyboard.press("Tab")
    await expect(page.locator(".header-links a[href='/about']")).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(new URL("/about", baseURL).href)
    await page.goBack()
    await expect(page).toHaveURL(new URL("/work", baseURL).href)
  })

  test("navigation reveals replay across routes and cancel immediately when reduced motion is enabled", async ({ page }) => {
    const waitForEntry = (pathname: string) => page.waitForFunction((expectedPathname) => {
      if (location.pathname !== expectedPathname) return null
      const scope = document.getElementById(`${expectedPathname.slice(1)}-title`)?.closest(".page-transition")
      return scope?.getAnimations({ subtree: true }).find((animation) =>
        animation.playState === "running" && !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition)
        && !(animation.effect as KeyframeEffect | null)?.target?.matches(".page-curtain"),
      ) ?? null
    }, pathname, { polling: "raf" })
    const waitForCurtain = (pathname: string) => page.waitForFunction((expectedPathname) => {
      if (location.pathname !== expectedPathname) return null
      const heading = document.getElementById(expectedPathname === "/" ? "hero-title" : `${expectedPathname.slice(1)}-title`)
      return heading?.closest(".page-transition")?.querySelector(".page-curtain")?.getAnimations().find((animation) => animation.playState === "running") ?? null
    }, pathname, { polling: "raf" })
    const curtainScale = () => page.locator(".page-curtain").evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).d)
    const finishEntries = () => page.locator(".page-transition").evaluate(async (element) => {
      await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})))
    })
    const hoverAndRelease = async (selector: string) => {
      const link = page.locator(selector)
      const text = link.locator(".sweep-text")
      await link.hover()
      await expect(text.locator(".sweep-text-fill")).toHaveCSS("clip-path", "inset(0px)")
      await expect.poll(() => text.evaluate((element) => {
        const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform)
        return transform.c < -0.1 && transform.e > 10
      }), "Mouse hover visibly skews and moves the text").toBe(true)
      await expect.poll(() => text.evaluate((element) => element.getAnimations().some((animation) => animation.playState === "running")), "Hover motion settles").toBe(false)
      const settled = await text.evaluate((element) => {
        const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform)
        return { skew: transform.c, x: transform.e }
      })
      expect(settled.skew).toBeCloseTo(Math.tan(-15 * Math.PI / 180), 3)
      expect(settled.x).toBeCloseTo(20, 1)
      await page.mouse.move(0, 0)
      await expect.poll(() => text.evaluate((element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).isIdentity && !element.getAnimations().some((animation) => animation.playState === "running"),
      ), "Text returns to its original position after the mouse leaves").toBe(true)
    }

    await page.goto("/", { waitUntil: "domcontentloaded" })
    const homeCurtain = await waitForCurtain("/")
    await expect(page.locator("html")).toHaveAttribute("data-motion", "active")
    await homeCurtain.evaluate((animation) => {
      animation!.pause()
      animation!.currentTime = Number(animation!.effect!.getTiming().duration) / 2
    })
    expect(await curtainScale(), "The opening curtain remains visible midway through its reveal").toBeGreaterThan(0)
    expect(await curtainScale()).toBeLessThan(1)
    await homeCurtain.evaluate((animation) => animation!.play())
    await finishEntries()
    await expect.poll(curtainScale, "The opening curtain fully clears the page").toBe(0)
    const originalDocument = await page.evaluateHandle(() => document)
    const work = page.locator(".home-navigation a[href='/work']")
    await page.mouse.move(0, 0)
    await hoverAndRelease(".home-navigation a[href='/work']")
    await expect(work).toHaveCSS("cursor", "pointer")

    const [workEntry, workCurtain] = await Promise.all([waitForEntry("/work"), waitForCurtain("/work"), work.click()])
    expect(await originalDocument.evaluate((documentAtStart) => documentAtStart === document), "Navigation should preserve the current document").toBe(true)
    expect(await workCurtain.evaluate((animation) => animation?.playState), "Pointer navigation plays the route curtain").toBe("running")
    expect(await curtainScale(), "The route curtain is visible after pointer navigation").toBeGreaterThan(0)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await finishEntries()
    await expect.poll(() => workEntry.evaluate((animation) => animation?.playState), "Completed reveals release their animation effects").toBe("idle")
    await hoverAndRelease(".work-closing .sweep-link")

    const [aboutEntry] = await Promise.all([
      waitForEntry("/about"),
      page.locator(".header-links a[href='/about']").click(),
    ])
    // Hold a real in-flight reveal so this checks cancellation rather than natural completion.
    await aboutEntry.evaluate((animation) => animation?.pause())
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect.poll(() => aboutEntry.evaluate((animation) => animation?.playState)).toBe("idle")
    await expect(page.locator("html")).toHaveAttribute("data-motion", "static")
    await expect.poll(() => page.locator(".page-transition").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0)
    await expect.poll(curtainScale, "Reduced motion immediately clears the curtain").toBe(0)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1")
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("transform", "none")

    const roles = page.locator(".experience-details h3 .role-highlight")
    await expect(roles).toHaveText(["Freelance Data & AI Engineer", "Artificial Intelligence Teaching Assistant", "Data Science Intern"])
    const roleStyles = await roles.evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element)
      const [red, green, blue] = style.color.match(/[\d.]+/g)!.map(Number)
      return { text: element.textContent, bold: Number(style.fontWeight) >= 600, green: green > red && green > blue }
    }))
    for (const role of roleStyles) {
      expect(role.bold, `${role.text} remains bold`).toBe(true)
      expect(role.green, `${role.text} uses the green role emphasis`).toBe(true)
    }

    await page.emulateMedia({ reducedMotion: "no-preference" })
    await expect(page.locator("html")).toHaveAttribute("data-motion", "active")
    const [contactEntry] = await Promise.all([
      waitForEntry("/contact"),
      page.locator(".header-links a[href='/contact']").click(),
    ])
    await contactEntry.evaluate((animation) => animation?.pause())
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect.poll(() => contactEntry.evaluate((animation) => animation?.playState)).toBe("idle")
    await expect.poll(curtainScale).toBe(0)
    await expect(page.locator(".contact-email")).toBeVisible()
  })

  test("About owns the original portrait, reviewed experience and skill evidence", async ({ page }) => {
    for (const pathname of ["/", "/work", "/contact"]) {
      await page.goto(pathname)
      await expect(page.locator("img[src*='zaenal-portrait']")).toHaveCount(0)
    }
    await page.goto("/about")
    const portrait = page.locator(".about-portrait-image")
    await expect(portrait).toHaveCount(1)
    await portrait.evaluate((element) => (element as HTMLImageElement).decode())
    expect(await portrait.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    await expect(page.locator(".experience-company")).toHaveText(["PURU Software Agency", "Institut Teknologi Garut", "NoLimit Indonesia"])
    await expect(page.locator(".experience-entry")).toHaveCount(3)
    await expect(page.locator(".skill-entry")).toHaveCount(4)
    const examples = await page.locator(".skill-evidence-links a").evaluateAll((elements) => elements.map((element) => element.getAttribute("href")))
    expect(examples.length).toBeGreaterThanOrEqual(4)
    for (const href of examples) expect(projectSlugs.map((slug) => `/projects/${slug}`)).toContain(href)
  })

  for (const [hash, destination, target] of [
    ["projects", "/work", "#work-title"],
    ["experience", "/about#experience", "#experience-title"],
    ["skills", "/about#skills", "#skills-title"],
    ["contact", "/contact", "#contact-title"],
  ]) {
    test(`legacy /#${hash} resolves to ${destination}`, async ({ page }) => {
      await page.goto(`/#${hash}`)
      await expect(page).toHaveURL(new URL(destination, baseURL).href)
      await expect(page.locator(target)).toBeInViewport()
    })
  }

  test("reduced motion keeps navigation readable without active CSS animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const pathname of ["/", "/work", "/about", "/contact", messagePath]) {
      await page.goto(pathname)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      const animations = await page.locator("main, main *").evaluateAll((elements) => elements.filter((element) => {
        const style = getComputedStyle(element)
        return style.animationName !== "none" && style.animationDuration.split(",").some((value) => parseFloat(value) > 0.15)
      }).map((element) => element.className))
      expect(animations, pathname).toEqual([])
      const transparentLinks = await page.locator("main a").evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).opacity === "0").map((element) => element.textContent))
      expect(transparentLinks, pathname).toEqual([])
      if (pathname === "/work") {
        const preview = page.locator(".project-visual-video")
        await preview.scrollIntoViewIfNeeded()
        await page.waitForTimeout(300)
        expect(await preview.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(true)
        await preview.evaluate((element) => (element as HTMLVideoElement).play())
        await expect.poll(() => preview.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.2)
        await preview.evaluate((element) => (element as HTMLVideoElement).pause())
      }
    }
  })

  test("all public pages omit the old scene and graphics engine downloads", async ({ page }) => {
    test.setTimeout(60_000)
    const finishAudit = auditGraphicsRequests(page)
    for (const pathname of pagePaths) {
      await page.goto(pathname)
      await expect(page.locator("canvas, .lanyard-experience, .hero-scene")).toHaveCount(0)
      await expect(page.getByRole("button", { name: /^(Swing|Flip card|Pause|Reset|Enable 3D)$/i })).toHaveCount(0)
    }
    await finishAudit()
  })
})

test.describe("contact, source media and CV", () => {
  test("Contact owns the CV action and the displayed email opens the message page", async ({ page }) => {
    for (const pathname of ["/", "/work", "/about", "/projects/mycareai", messagePath]) {
      await page.goto(pathname)
      await expect(page.locator("a[href='/cv'], a[download][href*='Resume.pdf']")).toHaveCount(0)
      await expect(page.locator("header a[href='/cv']")).toHaveCount(0)
    }
    await page.goto("/contact")
    await expect(page.locator(".contact-email")).toHaveAttribute("href", messagePath)
    await expect(page.locator(".contact-email")).toContainText(email)
    await expect(page.locator(".contact-links").getByRole("link", { name: "Read my CV" })).toHaveAttribute("href", "/cv")
    await expect(page.locator(".contact-links a[target='_blank']")).toHaveCount(2)
    await expect(page.getByRole("button", { name: /copy email/i })).toHaveCount(0)
    await expect(page.locator(".copy-email-status")).toHaveCount(0)
    await page.locator(".contact-email").click()
    await expect(page).toHaveURL(new URL(messagePath, baseURL).href)
    for (const name of ["Name", "Email", "Subject", "Message"]) await expect(page.getByRole("textbox", { name, exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeVisible()
    await expect(page.locator(".message-delivery")).toContainText(`To: ${email}`)
    await expect(page.locator(".message-delivery")).not.toContainText("FormSubmit")
  })

  test("a mocked sent response confirms delivery and clears the form", async ({ page }) => {
    const message = "Message sent. Thank you for getting in touch."
    const mock = await mockContactAPI(page, 200, { status: "sent", message })
    await page.goto(messagePath)
    await fillContactForm(page)
    await page.getByRole("button", { name: "Send message", exact: true }).click()
    await expect(page.locator(".message-status-sent[role='status']")).toContainText(/message.*(?:submitted|sent)/i)
    expect(mock.submissions).toHaveLength(1)
    expect(mock.submissions[0]).toEqual(expect.objectContaining(testMessage))
    expect(mock.unexpectedPosts).toEqual([])
    await expectContactValues(page, { name: "", email: "", subject: "", message: "" })
  })

  test("missing email configuration never claims Sent and preserves the visitor's message", async ({ page }) => {
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    const message = "Email delivery is not configured. Your message has not been sent."
    const mock = await mockContactAPI(page, 503, { status: "configuration_required", message }, gate)
    await page.goto(messagePath)
    await fillContactForm(page)
    const submit = page.locator("form button[type='submit']")
    try {
      await submit.click()
      await expect(submit).toBeDisabled()
      await expect(page.locator(".message-status-sending")).toContainText(/sending/i)
      await expect(page.locator(".message-status-sent")).toHaveCount(0)
    } finally {
      release()
    }
    const notice = page.locator(".message-status-unavailable")
    await expect(notice).toBeVisible()
    await expect(notice).toHaveAttribute("role", /^(alert|status)$/)
    await expect(notice).not.toBeEmpty()
    await expect(notice).not.toContainText(/message (?:has been )?(?:sent|submitted)|successfully (?:sent|submitted)/i)
    await expect(page.locator(".message-status-sent")).toHaveCount(0)
    await expectContactValues(page)
    expect(mock.submissions).toHaveLength(1)
    expect(mock.unexpectedPosts).toEqual([])
  })

  test("a mocked provider failure keeps every form value for retry", async ({ page }) => {
    const message = "Delivery failed. Please try again."
    const mock = await mockContactAPI(page, 502, { status: "error", message })
    await page.goto(messagePath)
    await fillContactForm(page)
    await page.getByRole("button", { name: "Send message", exact: true }).click()
    await expect(page.locator(".message-status-error[role='alert']")).toContainText(/could not be sent/i)
    await expectContactValues(page)
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeEnabled()
    expect(mock.submissions).toHaveLength(1)
    expect(mock.unexpectedPosts).toEqual([])
  })

  test("server validation errors are shown without discarding the visitor's values", async ({ page }) => {
    const errors = { email: "Use a valid reply-to address.", message: "Add a little more detail." }
    const mock = await mockContactAPI(page, 422, { status: "error", message: "Check the highlighted fields.", errors })
    await page.goto(messagePath)
    await fillContactForm(page)
    await page.getByRole("button", { name: "Send message", exact: true }).click()
    await expect(page.getByText(errors.email, { exact: true })).toBeVisible()
    await expect(page.getByText(errors.message, { exact: true })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveAttribute("aria-invalid", "true")
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveAttribute("aria-invalid", "true")
    await expectContactValues(page)
    expect(mock.submissions).toHaveLength(1)
    expect(mock.unexpectedPosts).toEqual([])
  })

  test("required fields prevent a blank POST", async ({ page }) => {
    const mock = await mockContactAPI(page, 200, { status: "sent", message: "Unexpected submission intercepted." })
    await page.goto(messagePath)
    for (const name of ["Name", "Email", "Subject", "Message"]) await expect(page.getByRole("textbox", { name, exact: true })).toHaveAttribute("required", "")
    const posted = page.waitForRequest((request) => request.method() === "POST" && new URL(request.url()).pathname === "/api/contact", { timeout: 750 }).catch(() => null)
    await page.getByRole("button", { name: "Send message", exact: true }).click()
    expect(await page.locator("form").evaluate((element) => (element as HTMLFormElement).checkValidity())).toBe(false)
    expect(await posted).toBeNull()
    expect(mock.submissions).toEqual([])
    expect(mock.unexpectedPosts).toEqual([])
  })

  test("case studies preserve original media, context and source links", async ({ page, request }) => {
    await page.goto("/projects/stuntlytics")
    const video = page.locator(".case-cover video")
    await expect(video.locator("source")).toHaveAttribute("src", "/projects/stuntlytics-preview.mp4")
    await expect(video).toHaveAttribute("poster", "/projects/stuntlytics.jpg")
    expect(await video.evaluate((element) => (element as HTMLVideoElement).controls && !(element as HTMLVideoElement).autoplay)).toBe(true)
    await video.evaluate(async (element) => { const player = element as HTMLVideoElement; player.muted = true; await player.play() })
    await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.2)
    await video.evaluate((element) => (element as HTMLVideoElement).pause())
    await expect(page.locator(".case-gallery-item")).toHaveCount(2)
    await expect(page.locator(".case-evidence-context").first()).not.toBeEmpty()
    await expect(page.locator(".case-evidence-source").first()).toHaveAttribute("href", /^https?:\/\//)
    await page.goto("/projects/mycareai")
    await expect(page.locator(".case-cover img")).toHaveAttribute("src", /mycareai-logo\.webp/)
    await expect(page.locator("#case-limitations")).toBeVisible()
    await expect(page.locator(".case-next-link")).toHaveAttribute("href", "/projects/data-pipeline-sentiment-analysis")
    const html = await page.content()
    expect(html).not.toContain("reported-text-accuracy")
    expect(html).not.toContain("92%")
    for (const href of await page.locator(".case-media-source").evaluateAll((elements) => elements.map((element) => element.getAttribute("href")))) {
      if (href?.startsWith("/")) expect((await request.get(href.split("#")[0])).status()).toBe(200)
    }
  })

  test("unknown and draft URLs return 404 and /cv stays on the visitor's host", async ({ request }) => {
    for (const pathname of ["/not-a-real-page", "/projects/not-a-published-project", "/projects/draft"]) expect((await request.get(pathname)).status(), pathname).toBe(404)
    const redirect = await request.get("/cv", { maxRedirects: 0 })
    expect(redirect.status()).toBe(307)
    expect(redirect.headers().location).toMatch(/^\/[^/].*\.pdf$/)
    const pdf = await request.get("/cv")
    expect(pdf.ok()).toBe(true)
    expect(pdf.headers()["content-type"]).toContain("application/pdf")
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-")
  })
})

test.describe("responsive HTML and metadata", () => {
  for (const width of [390, 768, 1440]) {
    test(`${width}px editorial pages have no overflow or clipped headings`, async ({ page }) => {
      test.setTimeout(60_000)
      await page.setViewportSize({ width, height: 1000 })
      for (const pathname of pagePaths) {
        await page.goto(pathname, { waitUntil: "networkidle" })
        await page.evaluate(() => document.fonts.ready)
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
        const issues = await page.evaluate(() => ({
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          headings: Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2")).flatMap((element) => {
            const bounds = element.getBoundingClientRect(), style = getComputedStyle(element)
            if (style.display === "none" || style.visibility === "hidden") return []
            return bounds.left < -1 || bounds.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1
              ? [{ text: element.textContent, left: bounds.left, right: bounds.right, scrollWidth: element.scrollWidth, width: element.clientWidth, scrollHeight: element.scrollHeight, height: element.clientHeight }] : []
          }),
          media: Array.from(document.querySelectorAll<HTMLImageElement>(".project-visual img")).flatMap((image) => {
            const frame = image.closest<HTMLElement>(".project-visual")!
            const bounds = image.getBoundingClientRect(), frameBounds = frame.getBoundingClientRect()
            const outsideFrame = bounds.left < frameBounds.left - 1 || bounds.right > frameBounds.right + 1 || bounds.top < frameBounds.top - 1 || bounds.bottom > frameBounds.bottom + 1
            const frameOverflow = frame.scrollWidth > frame.clientWidth + 1 || frame.scrollHeight > frame.clientHeight + 1
            return outsideFrame || frameOverflow ? [{
              image: image.alt,
              bounds: { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom },
              frame: { left: frameBounds.left, right: frameBounds.right, top: frameBounds.top, bottom: frameBounds.bottom },
              horizontalOverflow: frame.scrollWidth - frame.clientWidth,
              verticalOverflow: frame.scrollHeight - frame.clientHeight,
            }] : []
          }),
        }))
        expect(issues.pageOverflow, pathname).toBeLessThanOrEqual(1)
        expect(issues.headings, pathname).toEqual([])
        expect(issues.media, `${pathname}: project images must stay inside their preview frames`).toEqual([])
      }
    })
  }

  test("public routes have unique production canonicals and an expanded draft-free sitemap", async ({ page, request }) => {
    const canonicals: string[] = [], titles: string[] = [], policies: string[][] = []
    for (const pathname of publicPaths) {
      const response = await request.get(pathname)
      expect(response.status(), pathname).toBe(200)
      const html = await response.text()
      expect(html).not.toContain("reported-text-accuracy")
      expect(html).not.toContain("confirmationNotes")
      const meta = await page.evaluate((source) => {
        const document = new DOMParser().parseFromString(source, "text/html")
        return { title: document.title, canonical: Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')).map((element) => element.href), ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"), description: document.querySelector('meta[name="description"]')?.getAttribute("content"), robots: Array.from(document.querySelectorAll('meta[name="robots"]')).map((element) => element.getAttribute("content") || "") }
      }, html)
      expect(meta.canonical, pathname).toHaveLength(1)
      expect(meta.title, pathname).not.toBe("")
      expect(meta.description, pathname).toBeTruthy()
      const canonical = new URL(meta.canonical[0])
      expect(canonical.protocol).toBe("https:")
      expect(canonical.pathname).toBe(pathname)
      expect(new URL(meta.ogUrl!).href).toBe(canonical.href)
      canonicals.push(canonical.href); titles.push(meta.title); policies.push(meta.robots)
    }
    expect(new Set(titles).size).toBe(publicPaths.length)
    expect(new Set(canonicals).size).toBe(publicPaths.length)
    expect(new Set(canonicals.map((value) => new URL(value).origin)).size).toBe(1)
    const response = await request.get("/sitemap.xml")
    expect(response.status()).toBe(200)
    const locations = await page.evaluate((xml) => {
      const document = new DOMParser().parseFromString(xml, "application/xml")
      if (document.querySelector("parsererror")) throw new Error("Invalid sitemap XML")
      return Array.from(document.querySelectorAll("loc")).map((element) => element.textContent || "")
    }, await response.text())
    if (locations.length) expect([...locations].sort()).toEqual([...canonicals].sort())
    else {
      for (const policy of policies) expect(policy.some((value) => value.includes("noindex"))).toBe(true)
      expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow:\s*\/(?:\r?\n|$)/)
    }
    expect(locations.some((value) => /\/projects\/draft(?:$|[?#])/.test(value))).toBe(false)
    expect(locations.some((value) => new URL(value).pathname === messagePath)).toBe(false)
    const utility = await request.get(messagePath)
    expect(utility.status()).toBe(200)
    const utilityPolicies = await page.evaluate((source) => Array.from(new DOMParser().parseFromString(source, "text/html").querySelectorAll('meta[name="robots"]')).map((element) => element.getAttribute("content") || ""), await utility.text())
    expect(utilityPolicies.some((value) => value.includes("noindex"))).toBe(true)
  })

  test("preview deployment policy excludes indexing without changing production canonicals", () => {
    const fixtureData = { siteConfig: { website: "https://portfolio.example" }, publishedProjects: [{ slug: "published-case" }] }
    const evaluate = (filename: string, env: Record<string, string | undefined>, dependencies: Record<string, unknown>) => {
      const output = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
      const exports: Record<string, unknown> = {}
      vm.runInNewContext(output, { exports, URL, process: { env }, require(name: string) { if (name === "@/lib/portfolio-data") return fixtureData; if (name in dependencies) return dependencies[name]; throw new Error(`Unexpected fixture import: ${name}`) } })
      return exports
    }
    for (const env of [{ NODE_ENV: "production", VERCEL_ENV: "preview" }, { NODE_ENV: "production", PORTFOLIO_PREVIEW: "true" }, { NODE_ENV: "development" }]) {
      const deployment = evaluate("lib/deployment.ts", env, {})
      expect(deployment.isIndexableDeployment).toBe(false)
      expect(deployment.indexingRobots).toEqual({ index: false, follow: false })
      expect((deployment.canonicalUrl as (path: string) => string)("/work")).toBe("https://portfolio.example/work")
      const dependencies = { "@/lib/deployment": deployment }
      expect((evaluate("app/sitemap.ts", env, dependencies).default as () => unknown[])()).toEqual([])
      expect((evaluate("app/robots.ts", env, dependencies).default as () => { rules: { disallow: string } })().rules.disallow).toBe("/")
    }
  })
})

test.describe("ordinary HTML without JavaScript", () => {
  test.use({ javaScriptEnabled: false })

  test("native routes, work, About and Contact remain available without JavaScript", async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.locator(".home-navigation a[href='/work']").click()
    await expect(page).toHaveURL(new URL("/work", baseURL).href)
    await expect(page.locator(".project-article")).toHaveCount(4)
    await page.locator(".project-visual-link").first().click()
    await expect(page.locator(".case-page h1")).toBeVisible()
    await page.locator(".case-back").first().click()
    await expect(page).toHaveURL(new URL("/work", baseURL).href)
    await page.locator(".header-links a[href='/about']").click()
    await expect(page.locator(".about-portrait-image")).toBeVisible()
    await expect(page.locator(".experience-entry")).toHaveCount(3)
    await page.locator(".header-links a[href='/contact']").click()
    await expect(page.locator(".contact-email")).toHaveAttribute("href", messagePath)
    await expect(page.locator(".contact-links a[href='/cv']")).toBeVisible()
    await expect(page.getByRole("button", { name: /copy email/i })).toHaveCount(0)
    await page.locator(".contact-email").click()
    await expect(page).toHaveURL(new URL(messagePath, baseURL).href)
    await expect(page.locator("form")).toHaveAttribute("method", /post/i)
    await expect(page.locator("form")).toHaveAttribute("action", "/api/contact")
    for (const name of ["Name", "Email", "Subject", "Message"]) await expect(page.getByRole("textbox", { name, exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeVisible()
  })
})
