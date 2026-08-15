export const siteConfig = {
  name: "Zaenal Syamsyul Arief",
  role: "AI Engineer & Data Scientist",
  email: "zaenalsyamsyularief@gmail.com",
  phone: "+62 812 1386 1662",
  location: "Garut, Indonesia",
  github: "https://github.com/zaenalSamsul",
  linkedin: "https://www.linkedin.com/in/zaenal-syamsyul-arief",
  website: "https://zaenalsyamsyularief-porto.vercel.app",
  resume: "/Zaenal-Syamsyul-Arief-Resume.pdf",
}

export type ProjectLink = {
  label: string
  href: string
  kind: "github" | "demo"
}

export type Project = {
  slug: string
  name: string
  shortName: string
  category: string
  description: string
  image: string
  imageAlt: string
  featured: boolean
  metric?: { value: string; label: string }
  role?: string
  timeline?: string
  problem: string
  approach: string
  built: string[]
  challenges: string[]
  results: string[]
  learnings: string[]
  workflow: string[]
  tech: string[]
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    slug: "mycareai",
    name: "MyCareAI",
    shortName: "MyCareAI",
    category: "APPLIED AI / NLP",
    description:
      "A mental-health companion that classifies emotion from personal journal entries and supports users through an AI chatbot.",
    image: "/projects/mycareai.png",
    imageAlt: "MyCareAI product logo",
    featured: true,
    metric: { value: "92%", label: "emotion classification accuracy" },
    role: "Capstone Project Lead",
    timeline: "June 2025",
    problem:
      "People need a low-friction way to reflect on their emotional state and recognize mood patterns from the text they already write.",
    approach:
      "The application separates the user-facing web experience, the core Node.js service, and a Python classification service. Text input is classified by an NLP model, stored as an emotion record, and paired with an LLM-powered chatbot experience.",
    built: [
      "An NLP emotion-classification service for free-form journal entries.",
      "A web experience for mood analysis, emotion history, educational articles, and chatbot support.",
      "Service integration across Node.js, Flask, TensorFlow, and Google Vertex AI.",
    ],
    challenges: [
      "Connecting the classification model and chatbot to a cohesive web flow.",
      "Keeping AI inference responsibilities separated from the main application service.",
    ],
    results: [
      "Reached 92% accuracy on the emotion-classification model.",
      "Delivered an end-to-end capstone product that connects model inference to a usable interface.",
    ],
    learnings: [
      "Service boundaries make model iteration easier without coupling it to the product interface.",
      "AI output needs clear product context to become useful to an end user.",
    ],
    workflow: ["Journal text", "Text preprocessing", "NLP classifier", "Flask API", "Web app", "Mood insight + chatbot"],
    tech: ["Python", "TensorFlow", "NLP", "Google Vertex AI", "Node.js", "Flask"],
    links: [{ label: "GitHub", href: "https://github.com/zaenalSamsul/MyCareAi", kind: "github" }],
  },
  {
    slug: "data-pipeline-sentiment-analysis",
    name: "Data Pipeline & Sentiment Analysis",
    shortName: "Sentiment Pipeline",
    category: "DATA ENGINEERING / NLP",
    description:
      "An automated pipeline that turns incoming social-media data into indexed, queryable sentiment insights.",
    image: "/projects/data-pipeline.jpg",
    imageAlt: "Data Pipeline and Sentiment Analysis project graphic",
    featured: true,
    role: "Data Science Intern",
    timeline: "July – November 2025",
    problem:
      "Social-media data arrives continuously and needs consistent extraction, transformation, classification, and indexing before analysts can use it.",
    approach:
      "A Python ETL workflow processes incoming social data, runs NLP sentiment classification, and stores the transformed output in Elasticsearch for efficient search and analysis.",
    built: [
      "Automated extraction, transformation, and processing for social-media data.",
      "A sentiment-classification stage for public text data.",
      "Elasticsearch indexing to support downstream search and analysis.",
    ],
    challenges: [
      "Keeping transformations consistent across continuously arriving text data.",
      "Structuring indexed documents for practical downstream queries.",
    ],
    results: [
      "Connected raw social-media inputs to queryable sentiment outputs in one pipeline.",
      "Supported internal analysis with Python-based data tooling.",
    ],
    learnings: [
      "Reliable AI products depend on observable and repeatable data preparation.",
      "Index design is part of the product when insights need to be retrieved quickly.",
    ],
    workflow: ["Social data", "Extraction", "Transformation", "NLP classifier", "Elasticsearch", "Analysis output"],
    tech: ["Python", "Elasticsearch", "ETL", "NLP", "Machine Learning", "Data Engineering"],
    links: [],
  },
  {
    slug: "stuntlytics",
    name: "StuntLytics",
    shortName: "StuntLytics",
    category: "MACHINE LEARNING / ANALYTICS",
    description:
      "A stunting-risk prediction and analytics system designed to support data-informed monitoring for local government.",
    image: "/projects/stuntlytics.jpg",
    imageAlt: "StuntLytics project logo",
    featured: true,
    metric: { value: "100K", label: "synthetic data records" },
    problem:
      "Stunting-risk factors need to be consolidated and interpreted so decision-makers can identify cases that require attention.",
    approach:
      "The system applies feature engineering and a scikit-learn prediction workflow to a 100,000-record synthetic dataset, then exposes analysis and predictions through a Streamlit dashboard.",
    built: [
      "A machine-learning workflow for stunting-risk prediction.",
      "Feature preparation across contributing risk factors.",
      "An interactive Streamlit dashboard for exploring results.",
    ],
    challenges: [
      "Representing multiple risk factors in a model-ready feature set.",
      "Presenting predictions in a format that supports monitoring and reporting.",
    ],
    results: [
      "Processed a synthetic dataset containing 100,000 records.",
      "Delivered model output through an interactive analytics dashboard.",
    ],
    learnings: [
      "Model output is more actionable when paired with understandable context and exploration tools.",
      "Synthetic data is useful for prototyping but should be distinguished clearly from production data.",
    ],
    workflow: ["Risk-factor data", "Feature engineering", "ML model", "Prediction layer", "Streamlit", "Dashboard insight"],
    tech: ["Python", "Scikit-learn", "Streamlit", "Elasticsearch", "Data Analysis"],
    links: [
      { label: "GitHub", href: "https://github.com/zaenalSamsul/StuntLytics-Aphacton", kind: "github" },
      { label: "Demo video", href: "https://www.youtube.com/watch?v=9pT6OBXhEdw", kind: "demo" },
    ],
  },
  {
    slug: "hybrid-recommendation-system",
    name: "Hybrid Recommendation System",
    shortName: "Hybrid Recommender",
    category: "RECOMMENDATION SYSTEMS",
    description:
      "A movie recommendation engine combining content-based and collaborative approaches for more robust suggestions.",
    image: "/projects/recommendation-system.jpg",
    imageAlt: "Hybrid Recommendation System project graphic",
    featured: false,
    problem:
      "A single recommendation strategy can struggle with sparse interaction data or limited item context.",
    approach:
      "The project combines item-feature similarity with patterns from user-item interactions, bringing content-based and collaborative filtering into one recommendation workflow.",
    built: [
      "Content-based recommendations from movie attributes.",
      "Collaborative filtering from user-item interaction patterns.",
      "A hybrid recommendation workflow that combines both strategies.",
    ],
    challenges: [
      "Balancing signals from item similarity and user interaction patterns.",
      "Designing around data sparsity and cold-start constraints.",
    ],
    results: ["Produced top-N movie recommendations through both content-based and collaborative methods."],
    learnings: [
      "Different recommendation methods fail in different ways, so combining them creates a more resilient system.",
    ],
    workflow: ["Movie + rating data", "Data preparation", "CBF + collaborative model", "Hybrid ranking", "Top-N output"],
    tech: ["Python", "Scikit-learn", "Machine Learning", "Recommendation Systems", "Data Analysis"],
    links: [
      { label: "GitHub", href: "https://github.com/zaenalSamsul/System-Rekomendasi-Film", kind: "github" },
    ],
  },
]

export const experiences = [
  {
    role: "Data Science Intern",
    company: "NoLimit Indonesia",
    period: "Jul 2025 — Nov 2025",
    summary: "Built data systems for social-media analysis.",
    bullets: [
      "Built automated Python pipelines to extract, transform, and process social-media data.",
      "Developed sentiment classification for public text data and indexed outputs in Elasticsearch.",
      "Created internal Python tools to streamline recurring analysis workflows.",
    ],
    tech: ["Python", "TensorFlow", "Elasticsearch", "SQL", "Machine Learning"],
  },
  {
    role: "Machine Learning Engineer Cohort",
    company: "Coding Camp — DBS Foundation",
    period: "Feb 2025 — Jul 2025",
    summary: "Developed end-to-end machine-learning workflows.",
    bullets: [
      "Built machine-learning workflows with Python, TensorFlow, and scikit-learn.",
      "Applied deep-learning techniques to NLP and Computer Vision use cases.",
      "Designed ETL pipelines to prepare data for model development.",
    ],
    tech: ["Python", "TensorFlow", "Scikit-learn", "NLP", "Computer Vision"],
  },
  {
    role: "Capstone Project Lead",
    company: "MyCareAI",
    period: "Jun 2025",
    summary: "Connected emotion classification to a usable AI product.",
    bullets: [
      "Built an NLP model that classifies emotion from user-written journal entries.",
      "Designed a dual-service AI architecture that reached 92% classification accuracy.",
      "Integrated model inference and an LLM-powered chatbot into a web application.",
    ],
    tech: ["Python", "TensorFlow", "NLP", "Google Vertex AI", "React"],
  },
]

export const skillGroups = [
  { title: "AI / Machine Learning", skills: ["Python", "TensorFlow", "Keras", "Scikit-learn", "Deep Learning"] },
  { title: "Applied AI", skills: ["LLM Integration", "NLP", "Computer Vision", "Recommendation Systems"] },
  { title: "Data", skills: ["Pandas", "NumPy", "SQL", "PostgreSQL", "Elasticsearch", "Web Scraping"] },
  { title: "Tools & Deployment", skills: ["Git", "Google Cloud", "Model Deployment", "Jupyter"] },
]
