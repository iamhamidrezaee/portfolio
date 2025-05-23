"use client"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { X, Mail, Linkedin, Github, MapPin, Calendar, Coffee } from "lucide-react"

interface ContactSectionProps {
  onClose: () => void
}

export function ContactSection({ onClose }: ContactSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const contactMethods = [
    {
      id: "email",
      icon: Mail,
      label: "Email",
      value: "hr328@cornell.edu",
      href: "mailto:hr328@cornell.edu",
      description: "Best for formal inquiries and collaborations"
    },
    {
      id: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      value: "@iamhamidrezaee",
      href: "https://linkedin.com/in/iamhamidrezaee",
      description: "Connect for professional networking"
    },
    {
      id: "github",
      icon: Github,
      label: "GitHub",
      value: "@iamhamidrezaee",
      href: "https://github.com/iamhamidrezaee",
      description: "Check out my latest projects and contributions"
    }
  ]

  const additionalInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: "Ithaca, NY",
      description: "Cornell University"
    },
    {
      icon: Calendar,
      label: "Availability",
      value: "Open to opportunities",
      description: "Research collaborations & ML projects"
    },
    {
      icon: Coffee,
      label: "Let's Chat",
      value: "Always up for a discussion",
      description: "ML research, LLMs, or creative ventures"
    }
  ]

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-4xl p-8 rounded-lg bg-[#0a0a20] border border-[#4a4a8a] shadow-xl"
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

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Get in Touch</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#ff9e4a] to-[#ff4a9e] mx-auto"></div>
            <p className="text-[#b4b4d0] text-lg max-w-2xl mx-auto">
              Feel free to reach out if you're interested in discussing ML research, LLM innovations, or creative ventures. 
              I'm always excited to connect with fellow researchers and innovators.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white text-center">Contact Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <motion.a
                    key={method.id}
                    href={method.href}
                    target={method.id !== "email" ? "_blank" : undefined}
                    rel={method.id !== "email" ? "noopener noreferrer" : undefined}
                    className="block p-6 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] hover:border-[#ff9e4a] transition-all duration-300 group"
                    onMouseEnter={() => setHoveredCard(method.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#2a2a4a] group-hover:bg-[#ff9e4a] transition-colors">
                        <IconComponent size={24} className="text-[#ff9e4a] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm text-[#8a8aaa] mb-1">{method.label}</p>
                        <p className="text-white font-medium group-hover:text-[#ff9e4a] transition-colors">
                          {method.value}
                        </p>
                      </div>
                      <p className="text-xs text-[#8a8aaa] group-hover:text-[#b4b4d0] transition-colors">
                        {method.description}
                      </p>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white text-center">Additional Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalInfo.map((info, index) => {
                const IconComponent = info.icon
                return (
                  <motion.div
                    key={index}
                    className="p-6 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2a2a4a]">
                        <IconComponent size={20} className="text-[#ff9e4a]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#8a8aaa] mb-1">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                      <p className="text-xs text-[#8a8aaa]">{info.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-r from-[#ff9e4a]/10 to-[#ff4a9e]/10 border border-[#ff9e4a]/20">
            <p className="text-[#b4b4d0] mb-4">
              Ready to collaborate or just want to say hello? I'd love to hear from you!
            </p>
            <motion.a
              href="mailto:hr328@cornell.edu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff9e4a] hover:bg-[#ff8a3a] text-white font-medium rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
              Send me an email
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}