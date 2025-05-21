"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectsSectionProps {
  onClose: () => void
}

interface Project {
  id: string
  title: string
  description: string
  icon: string
  color: string
  github: string
  demo?: string
  technologies: string[]
}

export function ProjectsSection({ onClose }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const projects: Project[] = [
    {
      id: "slicesense",
      title: "SliceSense",
      description:
        "Medical imaging analysis platform using regression techniques to identify and classify anomalies in medical scans.",
      icon: "linear-regression",
      color: "#ff4a9e",
      github: "https://github.com/iamhamidrezaee/SliceSense",
      technologies: ["PyTorch", "TensorFlow", "Flask", "Docker"],
    },
    {
      id: "research",
      title: "ReSearch",
      description:
        "Research paper clustering and recommendation system that uses NLP and clustering algorithms to group similar papers.",
      icon: "clustering",
      color: "#4ecdc4",
      github: "https://github.com/iamhamidrezaee/ReSearch",
      technologies: ["scikit-learn", "NLTK", "Flask", "AWS"],
    },
    {
      id: "alignment-arena",
      title: "Alignment-Arena",
      description:
        "LLM alignment evaluation framework using transformer architectures to measure and improve model alignment with human values.",
      icon: "transformer",
      color: "#ff9e4a",
      github: "https://github.com/iamhamidrezaee/Alignment-Arena",
      technologies: ["Hugging Face", "PyTorch", "AWS Bedrock", "SageMaker"],
    },
    {
      id: "tune",
      title: "TUNE",
      description:
        "Fine-tuning optimization platform for large language models using gradient descent and other optimization techniques.",
      icon: "gradient-descent",
      color: "#9e4aff",
      github: "https://github.com/iamhamidrezaee/TUNE",
      technologies: ["PyTorch", "TensorFlow", "Docker", "AWS"],
    },
  ]

  const getProjectById = (id: string) => projects.find((p) => p.id === id)

  const renderProjectIcon = (icon: string) => {
    switch (icon) {
      case "linear-regression":
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff4a9e]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 17L9 11L13 15L21 7"
                stroke="#ff4a9e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      case "clustering":
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4ecdc4]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="3" stroke="#4ecdc4" strokeWidth="2" />
              <circle cx="16" cy="16" r="3" stroke="#4ecdc4" strokeWidth="2" />
              <circle cx="16" cy="8" r="3" stroke="#4ecdc4" strokeWidth="2" />
            </svg>
          </div>
        )
      case "transformer":
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff9e4a]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="#ff9e4a" strokeWidth="2" />
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="#ff9e4a" strokeWidth="2" />
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="#ff9e4a" strokeWidth="2" />
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="#ff9e4a" strokeWidth="2" />
              <path d="M10 7H14" stroke="#ff9e4a" strokeWidth="2" />
              <path d="M7 10V14" stroke="#ff9e4a" strokeWidth="2" />
              <path d="M17 10V14" stroke="#ff9e4a" strokeWidth="2" />
            </svg>
          </div>
        )
      case "gradient-descent":
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9e4aff]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20L4 4" stroke="#9e4aff" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 16V4H16" stroke="#9e4aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" stroke="#9e4aff" strokeWidth="2" />
              <path d="M12 12L16 8" stroke="#9e4aff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-4xl p-6 rounded-lg bg-[#0a0a20] border border-[#4a4a8a] shadow-xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-[#2a2a4a] text-white/70 hover:text-white hover:bg-[#3a3a6a] transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">ML Project Universe</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#4a9eff] to-[#9e4aff]"></div>
          </div>

          {selectedProject ? (
            <ProjectDetail project={getProjectById(selectedProject)!} onBack={() => setSelectedProject(null)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] cursor-pointer hover:bg-[#2a2a4a] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-start gap-4">
                    {renderProjectIcon(project.icon)}
                    <div>
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <p className="text-[#b4b4d0] mt-2 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface ProjectDetailProps {
  project: Project
  onBack: () => void
}

function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 rounded-md bg-[#2a2a4a] text-white/70 hover:text-white hover:bg-[#3a3a6a] transition-colors flex items-center gap-2 text-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 19L5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Projects
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <div className="w-8 h-8" style={{ color: project.color }}>
              {/* Project icon would go here */}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden bg-[#1a1a30]">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt={project.title}
            width={800}
            height={400}
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">Overview</h4>
          <p className="text-[#b4b4d0]">{project.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 text-sm rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#2a2a4a] text-white hover:bg-[#3a3a6a] transition-colors"
          >
            <Github size={18} />
            View on GitHub
          </Link>

          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a9eff] text-white hover:bg-[#3a8eff] transition-colors"
            >
              <ExternalLink size={18} />
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
