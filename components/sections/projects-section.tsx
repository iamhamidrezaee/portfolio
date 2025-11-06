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
      id: "research",
      title: "ReSearch",
      description:
        "A platform for retrieving high-quality–conference-approved and/or highly-influential–research papers in an instant.",
      icon: "clustering",
      color: "#4ecdc4",
      github: "https://github.com/iamhamidrezaee/ReSearch",
      technologies: ["Information Retrieval", "Flask", "Single Value Decomposition (SVD)", "TF-IDF", "Storage Optimization"],
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
    },
  ]

  const getProjectById = (id: string) => projects.find((p) => p.id === id)

  // Function to extract GitHub repo info and construct OpenGraph image URL
  const getGitHubImageUrl = (githubUrl: string) => {
    try {
      const url = new URL(githubUrl)
      const pathParts = url.pathname.split('/').filter(Boolean)
      if (pathParts.length >= 2) {
        const username = pathParts[0]
        const repoName = pathParts[1]
        // GitHub's OpenGraph API for repository social preview images
        return `https://opengraph.githubassets.com/1/${username}/${repoName}`
      }
    } catch (error) {
      console.error('Error parsing GitHub URL:', error)
    }
    return null
  }

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
      case "medical-imaging":
        return (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4a9eff]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#4a9eff" strokeWidth="2" />
              <path d="M4 9H20" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 14H20" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 4V20" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 4V20" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.5" fill="#4a9eff" />
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
            <ProjectDetail 
              project={getProjectById(selectedProject)!} 
              onBack={() => setSelectedProject(null)}
              getGitHubImageUrl={getGitHubImageUrl}
            />
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
  getGitHubImageUrl: (url: string) => string | null
}

function ProjectDetail({ project, onBack, getGitHubImageUrl }: ProjectDetailProps) {
  const [imageError, setImageError] = useState(false)
  const githubImageUrl = getGitHubImageUrl(project.github)

  // Fallback gradient background based on project color
  const fallbackStyle = {
    background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: project.color,
  }

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
        
        <div className="aspect-video relative rounded-lg overflow-hidden bg-[#1a1a30] border border-[#3a3a6a]">
          {githubImageUrl && !imageError ? (
            <Image
              src={githubImageUrl}
              alt={`${project.title} repository preview`}
              width={800}
              height={400}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="w-full h-full" style={fallbackStyle}>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <div>{project.title}</div>
                <div className="text-sm opacity-70 mt-1">GitHub Repository</div>
              </div>
            </div>
          )}
          
          {/* Overlay with project info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-semibold text-lg">{project.title}</h4>
              <p className="text-white/80 text-sm mt-1 line-clamp-2">{project.description}</p>
            </div>
          </div>
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