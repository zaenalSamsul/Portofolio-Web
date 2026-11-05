import "server-only"

export const siteConfig = {
  name: "Zaenal Syamsyul Arief",
  role: "Data & AI Engineer",
  summary: "I build data pipelines, machine learning systems, and LLM-powered applications that connect technical ideas to everyday needs.",
  email: "zaenalsyamsyularief@gmail.com",
  phone: "+62 812 1386 1662",
  location: "Garut, West Java, Indonesia",
  photo: "/zaenal-portrait.png",
  github: "https://github.com/zaenalSamsul",
  linkedin: "https://www.linkedin.com/in/zaenal-syamsyul-arief",
  certificates: "https://bit.ly/SertifikatZaenalSyamsyulArief",
  website: "https://zaenalsyamsyularief-porto.vercel.app",
  resume: "/Zaenal-Syamsyul-Arief-Resume.pdf",
}

export const aboutProfile = {
  lead: "I work where data, machine learning, and useful software meet.",
  paragraphs: [
    "I'm an Informatics graduate based in Garut, West Java, Indonesia. My work spans data collection and preparation, model development, and the application services that connect them.",
    "At NoLimit Indonesia, I worked on social-media data pipelines, NLP models, and tools for human review. I have also supported AI teaching at Institut Teknologi Garut and work as a freelance Data & AI Engineer at PURU Software Agency.",
    "I'm particularly interested in NLP, LLM applications, and the practical engineering that turns an experiment into a usable product.",
  ],
}

export const contactProfile = {
  description: "For project enquiries, engineering opportunities, or a conversation about data and AI.",
  photo: {
    src: "/zaenal-informal.webp", width: 1200, height: 1600,
    alt: "Zaenal in a red hoodie beside a rocky stream surrounded by trees",
    caption: "Beyond the screen.",
  },
}

export type ProjectLink = {
  label: string
  href: string
  kind: "github" | "demo"
}

export type ContentPeriod = {
  label: string
  startMonth: string | null
  endMonth: string | null
  current: boolean
}

export type EvidenceSource = {
  label: string
  href?: string
  localRef?: string
}

export type ProjectEvidence = {
  id: string
  kind: "metric" | "outcome"
  claim: string
  verified: boolean
  context: string
  source: EvidenceSource
  value?: string
  label?: string
}

export type ProjectMedia = {
  kind: "image" | "video"
  src: string
  width: number
  height: number
  alt: string
  poster?: { src: string; width: number; height: number; alt: string }
}

export type ProjectGalleryItem = {
  src: string
  kind: "image"
  width: number
  height: number
  alt: string
  caption: string
  source: EvidenceSource
}

export type Project = {
  slug: string
  name: string
  shortName: string
  category: string
  description: string
  image: string
  imageAlt: string
  previewVideo?: string
  featuredVisual?: "stuntlytics-dashboard" | "modnance-workflow"
  featured: boolean
  metric?: { value: string; label: string }
  role: string
  timeline: string
  period: ContentPeriod
  status: "in-progress" | "completed" | "prototype"
  order: number
  published: boolean
  media: ProjectMedia
  evidence: ProjectEvidence[]
  gallery?: ProjectGalleryItem[]
  problem: string
  approach: string
  built: string[]
  challenges: string[]
  results: string[]
  learnings: string[]
  limitations: string[]
  workflow: string[]
  tech: string[]
  links: ProjectLink[]
}

export type AuthoringProject = Project & { confirmationNotes: string[] }

type ProjectContent = Omit<Project, "role" | "timeline" | "period" | "status" | "order" | "published" | "media" | "evidence"> & {
  role?: string
  timeline?: string
}

const projectContent: ProjectContent[] = [
  {
    slug: "modnance",
    name: "Modnance",
    shortName: "Modnance",
    category: "GENERATIVE AI / AUTOMATION",
    description:
      "A conversational finance assistant connecting Gemini, messaging platforms, and automated transaction workflows.",
    image: "/projects/modnance-workflow.svg",
    imageAlt: "Modnance workflow connecting messages, Gemini, automation, and PostgreSQL",
    featuredVisual: "modnance-workflow",
    featured: true,
    timeline: "October 2026 - present",
    problem:
      "Recording expenses and retrieving financial information can interrupt the flow of everyday conversations. Modnance explores a messaging-based way to manage those tasks.",
    approach:
      "Google Gemini recognizes financial intents and extracts transaction details from messages. Python services connect Discord and WhatsApp to n8n workflows and PostgreSQL for transaction recording, balance inquiries, history, and financial reports.",
    built: [
      "Gemini-based intent recognition, transaction extraction, and financial insights.",
      "Discord and WhatsApp integrations using Python, REST APIs, and Evolution API.",
      "n8n workflows connected to PostgreSQL for recording and retrieving financial activity.",
      "Docker Compose services for modular deployment and system integration.",
    ],
    challenges: [
      "Connecting natural-language requests to structured financial workflows.",
      "Coordinating messaging integrations, automation, and persistent transaction records.",
    ],
    results: [
      "An ongoing implementation covering conversational transaction tracking, balance inquiries, history, and AI-generated reports.",
      "A modular service architecture combining messaging, model inference, workflow automation, and a relational database.",
    ],
    learnings: [
      "Useful AI assistants need a clear connection between language understanding and the systems that execute a task.",
      "Separating messaging, automation, and storage makes an integrated workflow easier to develop and maintain.",
    ],
    limitations: [
      "This implementation is still in development; no audited production deployment or financial-accuracy benchmark is documented.",
      "The architecture illustration explains the intended workflow and is not a live product demo.",
    ],
    workflow: ["Discord / WhatsApp", "Python + REST APIs", "Gemini intent extraction", "n8n workflow", "PostgreSQL", "Financial response"],
    tech: ["Python", "Google Gemini", "n8n", "PostgreSQL", "REST APIs", "Docker"],
    links: [],
  },
  {
    slug: "stuntlytics",
    name: "StuntLytics",
    shortName: "StuntLytics",
    category: "HEALTH ANALYTICS / DECISION SUPPORT",
    description:
      "A child-health analytics workspace connecting regional evidence, risk mapping, and local screening workflows.",
    image: "/projects/stuntlytics.jpg",
    imageAlt: "StuntLytics project logo featuring a child and an analytics chart",
    previewVideo: "/projects/stuntlytics-preview.mp4",
    featuredVisual: "stuntlytics-dashboard",
    featured: true,
    role: "Data preprocessing & system integration (hackathon)",
    timeline: "Original project: October 2025",
    problem:
      "Regional child-health data is difficult to turn into a practical monitoring workflow. Teams need to compare conditions, review risk signals, and identify areas for follow-up.",
    approach:
      "The current implementation combines a Next.js interface, FastAPI evidence services, Elasticsearch, and a local scikit-learn screening pipeline. Optional Gemini narration works from aggregated evidence. It develops the original hackathon concept into a broader analytics workspace. Regional Risk Intelligence is the West Java mapping module of StuntLytics, covering district-level monitoring, hotspots, and directional-flow signals; it is not counted as a separate project.",
    built: [
      "For the original APHacton project: a synthetic dataset of 100,000 family records using variables derived from BPS and SSGI references.",
      "A Random Forest preprocessing and prediction workflow integrated with Streamlit and Elasticsearch in the original project.",
      "A current workspace covering regional dashboards, risk maps, a Data Explorer, and family screening with 18 structured inputs.",
      "An evidence layer that limits optional Gemini narration to aggregated information.",
    ],
    challenges: [
      "Integrating preprocessing, model inference, indexed data, and the application interface.",
      "Keeping screening signals distinct from clinical diagnosis.",
      "Supporting local evidence summaries when optional external services are unavailable.",
    ],
    results: [
      "Delivered the original hackathon workflow for synthetic-data preparation and system integration.",
      "The current repository brings dashboards, exploration, screening, and evidence summaries into one workspace.",
      "The synthetic-data prototype and development-stage screening workflow are not presented as clinically validated performance.",
    ],
    learnings: [
      "Dataset provenance matters: synthetic training records need to remain clearly distinguished from real-world validation.",
      "Aggregating evidence before optional AI narration creates an explicit boundary around raw records.",
    ],
    limitations: [
      "The original hackathon workflow used synthetic family records; these are not clinical validation data.",
      "The current workspace is development-stage decision support, not a diagnosis tool or a clinically validated screening service.",
      "The preview video is illustrative project material, not evidence of clinical use or an independently verified interface recording.",
    ],
    workflow: ["Regional dataset", "Elasticsearch", "FastAPI evidence service", "Local screening model", "Next.js workspace", "Monitoring + review"],
    tech: ["Next.js", "FastAPI", "Elasticsearch", "Scikit-learn", "Gemini", "Docker"],
    links: [
      { label: "Current workspace", href: "https://github.com/zaenalSamsul/StuntLytics-Productiion", kind: "github" },
      { label: "Original hackathon version", href: "https://github.com/zaenalSamsul/StuntLytics-Aphacton", kind: "github" },
    ],
  },
  {
    slug: "mycareai",
    name: "MyCareAI",
    shortName: "MyCareAI",
    category: "MACHINE LEARNING / APPLIED AI",
    description:
      "An emotion-aware AI assistant combining text classification, facial emotion recognition, and adaptive chatbot responses.",
    image: "/projects/mycareai-logo.webp",
    imageAlt: "MyCareAI project logo and the tagline: Confide without fear. Be heard without judgment.",
    featured: true,
    timeline: "June 2025",
    problem:
      "An assistant that responds to emotional context needs to connect model predictions with the user-facing conversation.",
    approach:
      "The original capstone connected a web client to a Node.js / Express gateway, a Flask / TensorFlow text-emotion classifier, and Vertex AI. The thesis extension uses Gemini API for chat and adds optional camera-based facial emotion recognition. An emotion-aware context manager selects an adaptive response persona using text, facial signals, and risk rules.",
    built: [
      "Separate chat, text-classification, and facial-emotion services behind an Express API.",
      "A four-class thesis text classifier covering sadness, happy, anger, and fear.",
      "Optional TFLite / MediaPipe facial-emotion context and a persona-preview endpoint that works without an LLM call.",
      "Facial-emotion experiments documented with CNN/VGG16 and FER-2013 / RAF-DB, alongside the thesis repository's optional FER service.",
      "Docker Compose orchestration for the Vite frontend, API, and both Python services in the thesis prototype.",
    ],
    challenges: [
      "Connecting text and facial emotion predictions to a coherent chatbot experience.",
      "Separating model inference from the main application service.",
    ],
    results: [
      "Connected emotion inference with generative chat through separate application services.",
      "Extended the capstone into a thesis prototype with adaptive personas and optional facial context.",
    ],
    learnings: [
      "Model outputs become useful when they inform a clear interaction in the product.",
      "Separate inference services allow model development and application integration to progress independently.",
    ],
    limitations: [
      "The available evidence does not provide a reproducible text-model evaluation protocol; numerical accuracy claims are withheld from this public case study.",
      "This emotion-aware prototype has not been clinically validated and does not establish a medical diagnosis.",
    ],
    workflow: ["Text / optional camera input", "Preprocessing", "Emotion services", "Context + risk rules", "Gemini chat", "Adaptive response"],
    tech: ["Python", "TensorFlow", "Flask", "Node.js / Express", "TFLite / MediaPipe", "Gemini API", "Docker Compose"],
    links: [
      { label: "Thesis extension", href: "https://github.com/zaenalSamsul/Mycare-Ai-Thesis", kind: "github" },
      { label: "Original capstone", href: "https://github.com/zaenalSamsul/MyCareAi", kind: "github" },
    ],
  },
  {
    slug: "data-pipeline-sentiment-analysis",
    name: "Validator Panel",
    shortName: "Social Data Validator",
    category: "DATA SCIENCE / NLP",
    description:
      "Data preparation and validation tooling for large social-media datasets at NoLimit Indonesia.",
    image: "/projects/validator-initial-review.webp",
    imageAlt: "Validator Panel initial data review and column mapping, from the internship activity report",
    featured: true,
    role: "Data Science Intern",
    timeline: "July - November 2025",
    problem:
      "Large social-media datasets need to be retrieved, cleaned, reviewed, and labeled before they can support sentiment-model development.",
    approach:
      "I developed a Python and Streamlit panel around the validator team's review process. It brings API and file imports, text preparation, keyword-based correction, embedding-based clustering, and LLM-assisted labeling into one workflow. Reviewers can inspect and edit results before exporting corrected data or updating the backend. Validator Panel and Social Data Validator refer to this same internship tool.",
    built: [
      "A Streamlit Validator Panel supporting uploads up to 600 MB and direct API / Elasticsearch retrieval.",
      "Four review modes: keyword-based batch correction, embedding-based clustering, LLM labeling per row, and grouping by object or entity.",
      "An interactive editor, corrected-data exports, and backend updates, supported by audit trails and three user-access roles.",
      "Data preparation workflows for large social datasets, refined through feedback and user acceptance testing with the validator team.",
    ],
    challenges: [
      "Preparing and reviewing large volumes of social text consistently.",
      "Connecting model-development data to practical validation and audit workflows.",
    ],
    results: [
      "Supported large-file uploads and large-scale social-data validation through one panel.",
      "The internship report records iterative user testing, internal deployment, and a handover with training for the validator team.",
    ],
    learnings: [
      "Model development depends on usable tools for reviewing data and tracing labeling decisions.",
      "Access roles and audit trails are part of a practical data workflow.",
    ],
    limitations: [
      "This case study summarizes an internal internship implementation; source code and validation datasets are not publicly linked for independent review.",
      "Upload and processing figures in the CV describe reported tool scope, not a published performance benchmark.",
      "The activity report and screenshots document implementation scope. They do not establish a measured productivity improvement or a model accuracy benchmark.",
    ],
    workflow: ["APIs / Elasticsearch", "Data retrieval", "Cleaning + preparation", "Validation + labeling", "Audit trail", "Model-ready data"],
    tech: ["Python", "Streamlit", "Elasticsearch", "NLP", "LLMs", "ETL"],
    links: [],
  },
  {
    slug: "hybrid-recommendation-system",
    name: "Hybrid Recommendation System",
    shortName: "Hybrid Recommender",
    category: "RECOMMENDATION SYSTEMS",
    description:
      "A movie recommendation workflow exploring content-based similarity and collaborative filtering.",
    image: "/projects/recommendation-system.jpg",
    imageAlt: "Hybrid Recommendation System project graphic",
    featured: false,
    problem:
      "Movie recommendations need to account for both item attributes and patterns in user preferences.",
    approach:
      "The project explores item-feature similarity and user-item interactions through content-based and collaborative recommendation methods.",
    built: [
      "Content-based recommendations from movie attributes.",
      "Collaborative filtering from user-item interaction patterns.",
      "A workflow for producing top-N movie recommendations.",
    ],
    challenges: [
      "Working with item similarity and user interaction signals.",
      "Understanding data sparsity and cold-start constraints.",
    ],
    results: ["Produced top-N movie recommendations using content-based and collaborative methods."],
    learnings: ["Recommendation quality depends on the available item context and interaction data."],
    limitations: [
      "These are academic experiments on a MovieLens subset, with simulated ranking evaluation rather than external production validation.",
      "The report does not establish user impact or that the hybrid approach outperforms every individual model.",
    ],
    workflow: ["Movie + rating data", "Data preparation", "Content + collaborative models", "Ranking", "Top-N output"],
    tech: ["Python", "Scikit-learn", "Machine Learning", "Recommendation Systems", "Data Analysis"],
    links: [
      { label: "GitHub", href: "https://github.com/zaenalSamsul/System-Rekomendasi-Film", kind: "github" },
    ],
  },
]

const cvPageOne: EvidenceSource = {
  label: "CV — professional experience and projects",
  localRef: "/Zaenal-Syamsyul-Arief-Resume.pdf#page=1",
}

const cvPageTwo: EvidenceSource = {
  label: "CV — project details",
  localRef: "/Zaenal-Syamsyul-Arief-Resume.pdf#page=2",
}

const projectDetails: Record<string, Pick<AuthoringProject, "period" | "status" | "order" | "published" | "media" | "evidence" | "gallery" | "confirmationNotes">> = {
  modnance: {
    period: { label: "October 2026 — present", startMonth: "2026-10", endMonth: null, current: true },
    status: "in-progress",
    order: 1,
    published: true,
    confirmationNotes: ["Confirm the exact personal role title; the CV describes development work but does not supply a project role title."],
    media: {
      kind: "image", src: "/projects/modnance-workflow.svg", width: 1000, height: 760,
      alt: "Architecture illustration of the Modnance messaging, Gemini, automation, and database workflow",
    },
    evidence: [{
      id: "conversational-workflow", kind: "outcome", verified: true,
      claim: "Connects messaging, Gemini, n8n workflows, and PostgreSQL in a modular finance assistant.",
      context: "Ongoing development described in the CV. This documents implementation scope, not audited financial accuracy or production adoption.",
      source: cvPageOne,
    }],
  },
  stuntlytics: {
    period: { label: "Original project: October 2025; workspace documented in 2026", startMonth: "2025-10", endMonth: "2025-10", current: false },
    status: "prototype",
    order: 2,
    published: true,
    confirmationNotes: [
      "Confirm the exact dates of the current workspace extension. Machine-readable months currently describe the documented original hackathon only.",
      "Confirm personal versus team responsibilities for the 2026 workspace; the documented role applies to the original hackathon.",
      "Confirm the original project month versus competition participation: the CV lists October 2025, while the competition certificate in portfolio page 5 is dated September 2025.",
    ],
    media: {
      kind: "video", src: "/projects/stuntlytics-preview.mp4", width: 1280, height: 720,
      alt: "Illustrative StuntLytics project preview; not a recording of validated clinical use",
      poster: { src: "/projects/stuntlytics.jpg", width: 1024, height: 1024, alt: "Original StuntLytics project logo" },
    },
    gallery: [
      {
        kind: "image", src: "/projects/stuntlytics-dashboard-source.jpg", width: 814, height: 462,
        alt: "StuntLytics dashboard with regional indicators, follow-up priorities, and trend charts",
        caption: "Dashboard image extracted from the owner's portfolio, page 1. Figures shown are interface content, not independently verified project outcomes.",
        source: { label: "Open extracted portfolio image (page 1)", localRef: "/projects/stuntlytics-dashboard-source.jpg" },
      },
      {
        kind: "image", src: "/projects/stuntlytics-regional-risk-source.jpg", width: 369, height: 200,
        alt: "Regional Risk Intelligence map inside the StuntLytics workspace",
        caption: "Regional Risk Intelligence is a StuntLytics mapping module. Original low-resolution image extracted from the owner's portfolio, page 3.",
        source: { label: "Open extracted portfolio image (page 3)", localRef: "/projects/stuntlytics-regional-risk-source.jpg" },
      },
    ],
    evidence: [
      {
        id: "screening-inputs", kind: "metric", verified: true, value: "18", label: "structured screening inputs",
        claim: "The current local screening pipeline accepts 18 structured inputs.",
        context: "Input count documented in the current repository. It is a feature count, not a clinical performance or accuracy claim.",
        source: { label: "StuntLytics README — model and limitations", href: "https://github.com/zaenalSamsul/StuntLytics-Productiion/blob/main/README.md" },
      },
      {
        id: "synthetic-prototype", kind: "outcome", verified: true,
        claim: "Prepared synthetic family data and integrated a Random Forest decision-support workflow for the original hackathon project.",
        context: "The CV identifies the original role as Data Preprocessing & System Integration. Synthetic data is not evidence of real-world or clinical validation.",
        source: cvPageTwo,
      },
      {
        id: "regional-risk-module", kind: "outcome", verified: true,
        claim: "Regional Risk Intelligence is the regional mapping module of the StuntLytics workspace.",
        context: "The portfolio presents this map in the same application shell and links both entries to the same StuntLytics repository. It is not counted as a separate project or an independent validation result.",
        source: { label: "Regional mapping image extracted from the owner's portfolio", localRef: "/projects/stuntlytics-regional-risk-source.jpg" },
      },
    ],
  },
  mycareai: {
    period: { label: "June 2025 capstone; research extension documented in 2026", startMonth: "2025-06", endMonth: "2025-06", current: false },
    status: "prototype",
    order: 3,
    published: true,
    confirmationNotes: [
      "Confirm the exact personal role title and the division of team contributions.",
      "Confirm the months of the 2026 research extension; the CV supplies June 2025 for the original project and the portfolio describes 2025-2026 applied research.",
    ],
    media: {
      kind: "image", src: "/projects/mycareai-logo.webp", width: 1600, height: 599,
      alt: "Original MyCareAI project logo and tagline",
    },
    gallery: [{
      kind: "image", src: "/projects/mycareai-source.jpg", width: 369, height: 200,
      alt: "MyCareAI application collage showing the landing page, mood chart, and chatbot interface",
      caption: "Application presentation extracted from the owner's portfolio, page 3, at its original low resolution. It documents the interface rather than model accuracy.",
      source: { label: "Open extracted portfolio image (page 3)", localRef: "/projects/mycareai-source.jpg" },
    }],
    evidence: [
      {
        id: "emotion-service-integration", kind: "outcome", verified: true,
        claim: "Connected a TensorFlow emotion classifier, Flask inference service, Node.js gateway, and Vertex AI chatbot.",
        context: "Architecture documented in the public project README. The application is an emotion-aware prototype, not validated mental-health care.",
        source: { label: "MyCareAI README — architecture and technology", href: "https://github.com/zaenalSamsul/MyCareAi/blob/main/README.md" },
      },
      {
        id: "thesis-context-integration", kind: "outcome", verified: true,
        claim: "Extended the application with Gemini chat, optional facial-emotion context, and adaptive persona selection.",
        context: "Documented in the public thesis repository and its service code. This establishes implementation scope, not clinical effectiveness or independently measured model accuracy.",
        source: { label: "MyCareAI thesis repository", href: "https://github.com/zaenalSamsul/Mycare-Ai-Thesis" },
      },
      {
        id: "reported-text-accuracy", kind: "metric", verified: false, value: "92%", label: "reported text-classification accuracy",
        claim: "The CV reports 92% accuracy across four text emotion categories.",
        context: "Not verified for publication: the supplied evidence does not identify the text dataset, held-out split, baseline, or reproducible evaluation protocol.",
        source: cvPageTwo,
      },
    ],
  },
  "data-pipeline-sentiment-analysis": {
    period: { label: "July — November 2025", startMonth: "2025-07", endMonth: "2025-11", current: false },
    status: "completed",
    order: 4,
    published: true,
    confirmationNotes: [
      "The owner separately reports 85% accuracy for an internship NLP model. Confirm its task, dataset, label set, evaluation split, and metric calculation before publishing the number; the activity report does not supply them.",
      "The activity report covers Validator Panel, separate hybrid bot-detection work, and multilingual sentiment inference. Do not attribute the NLP accuracy claim specifically to any of these tools without confirmation.",
      "Screenshot capture dates extend beyond the CV internship period; retain July-November 2025 from the CV until the owner confirms any period change.",
    ],
    media: {
      kind: "image", src: "/projects/validator-initial-review.webp", width: 1920, height: 1200,
      alt: "Validator Panel initial data review and column mapping from the owner's internship activity report",
    },
    gallery: [
      {
        kind: "image", src: "/projects/validator-initial-review.webp", width: 1920, height: 1200,
        alt: "Validator Panel initial data validation report and column mapping controls",
        caption: "Initial review and column mapping, from the internship activity report. Counts shown belong to this example batch and are not production-volume or performance results.",
        source: { label: "Open activity-report screenshot", localRef: "/projects/validator-initial-review.webp" },
      },
      {
        kind: "image", src: "/projects/validator-llm-review.webp", width: 1920, height: 1200,
        alt: "Validator Panel review-mode selection and LLM-assisted labeling controls",
        caption: "LLM-assisted review controls, from the internship activity report. The screenshot shows configuration and workflow, rather than an evaluated model result.",
        source: { label: "Open activity-report screenshot", localRef: "/projects/validator-llm-review.webp" },
      },
    ],
    evidence: [{
      id: "validator-workflow", kind: "outcome", verified: true,
      claim: "Built a Streamlit panel for social-data retrieval, manual validation, assisted labeling, access roles, and audit trails.",
      context: "Responsibilities documented in the NoLimit Indonesia internship section of the CV. Internal implementation code is not publicly linked.",
      source: cvPageOne,
    }],
  },
  "hybrid-recommendation-system": {
    period: { label: "Not specified", startMonth: null, endMonth: null, current: false },
    status: "completed",
    order: 5,
    published: true,
    confirmationNotes: ["Confirm the personal project role and project period; the available report does not specify those dates or a formal role title."],
    media: {
      kind: "image", src: "/projects/recommendation-system.jpg", width: 1024, height: 1024,
      alt: "Hybrid movie recommendation project illustration",
    },
    evidence: [{
      id: "recommendation-workflow", kind: "outcome", verified: true,
      claim: "Implemented content-based, collaborative, and hybrid recommendation experiments on a MovieLens subset.",
      context: "The repository report documents experimental recommendations. It does not establish user impact or that the hybrid model outperforms every individual approach.",
      source: {
        label: "Movie recommendation project report",
        href: "https://github.com/zaenalSamsul/System-Rekomendasi-Film/blob/main/Laporan%20System%20Rekomendasi%20Film%20.md",
      },
    }],
  },
}

/** Authoring data. Public views must use publishedProjects instead. */
export const projects: AuthoringProject[] = projectContent.map((project) => {
  const details = projectDetails[project.slug]
  return { ...project, ...details, role: project.role ?? "Not specified", timeline: details.period.label }
})

/** This is the only evidence eligible for a public project view. */
export function getProjectEvidence(project: Pick<Project, "evidence">): ProjectEvidence[] {
  return project.evidence.filter((item) => item.verified === true).map((item) => ({ ...item, source: { ...item.source } }))
}

function publicProject(project: AuthoringProject): Project {
  const evidence = getProjectEvidence(project)
  const content: Project & { confirmationNotes?: string[] } = { ...project, evidence }
  delete content.metric
  delete content.confirmationNotes
  const metric = evidence.find((item) => item.kind === "metric" && item.value && item.label)
  return {
    ...content,
    evidence,
    ...(metric ? { metric: { value: metric.value!, label: metric.label! } } : {}),
  }
}

/** Sorted, draft-free, sanitized payloads for public server and client views. */
export const publishedProjects: Project[] = projects
  .filter((project) => project.published === true)
  .sort((a, b) => a.order - b.order)
  .map(publicProject)

export const featuredProjects: Project[] = publishedProjects.filter((project) => project.featured === true)

export type Repository = {
  name: string
  topic: string
  description: string
  href: string
}

const githubRepository = (name: string) => `https://github.com/zaenalSamsul/${name}`

export const repositories: Repository[] = [
  { name: "AgriMind", topic: "RAG / DATA TOOLS", description: "A LangGraph agent connecting PDF retrieval with structured agricultural datasets through FastAPI.", href: githubRepository("Agrimind") },
  { name: "Customer Support Agent", topic: "AGENT WORKFLOWS", description: "Retrieval, response checks, evaluation, and human escalation in a LangGraph prototype.", href: githubRepository("Customer-Support-Agent-") },
  { name: "LLM adaptation experiments", topic: "FINE-TUNING / RAG", description: "Learning notebooks exploring supervised fine-tuning, RAG, and GRPO with Hugging Face tooling.", href: githubRepository("Fine-tuning-LLM-PGABL") },
  { name: "Research Agent", topic: "TOOL-CALLING AGENTS", description: "Research across web, Wikipedia, and arXiv sources, with report generation and source links.", href: githubRepository("Research-Agent") },
  { name: "Price Tracker", topic: "MCP / SCHEDULING", description: "Wishlist and price-history tools with scheduled alerts. The scraper includes a mock fallback.", href: githubRepository("Price-Tracker-Agent") },
  { name: "Fashion Product ETL", topic: "DATA ENGINEERING", description: "An academic extraction, cleaning, and loading pipeline for CSV, PostgreSQL, and Google Sheets.", href: githubRepository("PipelineETLProdukFashion") },
]

export type Experience = {
  id: string
  role: string
  company: string
  period: string
  periodDates: ContentPeriod
  summary: string
  bullets: string[]
  tech: string[]
}

export const experiences: Experience[] = [
  {
    id: "puru-freelance",
    role: "Freelance Data & AI Engineer",
    company: "PURU Software Agency",
    period: "Current",
    periodDates: { label: "Current — start date not specified", startMonth: null, endMonth: null, current: true },
    summary: "Turning web data into structured datasets for client projects.",
    bullets: [
      "Developed web-scraping workflows for historical Facebook data from 2018 to 2026 and articles from websites.",
      "Applied ETL workflows to clean, normalize, transform, and organize scraped records for analysis and client use.",
      "Compiled structured business-partner profiles covering company information, sectors, addresses, and logos.",
    ],
    tech: ["Python", "Web Scraping", "ETL", "Data Processing"],
  },
  {
    id: "itgarut-ai-teaching-assistant",
    role: "Artificial Intelligence Teaching Assistant",
    company: "Institut Teknologi Garut",
    period: "Feb 2026 - Jul 2026",
    periodDates: { label: "February — July 2026", startMonth: "2026-02", endMonth: "2026-07", current: false },
    summary: "Helping students understand and debug machine-learning workflows.",
    bullets: [
      "Assisted AI practicum sessions covering Python, preprocessing, machine-learning implementation, and model evaluation.",
      "Helped students troubleshoot code and diagnose errors in preprocessing and model pipelines.",
      "Emphasized understanding the cause of errors and the reasoning behind each solution.",
    ],
    tech: ["Python", "Machine Learning", "Data Preprocessing", "Model Evaluation"],
  },
  {
    id: "nolimit-data-science-intern",
    role: "Data Science Intern",
    company: "NoLimit Indonesia",
    period: "Jul 2025 - Nov 2025",
    periodDates: { label: "July — November 2025", startMonth: "2025-07", endMonth: "2025-11", current: false },
    summary: "Developed data workflows, NLP models, and review tools for social-media analysis.",
    bullets: [
      "Collected, cleaned, and analyzed digital and social-media data using Python and Elasticsearch to support model development and actionable insights.",
      "Built a Streamlit Validator Panel combining API and file retrieval, manual sentiment review, semantic clustering, LLM-assisted labeling, access roles, and audit trails.",
      "Trained and evaluated NLP models for social-media text analysis; collaborated with the team on testing and optimization for digital monitoring and sentiment analysis.",
      "Prototyped hybrid bot detection using behavioral rules and profile-image classification, and implemented language-specific sentiment inference for English, Mandarin, Malay/Indonesian, and Tamil.",
    ],
    tech: ["Python", "Machine Learning", "NLP", "Streamlit", "Elasticsearch", "Hugging Face"],
  },
]

export const education = {
  institution: "Institut Teknologi Garut",
  degree: "Bachelor of Informatics Engineering",
  period: "September 2022 - September 2026",
  periodDates: { label: "September 2022 — September 2026", startMonth: "2022-09", endMonth: "2026-09", current: false },
  gpa: "3.92 / 4.00",
}

export const training = [
  {
    title: "Machine Learning Engineer Cohort",
    provider: "Coding Camp powered by DBS Foundation",
    period: "February - July 2025",
    periodDates: { label: "February — July 2025", startMonth: "2025-02", endMonth: "2025-07", current: false },
    description:
      "Project-based training in machine learning, deep learning, NLP, computer vision, ETL, recommendation systems, and model evaluation.",
  },
]

export const achievements = [
  {
    title: "LLM-based Generative AI Development",
    provider: "Dicoding Indonesia",
    date: "July 2026",
    description: "RAG, LLM fine-tuning, PEFT / LoRA, quantization, and model optimization.",
    href: "https://bit.ly/SertifikatZaenalSyamsyulArief",
  },
  {
    title: "Building Gen AI Applications with Microsoft Azure",
    provider: "Dicoding Indonesia",
    date: "April 2026",
    description: "Azure AI Foundry, model deployment, and Responsible AI.",
    href: "https://bit.ly/SertifikatZaenalSyamsyulArief",
  },
  {
    title: "Machine Learning Engineer",
    provider: "DBS Foundation & Dicoding Academy",
    date: "July 2025",
    description: "Selected as one of 2,500 participants from 63,000 applicants across 374 universities.",
    href: "https://bit.ly/SertifikatZaenalSyamsyulArief",
  },
]

export type SkillGroup = { title: string; skills: string[]; relatedProjectSlugs: string[] }

export const skillGroups: SkillGroup[] = [
  { title: "Machine Learning", skills: ["Python", "TensorFlow", "Keras", "Scikit-learn", "NLP", "Computer Vision", "Model Evaluation"], relatedProjectSlugs: ["stuntlytics", "mycareai", "hybrid-recommendation-system"] },
  { title: "Generative AI", skills: ["LLMs", "RAG", "Fine-tuning", "Hugging Face Transformers", "PEFT", "PyTorch"], relatedProjectSlugs: ["modnance", "mycareai"] },
  { title: "Data & Backend", skills: ["SQL", "Pandas", "NumPy", "FastAPI", "PostgreSQL", "Elasticsearch", "REST APIs"], relatedProjectSlugs: ["data-pipeline-sentiment-analysis", "stuntlytics", "modnance"] },
  { title: "Tools & Workflows", skills: ["Git", "GitHub", "Docker", "n8n", "Web Scraping", "Jupyter", "Google Colab"], relatedProjectSlugs: ["modnance", "data-pipeline-sentiment-analysis"] },
]
