export interface Project {
  id: string
  title: string
  description: string
  icon: string
  color: string
  github: string
  demo?: string
  technologies: string[]
  image: string
}

export const projects: Project[] = [
  {
    id: "research",
    title: "ReSearch",
    description:
      "A platform for retrieving high-quality–conference-approved and/or highly-influential–research papers in an instant.",
    icon: "clustering",
    color: "#4ecdc4",
    github: "https://github.com/iamhamidrezaee/ReSearch",
    technologies: ["Information Retrieval", "Flask", "Single Value Decomposition (SVD)", "TF-IDF", "Storage Optimization"],
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: "alignment-arena",
    title: "Alignment-Arena",
    description:
      "A novel framework for quantifying and comparing alignment in masked language models (MLMs) across dimensions of sex, gender, race, culture, religion, and ethnicity.",
    icon: "transformer",
    color: "#ff9e4a",
    github: "https://github.com/iamhamidrezaee/Alignment-Arena",
    technologies: ["Hugging Face", "PyTorch", "Transformers"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: "tune",
    title: "TUNE",
    description:
      "TUNE is a streamlined platform that simplifies the LLM fine-tuning process into just three clicks.",
    icon: "gradient-descent",
    color: "#9e4aff",
    github: "https://github.com/iamhamidrezaee/TUNE",
    technologies: ["Hugging Face", "PyTorch"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop&auto=format",
  },
  {
    id: "slicesense",
    title: "SliceSense",
    description:
      "A deep learning framework for predicting z-axis slice thickness of 3D medical images (MRI/CT) from 2D slices using CNN + BiLSTM + Self-Attention architecture.",
    icon: "medical-imaging",
    color: "#4a9eff",
    github: "https://github.com/iamhamidrezaee/SliceSense",
    technologies: ["PyTorch", "ResNet-18", "BiLSTM", "Self-Attention", "Medical Imaging", "NIfTI"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&auto=format",
  },
]

