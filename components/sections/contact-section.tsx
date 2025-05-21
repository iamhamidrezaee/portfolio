"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Mail, Linkedin, Github, Send } from "lucide-react"

interface ContactSectionProps {
  onClose: () => void
}

export function ContactSection({ onClose }: ContactSectionProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after submission
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset submission status after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1500)
  }

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
            <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#ff9e4a] to-[#ff4a9e]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <p className="text-[#b4b4d0]">
                Feel free to reach out if you're interested in discussing ML research, LLM innovations, or creative
                ventures.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2a2a4a]">
                    <Mail size={18} className="text-[#ff9e4a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8aaa]">Email</p>
                    <a href="mailto:hr328@cornell.edu" className="text-white hover:text-[#ff9e4a] transition-colors">
                      hr328@cornell.edu
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2a2a4a]">
                    <Linkedin size={18} className="text-[#ff9e4a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8aaa]">LinkedIn</p>
                    <a
                      href="https://linkedin.com/in/iamhamidrezaee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#ff9e4a] transition-colors"
                    >
                      @iamhamidrezaee
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2a2a4a]">
                    <Github size={18} className="text-[#ff9e4a]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#8a8aaa]">GitHub</p>
                    <a
                      href="https://github.com/iamhamidrezaee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#ff9e4a] transition-colors"
                    >
                      @iamhamidrezaee
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-[#8a8aaa] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a30] border border-[#3a3a6a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff9e4a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-[#8a8aaa] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a30] border border-[#3a3a6a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff9e4a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-[#8a8aaa] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a30] border border-[#3a3a6a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff9e4a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-[#8a8aaa] mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-[#1a1a30] border border-[#3a3a6a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff9e4a] focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                    isSubmitted ? "bg-green-600 hover:bg-green-700" : "bg-[#ff9e4a] hover:bg-[#ff8a3a]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Message Sent!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={18} />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
