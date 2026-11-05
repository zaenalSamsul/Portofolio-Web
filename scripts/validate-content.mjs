import { readFileSync, statSync } from "node:fs"
import { dirname, resolve, sep } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"
import { validatePortfolioContent } from "../lib/content-validation.mjs"

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/** Load authoring data in Node without requiring a framework server or a new runtime dependency. */
export async function loadPortfolioData() {
  const filename = resolve(workspaceRoot, "lib/portfolio-data.ts")
  // The marker protects browser bundles. This script runs only in Node at build/check time.
  const source = readFileSync(filename, "utf8").replace(/^import ["']server-only["'];?\s*$/m, "")
  const { outputText } = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)
}

export function localAssetExists(pathname) {
  const publicRoot = resolve(workspaceRoot, "public")
  const filename = resolve(publicRoot, `.${pathname}`)
  if (!filename.startsWith(`${publicRoot}${sep}`)) return false
  try { return statSync(filename).isFile() } catch { return false }
}

export async function checkContent() {
  const content = await loadPortfolioData()
  const errors = validatePortfolioContent(content, { assetExists: localAssetExists })
  if (errors.length) {
    console.error(`Content validation failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join("\n")}`)
    return false
  }
  console.log(`Content valid: ${content.publishedProjects.length} published projects, ${content.featuredProjects.length} featured; evidence, assets, links, references, and dates checked.`)
  return true
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { if (!await checkContent()) process.exitCode = 1 }
  catch (error) { console.error("Content validation could not load the authoring data:", error); process.exitCode = 1 }
}
