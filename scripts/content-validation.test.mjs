import test from "node:test"
import assert from "node:assert/strict"
import { validatePortfolioContent } from "../lib/content-validation.mjs"
import { loadPortfolioData, localAssetExists } from "./validate-content.mjs"

const authored = await loadPortfolioData()
const fixture = () => structuredClone(Object.fromEntries(Object.entries(authored).filter(([, value]) => typeof value !== "function")))
const validate = (content, extra = {}) => validatePortfolioContent(content, { asOfMonth: "2026-11", assetExists: localAssetExists, ...extra })

test("the real portfolio passes and published payload excludes the unverified accuracy claim", () => {
  assert.deepEqual(validate(fixture()), [])
  const mycare = authored.publishedProjects.find((project) => project.slug === "mycareai")
  assert.ok(authored.projects.find((project) => project.slug === "mycareai").evidence.some((item) => !item.verified))
  assert.equal(mycare.metric, undefined)
  assert.equal(JSON.stringify(mycare).includes("92%"), false)
  assert.deepEqual(authored.featuredProjects.map((project) => project.slug), ["modnance", "stuntlytics", "mycareai", "data-pipeline-sentiment-analysis"])
  assert.ok(authored.projects.some((project) => project.confirmationNotes.length > 0))
  assert.ok(authored.publishedProjects.every((project) => !Object.hasOwn(project, "confirmationNotes")))
  assert.deepEqual(authored.experiences.find((experience) => experience.id === "puru-freelance").periodDates.startMonth, null)
})

const invalidCases = [
  ["a missing profile summary", (data) => { delete data.siteConfig.summary }, /siteConfig\.summary: required/],
  ["a missing profile photo file", (data) => { data.siteConfig.photo = "/missing-profile.webp" }, /siteConfig\.photo: missing local asset/],
  ["duplicate project slugs", (data) => { data.projects[1].slug = data.projects[0].slug }, /duplicate slug/],
  ["a missing required role", (data) => { delete data.projects[0].role }, /\.role: required/],
  ["a project without documented limitations", (data) => { data.projects[0].limitations = [] }, /\.limitations: required/],
  ["a missing publication decision", (data) => { delete data.projects[0].published }, /\.published: required/],
  ["missing authoring confirmation notes", (data) => { delete data.projects[0].confirmationNotes }, /\.confirmationNotes: required/],
  ["reversed project dates", (data) => { data.projects[1].period.startMonth = "2025-11" }, /start month is after end month/],
  ["an invented future experience month", (data) => { data.experiences[0].periodDates.startMonth = "2027-02" }, /start month is in the future/],
  ["an ended role marked current", (data) => { data.experiences[1].periodDates.current = true }, /current periods cannot have an end month/],
  ["an invalid project link protocol", (data) => { data.projects[1].links[0].href = "javascript:alert(1)" }, /HTTP\(S\)/],
  ["verified evidence without evaluation context", (data) => { data.projects[1].evidence[0].context = " " }, /\.context: required/],
  ["verified evidence without a source", (data) => { delete data.projects[1].evidence[0].source }, /verified evidence requires a source/],
  ["a missing local image", (data) => { data.projects[0].media.src = "/projects/missing-image.webp" }, /missing local asset/],
  ["asset path traversal", (data) => { data.projects[0].media.src = "/%2e%2e/private.png" }, /path traversal/],
  ["a video without a poster", (data) => { delete data.projects[1].media.poster }, /\.poster: required media/],
  ["invalid media dimensions", (data) => { data.projects[0].media.width = 0 }, /\.width: required positive/],
  ["a gallery image without source context", (data) => { delete data.projects[1].gallery[0].source }, /gallery image requires source context/],
  ["a gallery image with a missing source file", (data) => { data.projects[1].gallery[0].src = "/projects/missing-gallery.jpg" }, /gallery\[0\]\.src: missing local asset/],
  ["a skill pointing at a missing project", (data) => { data.skillGroups[0].relatedProjectSlugs.push("does-not-exist") }, /unknown or draft project/],
  ["draft payload leakage", (data) => { data.publishedProjects[0].published = false }, /draft payload cannot be public/],
  ["authoring confirmation-note leakage", (data) => { data.publishedProjects[0].confirmationNotes = ["Unreviewed role details"] }, /authoring confirmation notes cannot be public/],
  ["curation that drops the fourth featured project", (data) => { data.featuredProjects.pop() }, /featuredProjects: must contain exactly/],
  ["unverified evidence leakage", (data) => {
    data.publishedProjects[2].evidence.push(data.projects[2].evidence.find((item) => !item.verified))
  }, /unverified evidence cannot be public/],
  ["an unverified metric promoted into public data", (data) => {
    data.publishedProjects[2].metric = { value: "92%", label: "reported text-classification accuracy" }
  }, /public metrics must come from verified evidence/],
]

for (const [name, mutate, expectedError] of invalidCases) {
  test(`rejects ${name}`, () => {
    const content = fixture()
    mutate(content)
    assert.match(validate(content).join("\n"), expectedError)
  })
}
