"use client"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface SkillsSectionProps {
  onClose: () => void
}

interface SkillCategory {
  name: string
  color: string
  skills: Skill[]
}

interface Skill {
  name: string
  level: number
  description: string
}

export function SkillsSection({ onClose }: SkillsSectionProps) {
  const skillCategories: SkillCategory[] = [
    {
      name: "Machine Learning",
      color: "#4a9eff",
      skills: [
        {
          name: "PyTorch",
          level: 90,
          description: "Deep learning framework for building neural networks and ML models",
        },
        {
          name: "TensorFlow",
          level: 75,
          description: "End-to-end ML platform for model development and deployment",
        },
        {
          name: "scikit-learn",
          level: 95,
          description: "Machine learning library for classical ML algorithms",
        },
        {
          name: "Model Optimization",
          level: 98,
          description: "Performance optimization, latency reduction, and efficient model deployment",
        },
      ],
    },
    {
      name: "LLM & Cloud",
      color: "#9e4aff",
      skills: [
        {
          name: "Hugging Face",
          level: 90,
          description: "State-of-the-art NLP models and libraries",
        },
        {
          name: "Ollama",
          level: 87,
          description: "Local LLM deployment and optimization for edge computing",
        },
        {
          name: "Deployments",
          level: 80,
          description: "Experience with deploying ML models in production environments",
        },
        {
          name: "Transformers",
          level: 85,
          description: "Deep understanding of transformer architectures",
        },
      ],
    },
    {
      name: "Backend & Deployment",
      color: "#4aff9e",
      skills: [
        {
          name: "Flask",
          level: 90,
          description: "Python web framework for API development",
        },
        {
          name: "Git",
          level: 95,
          description: "Version control and collaboration",
        },
        {
          name: "AWS",
          level: 80,
          description: "Cloud infrastructure and services",
        },
      ],
    },
    {
      name: "Programming",
      color: "#ff4a9e",
      skills: [
        {
          name: "Python",
          level: 95,
          description: "Primary programming language for ML and backend",
        },
        {
          name: "TypeScript",
          level: 98,
          description: "Type-safe development with React and modern frontend frameworks",
        },
        {
          name: "React/TSX",
          level: 95,
          description: "Building interactive UIs with React and TypeScript",
        },
        {
          name: "JavaScript",
          level: 75,
          description: "Web development and interactive visualizations",
        },
        {
          name: "Java",
          level: 70,
          description: "Solid foundation in Java for backend development",
        },
      ],
    },
  ]

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
            <h2 className="text-3xl font-bold text-white">Skills & Expertise</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#4aff9e] to-[#4a9eff]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category) => (
              <motion.div
                key={category.name}
                className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4" style={{ color: category.color }}>
                  {category.name}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{skill.name}</span>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: category.color }}>
                          {skill.level}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#2a2a4a] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: category.color,
                            width: `${skill.level}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        ></motion.div>
                      </div>

                      <p className="text-sm text-[#b4b4d0]">{skill.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
