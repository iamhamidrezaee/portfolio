"use client"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface AboutSectionProps {
  onClose: () => void
}

export function AboutSection({ onClose }: AboutSectionProps) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-3xl p-6 rounded-lg bg-[#0a0a20] border border-[#4a4a8a] shadow-xl"
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
            <h2 className="text-3xl font-bold text-white">About Me</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#4a9eff] to-[#ff4a9e]"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a]">
                <h3 className="text-xl font-semibold text-white mb-2">Hamid Rezaee</h3>
                <p className="text-[#b4b4d0] font-medium">
                  Information Science Undergraduate @ Cornell University, Class of 2026
                </p>
              </div>

              <div className="space-y-4 text-[#b4b4d0]">
                <p>
                  Driven machine learning engineer skilled in building ML solutions leveraging PyTorch, TensorFlow,
                  and scikit-learn, with robust backend experience utilizing Flask, Docker, AWS, and Git.
                </p>
                <p>
                  Specializing in large language models (LLMs) with Hugging Face and
                  Transformer architectures.
                </p>
                <p>
                  Also an avid creative writer, filmmaker, and gamer (especially NFS Unbound). Enthusiastically open to
                  discussions around ML research, LLM innovations, or creative ventures.
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] h-full">
                <h3 className="text-xl font-semibold text-white mb-4">Growth Trajectory</h3>

                <div className="space-y-4">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#4a9eff]">ML Engineering</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#4a9eff]">90%</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2a2a4a]">
                      <div
                        style={{ width: "90%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#4a9eff]"
                      ></div>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#ff4a9e]">LLM Development</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#ff4a9e]">85%</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2a2a4a]">
                      <div
                        style={{ width: "85%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#ff4a9e]"
                      ></div>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#4aff9e]">Backend Development</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#4aff9e]">80%</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2a2a4a]">
                      <div
                        style={{ width: "80%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#4aff9e]"
                      ></div>
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#9e4aff]">Cloud Infrastructure</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-[#9e4aff]">75%</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2a2a4a]">
                      <div
                        style={{ width: "75%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#9e4aff]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
