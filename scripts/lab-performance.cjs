/* Reproducible synthetic mobile lab, not field INP or a physical-device benchmark. */
const { chromium } = require("@playwright/test")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")

const baseUrl = process.env.PORTFOLIO_LAB_BASE_URL || "http://127.0.0.1:3001"
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
const config = {
  runsPerRoute: 3,
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
  cpuSlowdown: 4,
  network: {
    label: "Defined Slow 4G (decimal bit rates; not a claim of a particular Lighthouse preset)",
    downloadBitsPerSecond: 1_600_000,
    uploadBitsPerSecond: 750_000,
    latencyMs: 150,
    cacheDisabled: true,
  },
  settleAfterNetworkIdleMs: 2000,
  eventTimingDurationThresholdMs: 16,
  routes: ["/", "/projects/mycareai"],
}

function median(values) {
  const numbers = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (!numbers.length) return null
  const middle = Math.floor(numbers.length / 2)
  return numbers.length % 2 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2
}
const rounded = (value) => Number.isFinite(value) ? Number(value.toFixed(3)) : null

async function observePage(page, eventEntries) {
  await page.exposeBinding("__reportPortfolioLabEvents", (_, entries) => eventEntries.push(...entries))
  await page.addInitScript(() => {
    const state = { lcpMs: null, lcpElement: null, cls: 0, clsSum: 0, eventTimingSupported: false }
    window.__portfolioLab = state
    let sessionStart = 0
    let sessionLast = 0
    let sessionValue = 0
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          state.lcpMs = entry.startTime
          state.lcpElement = entry.element ? `${entry.element.tagName.toLowerCase()}${entry.element.id ? `#${entry.element.id}` : ""}` : null
        }
      }).observe({ type: "largest-contentful-paint", buffered: true })
    } catch { /* Missing API is reported as null rather than a fabricated zero. */ }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue
          state.clsSum += entry.value
          if (sessionLast && entry.startTime - sessionLast < 1000 && entry.startTime - sessionStart < 5000) sessionValue += entry.value
          else { sessionStart = entry.startTime; sessionValue = entry.value }
          sessionLast = entry.startTime
          state.cls = Math.max(state.cls, sessionValue)
        }
      }).observe({ type: "layout-shift", buffered: true })
    } catch { state.cls = null; state.clsSum = null }
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries().map((entry) => ({
          documentUrl: location.href,
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration,
          processingStart: entry.processingStart,
          processingEnd: entry.processingEnd,
          interactionId: entry.interactionId || 0,
        }))
        if (entries.length) void window.__reportPortfolioLabEvents(entries)
      }).observe({ type: "event", buffered: true, durationThreshold: 16 })
      state.eventTimingSupported = true
    } catch { /* The proxy remains unmeasured when Event Timing is unavailable. */ }
  })
}

async function measure(browser, route, run) {
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: config.deviceScaleFactor,
    isMobile: config.isMobile,
    hasTouch: config.hasTouch,
    reducedMotion: "no-preference",
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  const eventEntries = []
  const pageErrors = []
  page.on("pageerror", (error) => pageErrors.push(error.message))
  try {
    await observePage(page, eventEntries)
    await cdp.send("Network.enable")
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: config.network.latencyMs,
      downloadThroughput: config.network.downloadBitsPerSecond / 8,
      uploadThroughput: config.network.uploadBitsPerSecond / 8,
      connectionType: "cellular4g",
    })
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: config.cpuSlowdown })
    const startedAt = new Date().toISOString()
    const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: "load", timeout: 90000 })
    let networkIdle = true
    try { await page.waitForLoadState("networkidle", { timeout: 30000 }) }
    catch { networkIdle = false }
    await page.waitForTimeout(config.settleAfterNetworkIdleMs)
    // Capture page-load metrics before input ends LCP collection or navigates away.
    const metrics = await page.evaluate(() => ({
      ...window.__portfolioLab,
      userAgent: navigator.userAgent,
      pageKind: document.querySelector(".home-navigation") ? "home" : document.querySelector(".case-page") ? "case-study" : "page",
      navigation: performance.getEntriesByType("navigation").map((entry) => ({
        responseStart: entry.responseStart,
        domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
        loadEventEnd: entry.loadEventEnd,
      }))[0] || null,
    }))
    const interaction = { action: route === "/" ? "Tap the Home Work link" : "Tap the case-study All work link", eventTimingProxyMs: null }
    const actionStart = await page.evaluate(() => performance.now())
    try {
      const target = route === "/"
        ? page.locator(".home-navigation a[href='/work']")
        : page.locator(".case-back[href='/work']").first()
      await target.tap({ timeout: 10000 })
      await page.waitForURL((url) => url.pathname === "/work", { timeout: 15000 })
      await page.waitForTimeout(500)
      const relevant = eventEntries.filter((entry) => entry.interactionId > 0 && entry.startTime >= actionStart - 1)
      interaction.eventTimingProxyMs = relevant.length ? Math.max(...relevant.map((entry) => entry.duration)) : null
      interaction.eventTimingEntries = relevant
      interaction.destinationUrl = page.url()
      if (!relevant.length) interaction.note = "No qualifying Event Timing entry at the 16ms observation threshold; latency proxy not measured."
    } catch (error) { interaction.error = error.message }
    return {
      route, run, startedAt, status: response?.status() || null, networkIdle,
      lcpMs: rounded(metrics.lcpMs), cls: rounded(metrics.cls), clsSum: rounded(metrics.clsSum),
      lcpElement: metrics.lcpElement, userAgent: metrics.userAgent,
      pageKind: metrics.pageKind,
      navigation: metrics.navigation,
      eventTimingSupported: metrics.eventTimingSupported,
      interaction, pageErrors,
    }
  } finally {
    await cdp.detach().catch(() => {})
    await context.close()
  }
}

async function main() {
  if (executablePath && !fs.existsSync(executablePath)) throw new Error(`Chromium executable not found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE. Tried: ${executablePath}`)
  const browser = await chromium.launch({ executablePath, headless: true })
  const report = {
    kind: "synthetic-lab",
    generatedAt: new Date().toISOString(),
    baseUrl,
    browser: { name: "Chromium", version: browser.version(), executablePath, headless: true },
    host: { platform: process.platform, architecture: process.arch, node: process.version },
    config,
    interpretation: [
      "Fresh browser context per run plus CDP cache disabled; desktop Chromium emulates a touch mobile viewport.",
      "CLS uses the maximum session window (1s gap / 5s maximum), excluding shifts with hadRecentInput.",
      "Event Timing after one scripted interaction is a synthetic latency proxy, not field INP.",
      "These results do not establish physical mobile FPS, field p75, or cross-browser acceptance.",
    ],
    runs: [],
  }
  try {
    for (const route of config.routes) {
      for (let run = 1; run <= config.runsPerRoute; run++) {
        process.stderr.write(`Lab ${route} cold run ${run}/${config.runsPerRoute}\n`)
        report.runs.push(await measure(browser, route, run))
      }
    }
  } finally { await browser.close() }
  report.medians = config.routes.map((route) => {
    const runs = report.runs.filter((run) => run.route === route)
    const lcpMs = rounded(median(runs.map((run) => run.lcpMs)))
    const cls = rounded(median(runs.map((run) => run.cls)))
    const interactionEventTimingProxyMs = rounded(median(runs.map((run) => run.interaction.eventTimingProxyMs)))
    return {
      route, lcpMs, cls, interactionEventTimingProxyMs,
      availableInteractionSamples: runs.filter((run) => Number.isFinite(run.interaction.eventTimingProxyMs)).length,
      targets: { lcpMs: 2500, cls: 0.1, scriptedInteractionProxyMs: 200 },
      meetsTargets: {
        lcp: lcpMs === null ? null : lcpMs <= 2500,
        cls: cls === null ? null : cls <= 0.1,
        scriptedInteractionProxy: interactionEventTimingProxyMs === null ? null : interactionEventTimingProxyMs <= 200,
      },
    }
  })
  report.completedAt = new Date().toISOString()
  const filename = process.env.PORTFOLIO_LAB_OUTPUT || path.join(os.tmpdir(), `portfolio-lab-performance-${Date.now()}.json`)
  report.outputPath = filename
  fs.writeFileSync(filename, `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
