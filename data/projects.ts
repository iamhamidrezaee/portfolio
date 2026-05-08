export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  description: string
  context: string
  icon: string
  color: string
  github?: string
  demo?: string
  status?: string
  technologies: string[]
  image?: string
  links?: ProjectLink[]
}

export const projects: Project[] = [
  {
    id: "kinda-like",
    title: "Kinda-Like",
    context: "Research / labor-market intelligence",
    description:
      "Aggregate labor-market research interface for exploring job-title similarity, skill structure, geographic patterns, and compensation caveats from approved research datasets.",
    icon: "network",
    color: "#d8d0c0",
    status: "Research-only framing; repo kept private",
    technologies: ["NLP", "Embeddings", "Research Data", "Visualization", "Agentic Search"],
  },
  {
    id: "convowizard",
    title: "ConvoWizard / craft-live",
    context: "CornellNLP research contribution",
    description:
      "Wikipedia talk-page integration work for ConvoWizard, including interaction flow, scoring behavior, token handling, installation guidance, and local verification tooling.",
    icon: "moderation",
    color: "#c9b89a",
    status: "Attributed CornellNLP work; repo not linked",
    technologies: ["JavaScript", "Wikipedia", "NLP", "E2E Testing", "HCI"],
  },
  {
    id: "ofas-web",
    title: "OFAS-Web",
    context: "Community website / CMS",
    description:
      "Full-stack Next.js and Payload CMS site for Cornell's Organization for Afghan Students, with editable events, news, resources, galleries, team pages, and content workflows.",
    icon: "cms",
    color: "#a9b0a2",
    status: "Private repo; public site is live",
    demo: "https://www.ofas.info/",
    technologies: ["Next.js", "Payload CMS", "PostgreSQL", "Vercel", "Content Modeling"],
  },
  {
    id: "path-match",
    title: "PathMatch",
    context: "Mentorship platform",
    description:
      "Cornell CIS mentoring platform connecting underclassmen with graduating seniors for course planning, internship questions, and career guidance.",
    icon: "mentorship",
    color: "#bec7c2",
    github: "https://github.com/iamhamidrezaee/path-match",
    technologies: ["React", "Firebase", "Matching", "Student Tools"],
  },
  {
    id: "research",
    title: "ReSearch",
    context: "Academic discovery",
    description:
      "Research-paper discovery interface for finding conference-approved and influential NLP papers through retrieval, ranking, and exploration.",
    icon: "clustering",
    color: "#b7c8c4",
    github: "https://github.com/iamhamidrezaee/ReSearch",
    technologies: ["Information Retrieval", "Flask", "SVD", "TF-IDF", "Storage Optimization"],
  },
  {
    id: "tune",
    title: "TUNE",
    context: "Fine-tuning workflow",
    description:
      "Prototype interface for making LLM fine-tuning easier to prepare, run, and understand without burying the user in training plumbing.",
    icon: "gradient-descent",
    color: "#b9abc7",
    github: "https://github.com/iamhamidrezaee/TUNE",
    status: "Public README cleaned for setup clarity",
    technologies: ["Hugging Face", "PyTorch", "Fine-Tuning", "Developer Tools"],
  },
  {
    id: "slicesense",
    title: "SliceSense",
    context: "Medical-imaging research",
    description:
      "Deep-learning framework for estimating z-axis slice thickness in 3D medical images from 2D slices using CNN, BiLSTM, and attention layers.",
    icon: "medical-imaging",
    color: "#aebbd0",
    github: "https://github.com/iamhamidrezaee/SliceSense",
    status: "README now includes public data-use guardrails",
    technologies: ["PyTorch", "ResNet-18", "BiLSTM", "Self-Attention", "Medical Imaging"],
  },
  {
    id: "alignment-arena",
    title: "Alignment-Arena",
    context: "Model evaluation",
    description:
      "Framework for comparing masked-language-model behavior across demographic and cultural dimensions. Kept here as prior work while the public README is cleaned.",
    icon: "transformer",
    color: "#c2b29c",
    github: "https://github.com/iamhamidrezaee/Alignment-Arena",
    status: "Public README cleaned to remove private contact details",
    technologies: ["Hugging Face", "PyTorch", "Transformers", "Evaluation"],
  },
]
