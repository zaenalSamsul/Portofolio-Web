/** Pure validation shared by the content CLI and its regression tests. */
export function validatePortfolioContent(content, options = {}) {
  const errors = []
  const assetExists = options.assetExists ?? (() => true)
  const asOfMonth = options.asOfMonth ?? new Date().toISOString().slice(0, 7)
  const expectedFeatured = options.expectedFeaturedSlugs ?? ["modnance", "stuntlytics", "mycareai", "data-pipeline-sentiment-analysis"]
  const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
  const text = (value) => typeof value === "string" && value.trim().length > 0
  const add = (path, message) => errors.push(`${path}: ${message}`)
  const requireText = (value, path) => { if (!text(value)) add(path, "required non-empty text") }
  const list = (value, path, nonEmpty = true) => {
    if (!Array.isArray(value) || (nonEmpty && value.length === 0)) {
      add(path, "required non-empty array")
      return []
    }
    return value
  }
  const textList = (value, path) => list(value, path).forEach((item, index) => requireText(item, `${path}[${index}]`))
  const httpUrl = (value, path) => {
    if (!text(value)) { add(path, "required HTTP(S) URL"); return }
    try {
      const url = new URL(value)
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) {
        add(path, "must be an HTTP(S) URL without embedded credentials")
      }
    } catch { add(path, "invalid HTTP(S) URL") }
  }
  const localAsset = (value, path) => {
    if (!text(value) || !value.startsWith("/") || value.startsWith("//")) {
      add(path, "must reference an asset under public/")
      return
    }
    let pathname
    try { pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]) } catch { add(path, "invalid asset encoding"); return }
    if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").some((part) => part === "." || part === "..")) {
      add(path, "asset path traversal is not allowed")
      return
    }
    if (!assetExists(pathname)) add(path, `missing local asset ${pathname}`)
  }
  const asset = (value, path) => {
    if (typeof value === "string" && value.startsWith("/")) localAsset(value, path)
    else httpUrl(value, path)
  }
  const month = (value, path) => {
    if (value !== null && (typeof value !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value))) {
      add(path, "must be YYYY-MM or explicit null when unknown")
      return false
    }
    return true
  }
  const period = (value, path) => {
    if (!record(value)) { add(path, "required period object"); return }
    requireText(value.label, `${path}.label`)
    const validStart = month(value.startMonth, `${path}.startMonth`)
    const validEnd = month(value.endMonth, `${path}.endMonth`)
    if (typeof value.current !== "boolean") add(`${path}.current`, "required boolean")
    if (value.current && value.endMonth !== null) add(path, "current periods cannot have an end month")
    if (validEnd && value.endMonth !== null && value.startMonth === null) add(path, "an end month requires a known start month")
    if (validStart && validEnd && value.startMonth && value.endMonth && value.startMonth > value.endMonth) {
      add(path, "start month is after end month")
    }
    if (validStart && value.startMonth && value.startMonth > asOfMonth) add(path, "start month is in the future")
    if (validEnd && value.endMonth && value.endMonth > asOfMonth) add(path, "end month is in the future")
  }
  const dimensionedAsset = (value, path) => {
    if (!record(value)) { add(path, "required media object"); return }
    asset(value.src, `${path}.src`)
    requireText(value.alt, `${path}.alt`)
    for (const name of ["width", "height"]) {
      if (!Number.isInteger(value[name]) || value[name] <= 0) add(`${path}.${name}`, "required positive integer")
    }
  }

  if (!record(content)) return ["content: required content object"]
  const projects = list(content.projects, "projects")
  const published = list(content.publishedProjects, "publishedProjects")
  const featured = list(content.featuredProjects, "featuredProjects")
  const slugs = new Set()
  const orders = new Set()

  projects.forEach((project, index) => {
    const path = `projects[${index}]`
    if (!record(project)) { add(path, "required project object"); return }
    for (const name of ["slug", "name", "shortName", "category", "description", "imageAlt", "role", "timeline", "problem", "approach"]) {
      requireText(project[name], `${path}.${name}`)
    }
    if (text(project.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) add(`${path}.slug`, "must be a URL-safe lowercase slug")
    if (slugs.has(project.slug)) add(`${path}.slug`, `duplicate slug ${project.slug}`)
    slugs.add(project.slug)
    if (!Number.isInteger(project.order) || project.order < 1) add(`${path}.order`, "required positive integer")
    if (orders.has(project.order)) add(`${path}.order`, `duplicate display order ${project.order}`)
    orders.add(project.order)
    if (typeof project.published !== "boolean") add(`${path}.published`, "required boolean")
    if (typeof project.featured !== "boolean") add(`${path}.featured`, "required boolean")
    list(project.confirmationNotes, `${path}.confirmationNotes`, false).forEach((note, noteIndex) => requireText(note, `${path}.confirmationNotes[${noteIndex}]`))
    if (project.featured && !project.published) add(`${path}.featured`, "a draft cannot be featured")
    if (!["in-progress", "completed", "prototype"].includes(project.status)) add(`${path}.status`, "unknown project status")
    period(project.period, `${path}.period`)
    if (project.status === "completed" && project.period?.current) add(`${path}.status`, "a completed project cannot have a current period")
    for (const name of ["built", "challenges", "results", "learnings", "limitations", "workflow", "tech"]) textList(project[name], `${path}.${name}`)
    asset(project.image, `${path}.image`)
    if (project.previewVideo !== undefined) asset(project.previewVideo, `${path}.previewVideo`)
    dimensionedAsset(project.media, `${path}.media`)
    if (record(project.media)) {
      if (!["image", "video"].includes(project.media.kind)) add(`${path}.media.kind`, "unknown media kind")
      if (project.media.kind === "video") {
        dimensionedAsset(project.media.poster, `${path}.media.poster`)
        if (project.previewVideo !== project.media.src) add(`${path}.previewVideo`, "must match the canonical video media source")
        if (project.image !== project.media.poster?.src) add(`${path}.image`, "must match the video poster source")
      } else if (project.image !== project.media.src) add(`${path}.image`, "must match the canonical image media source")
    }
    if (project.gallery !== undefined) list(project.gallery, `${path}.gallery`, false).forEach((item, galleryIndex) => {
      const galleryPath = `${path}.gallery[${galleryIndex}]`
      dimensionedAsset(item, galleryPath)
      if (!record(item)) return
      if (item.kind !== "image") add(`${galleryPath}.kind`, "gallery item must be an image")
      requireText(item.caption, `${galleryPath}.caption`)
      if (!record(item.source)) add(`${galleryPath}.source`, "gallery image requires source context")
      else {
        requireText(item.source.label, `${galleryPath}.source.label`)
        if (!item.source.href && !item.source.localRef) add(`${galleryPath}.source`, "requires a source URL or local reference")
        if (item.source.href !== undefined) httpUrl(item.source.href, `${galleryPath}.source.href`)
        if (item.source.localRef !== undefined) localAsset(item.source.localRef, `${galleryPath}.source.localRef`)
      }
    })
    list(project.links, `${path}.links`, false).forEach((link, linkIndex) => {
      const linkPath = `${path}.links[${linkIndex}]`
      if (!record(link)) { add(linkPath, "required link object"); return }
      requireText(link.label, `${linkPath}.label`)
      if (!["github", "demo"].includes(link.kind)) add(`${linkPath}.kind`, "unknown link kind")
      httpUrl(link.href, `${linkPath}.href`)
    })
    const evidenceIds = new Set()
    list(project.evidence, `${path}.evidence`, false).forEach((item, evidenceIndex) => {
      const evidencePath = `${path}.evidence[${evidenceIndex}]`
      if (!record(item)) { add(evidencePath, "required evidence object"); return }
      requireText(item.id, `${evidencePath}.id`)
      if (evidenceIds.has(item.id)) add(`${evidencePath}.id`, "duplicate evidence id")
      evidenceIds.add(item.id)
      requireText(item.claim, `${evidencePath}.claim`)
      if (!["metric", "outcome"].includes(item.kind)) add(`${evidencePath}.kind`, "unknown evidence kind")
      if (typeof item.verified !== "boolean") add(`${evidencePath}.verified`, "required verification flag")
      if (item.kind === "metric") {
        requireText(item.value, `${evidencePath}.value`)
        requireText(item.label, `${evidencePath}.label`)
      }
      if (item.verified) requireText(item.context, `${evidencePath}.context`)
      if (!record(item.source)) {
        if (item.verified) add(`${evidencePath}.source`, "verified evidence requires a source")
      } else {
        requireText(item.source.label, `${evidencePath}.source.label`)
        if (!item.source.href && !item.source.localRef) add(`${evidencePath}.source`, "requires a source URL or local reference")
        if (item.source.href !== undefined) httpUrl(item.source.href, `${evidencePath}.source.href`)
        if (item.source.localRef !== undefined) localAsset(item.source.localRef, `${evidencePath}.source.localRef`)
      }
    })
  })

  const expectedPublished = projects.filter((project) => project?.published).sort((a, b) => a.order - b.order)
  if (JSON.stringify(published.map((project) => project?.slug)) !== JSON.stringify(expectedPublished.map((project) => project.slug))) {
    add("publishedProjects", "must contain only published projects in display order")
  }
  published.forEach((project, index) => {
    const path = `publishedProjects[${index}]`
    if (!record(project)) { add(path, "required project object"); return }
    if (project.published !== true) add(path, "draft payload cannot be public")
    if (Object.prototype.hasOwnProperty.call(project, "confirmationNotes")) add(`${path}.confirmationNotes`, "authoring confirmation notes cannot be public")
    const evidence = Array.isArray(project.evidence) ? project.evidence : []
    if (evidence.some((item) => item?.verified !== true)) add(`${path}.evidence`, "unverified evidence cannot be public")
    const raw = projects.find((item) => item?.slug === project.slug)
    if (raw && Array.isArray(raw.evidence) && JSON.stringify(evidence) !== JSON.stringify(raw.evidence.filter((item) => item.verified === true))) {
      add(`${path}.evidence`, "must include only the verified authoring evidence")
    }
    const metric = evidence.find((item) => item.kind === "metric" && item.verified)
    if (project.metric && (!metric || project.metric.value !== metric.value || project.metric.label !== metric.label)) {
      add(`${path}.metric`, "public metrics must come from verified evidence")
    }
  })
  const featuredSlugs = featured.map((project) => project?.slug)
  if (JSON.stringify(featuredSlugs) !== JSON.stringify(expectedFeatured)) add("featuredProjects", `must contain exactly ${expectedFeatured.join(", ")} in order`)
  for (const slug of featuredSlugs) {
    if (!published.some((project) => project?.slug === slug && project.featured)) add("featuredProjects", `invalid featured reference ${slug}`)
  }
  const publishedSlugs = new Set(published.map((project) => project?.slug))
  list(content.skillGroups, "skillGroups").forEach((group, index) => {
    const path = `skillGroups[${index}]`
    if (!record(group)) { add(path, "required skill group"); return }
    requireText(group.title, `${path}.title`)
    textList(group.skills, `${path}.skills`)
    list(group.relatedProjectSlugs, `${path}.relatedProjectSlugs`).forEach((slug) => {
      if (!publishedSlugs.has(slug)) add(`${path}.relatedProjectSlugs`, `unknown or draft project ${slug}`)
    })
  })
  const experienceIds = new Set()
  list(content.experiences, "experiences").forEach((experience, index) => {
    const path = `experiences[${index}]`
    if (!record(experience)) { add(path, "required experience object"); return }
    for (const name of ["id", "role", "company", "period", "summary"]) requireText(experience[name], `${path}.${name}`)
    if (experienceIds.has(experience.id)) add(`${path}.id`, "duplicate experience id")
    experienceIds.add(experience.id)
    period(experience.periodDates, `${path}.periodDates`)
    textList(experience.bullets, `${path}.bullets`)
    textList(experience.tech, `${path}.tech`)
  })
  if (record(content.education)) period(content.education.periodDates, "education.periodDates")
  if (Array.isArray(content.training)) content.training.forEach((item, index) => period(item?.periodDates, `training[${index}].periodDates`))
  if (!record(content.siteConfig)) add("siteConfig", "required site configuration")
  else {
    for (const name of ["name", "role", "summary", "email", "location"]) requireText(content.siteConfig[name], `siteConfig.${name}`)
    for (const name of ["github", "linkedin", "website"]) httpUrl(content.siteConfig[name], `siteConfig.${name}`)
    localAsset(content.siteConfig.resume, "siteConfig.resume")
    localAsset(content.siteConfig.photo, "siteConfig.photo")
  }
  for (const [name, entries] of [["repositories", content.repositories], ["achievements", content.achievements]]) {
    if (Array.isArray(entries)) entries.forEach((entry, index) => httpUrl(entry?.href, `${name}[${index}].href`))
  }
  return errors
}
