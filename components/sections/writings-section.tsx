"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Calendar, Clock } from "lucide-react"

interface WritingsSectionProps {
  onClose: () => void
}

interface Writing {
  id: string
  title: string
  date: string
  readTime: string
  excerpt: string
  content: string
  category: string
}

export function WritingsSection({ onClose }: WritingsSectionProps) {
  const [selectedWriting, setSelectedWriting] = useState<string | null>(null)

  const writings: Writing[] = [
    {
      id: "llm-alignment",
      title: "The Challenges of LLM Alignment",
      date: "April 15, 2023",
      readTime: "8 min read",
      excerpt:
        "Exploring the technical and philosophical challenges in aligning large language models with human values and intentions.",
      content: `
        # The Challenges of LLM Alignment

        Large Language Models (LLMs) have demonstrated remarkable capabilities in understanding and generating human language. However, ensuring these models act in accordance with human values and intentions—a problem known as alignment—remains a significant challenge.

        ## What is Alignment?

        Alignment refers to the process of ensuring that AI systems, particularly LLMs, behave in ways that align with human values, intentions, and expectations. This involves both technical and philosophical considerations.

        ## Technical Challenges

        From a technical perspective, alignment faces several challenges:

        1. **Specification Problem**: It's difficult to precisely specify what we want LLMs to do in all possible scenarios.
        
        2. **Distributional Shift**: Models may encounter situations during deployment that differ significantly from their training data.
        
        3. **Emergent Behaviors**: As models scale, they develop capabilities and behaviors that weren't explicitly programmed or anticipated.

        ## Philosophical Considerations

        The alignment problem also raises profound philosophical questions:

        1. **Whose Values?**: Human values vary across cultures and individuals. Whose values should LLMs align with?
        
        2. **Value Pluralism**: How do we handle situations where different values conflict?
        
        3. **Moral Uncertainty**: Given our own uncertainty about moral questions, how should this uncertainty be reflected in AI systems?

        ## Current Approaches

        Researchers are exploring various approaches to improve alignment:

        1. **Reinforcement Learning from Human Feedback (RLHF)**: Training models based on human preferences.
        
        2. **Constitutional AI**: Developing principles that guide AI behavior.
        
        3. **Red Teaming**: Systematically testing models to identify and address alignment failures.

        ## Looking Forward

        As LLMs continue to advance, alignment will remain a critical area of research. Success will require collaboration across disciplines, including computer science, philosophy, psychology, and social sciences.

        The alignment problem isn't just a technical challenge—it's a reflection of our own ongoing struggle to understand and articulate our values and goals as humans.
      `,
      category: "AI Ethics",
    },
    {
      id: "transformer-architecture",
      title: "Understanding Transformer Architecture",
      date: "February 10, 2023",
      readTime: "12 min read",
      excerpt:
        "A deep dive into the transformer architecture that powers modern language models, explaining attention mechanisms and their importance.",
      content: `
        # Understanding Transformer Architecture

        The transformer architecture has revolutionized natural language processing and become the foundation for most state-of-the-art language models. This article explores the key components of transformers and why they're so effective.

        ## The Attention Mechanism

        At the heart of the transformer architecture is the attention mechanism, which allows the model to focus on different parts of the input sequence when producing each element of the output.

        ### Self-Attention

        Self-attention enables each position in a sequence to attend to all positions in the same sequence. This is calculated as:

        1. Convert each input vector to query (Q), key (K), and value (V) vectors
        2. Calculate attention scores between each query and all keys
        3. Apply softmax to get attention weights
        4. Take the weighted sum of value vectors

        The formula for attention is:
        Attention(Q, K, V) = softmax(QK^T / √d_k)V

        ### Multi-Head Attention

        Rather than performing a single attention function, transformers use multiple attention heads in parallel, allowing the model to jointly attend to information from different representation subspaces.

        ## Position Encoding

        Unlike recurrent neural networks, transformers process all tokens simultaneously, losing sequential information. Position encodings are added to input embeddings to provide information about token positions in the sequence.

        ## Feed-Forward Networks

        Each transformer block contains a feed-forward network applied to each position independently, consisting of two linear transformations with a ReLU activation in between.

        ## Layer Normalization and Residual Connections

        Transformers use layer normalization and residual connections to stabilize training and allow for deeper networks.

        ## Why Transformers Work So Well

        Transformers excel for several reasons:

        1. **Parallelization**: Unlike sequential models, transformers process all tokens simultaneously, enabling efficient training.
        
        2. **Long-Range Dependencies**: The attention mechanism can capture dependencies between distant tokens.
        
        3. **Scalability**: Transformer architectures scale effectively with more data and parameters.

        ## Limitations and Future Directions

        Despite their success, transformers have limitations:

        1. **Quadratic Complexity**: Standard self-attention has O(n²) complexity with sequence length.
        
        2. **Fixed Context Window**: Most implementations have a maximum sequence length.
        
        3. **Data Efficiency**: Transformers typically require large amounts of data.

        Researchers are actively addressing these limitations through techniques like sparse attention, recurrent memory mechanisms, and more efficient architectures.

        The transformer architecture represents a significant breakthrough in machine learning, and its impact continues to grow as researchers develop new variations and applications.
      `,
      category: "Technical",
    },
    {
      id: "ml-healthcare",
      title: "Machine Learning in Healthcare: Promises and Pitfalls",
      date: "November 5, 2022",
      readTime: "10 min read",
      excerpt:
        "Examining how machine learning is transforming healthcare, from diagnosis to treatment planning, while highlighting ethical considerations.",
      content: `
        # Machine Learning in Healthcare: Promises and Pitfalls

        Machine learning is rapidly transforming healthcare, offering new capabilities for diagnosis, treatment planning, and patient monitoring. However, these advances come with significant challenges and ethical considerations.

        ## Promising Applications

        ### Medical Imaging Analysis

        ML models can analyze medical images to detect abnormalities with accuracy rivaling or exceeding human radiologists:

        - Identifying tumors in mammograms
        - Detecting diabetic retinopathy from eye scans
        - Classifying skin lesions from dermatological images

        ### Predictive Analytics

        ML can predict patient outcomes and risks:

        - Hospital readmission likelihood
        - Disease progression trajectories
        - Patient deterioration in ICU settings

        ### Drug Discovery

        ML is accelerating pharmaceutical research:

        - Predicting molecular properties
        - Identifying potential drug candidates
        - Optimizing clinical trial design

        ## Significant Challenges

        ### Data Quality and Bias

        Healthcare data presents unique challenges:

        - Missing values and inconsistent formatting
        - Selection bias in training data
        - Demographic underrepresentation

        ### Interpretability

        Many effective ML models function as "black boxes," making it difficult for clinicians to understand their reasoning.

        ### Integration with Clinical Workflows

        For ML to be useful, it must integrate seamlessly with existing clinical practices and electronic health record systems.

        ## Ethical Considerations

        ### Privacy and Security

        Healthcare data is highly sensitive, requiring robust protections:

        - De-identification techniques
        - Secure storage and transmission
        - Clear consent processes

        ### Accountability

        When ML systems contribute to clinical decisions, questions arise about responsibility for errors.

        ### Health Disparities

        ML systems may inadvertently amplify existing healthcare disparities if not carefully designed and monitored.

        ## The Path Forward

        For ML to fulfill its promise in healthcare, several approaches are essential:

        1. **Collaborative Development**: Involving clinicians throughout the ML development process
        
        2. **Rigorous Validation**: Testing systems across diverse populations and settings
        
        3. **Transparent Reporting**: Clearly communicating model limitations and performance characteristics
        
        4. **Ongoing Monitoring**: Continuously evaluating system performance after deployment

        Machine learning offers tremendous potential to improve healthcare, but realizing this potential requires careful navigation of technical, clinical, and ethical challenges.
      `,
      category: "Healthcare",
    },
    {
      id: "creative-ai",
      title: "The Creative Potential of AI",
      date: "July 20, 2022",
      readTime: "7 min read",
      excerpt:
        "Exploring how AI is being used in creative fields like art, music, and writing, and what this means for human creativity.",
      content: `
        # The Creative Potential of AI

        Artificial intelligence is increasingly entering creative domains once thought to be exclusively human. From generating artwork to composing music and writing stories, AI systems are demonstrating remarkable creative capabilities.

        ## AI in Visual Arts

        Recent years have seen explosive growth in AI-generated visual art:

        - Text-to-image models like DALL-E, Midjourney, and Stable Diffusion can create stunning images from textual descriptions
        - GAN-based systems have produced original artworks that have sold at major auction houses
        - Style transfer algorithms can reimagine images in the style of famous artists

        These technologies are enabling new forms of human-AI collaboration, where artists use AI as a creative tool rather than a replacement.

        ## AI in Music

        AI is composing, performing, and producing music:

        - Systems can generate original compositions in various styles
        - AI tools can create accompaniments, suggest chord progressions, and help with mixing and mastering
        - Some models can even generate realistic vocal performances

        Musicians are incorporating these tools into their workflows, using AI to overcome creative blocks and explore new musical territories.

        ## AI in Writing

        Language models are demonstrating increasingly sophisticated writing abilities:

        - Generating poetry, fiction, and screenplays
        - Helping writers overcome writer's block
        - Suggesting alternative phrasings and stylistic variations

        These capabilities raise questions about the nature of authorship and creativity in the digital age.

        ## Philosophical Implications

        AI creativity challenges our understanding of creativity itself:

        ### Is AI Truly Creative?

        AI systems don't have intentions, consciousness, or life experiences. Does this mean their outputs aren't "truly" creative, or does it suggest that creativity can exist without these human qualities?

        ### Collaborative Creativity

        Perhaps the most promising approach is viewing AI as a collaborative partner that enhances human creativity rather than replacing it.

        ### Expanding Creative Possibilities

        AI may enable new forms of creativity that weren't previously possible, just as photography expanded rather than replaced painting.

        ## The Future of Human-AI Creativity

        As AI creative tools become more accessible, we may see:

        1. **Democratization of Creation**: More people able to express themselves creatively
        
        2. **New Hybrid Art Forms**: Novel combinations of human and AI creative processes
        
        3. **Shifting Value Systems**: Greater emphasis on concept, curation, and direction rather than technical execution

        The relationship between AI and human creativity is not zero-sum. By embracing AI as a creative partner, we may discover new dimensions of human creative expression.
      `,
      category: "Creative AI",
    },
  ]

  const getWritingById = (id: string) => writings.find((w) => w.id === id)

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
            <h2 className="text-3xl font-bold text-white">Writings & Thoughts</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#9e4aff] to-[#ff4a9e]"></div>
          </div>

          {selectedWriting ? (
            <WritingDetail writing={getWritingById(selectedWriting)!} onBack={() => setSelectedWriting(null)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {writings.map((writing) => (
                <motion.div
                  key={writing.id}
                  className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] cursor-pointer hover:bg-[#2a2a4a] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedWriting(writing.id)}
                >
                  <div className="space-y-3">
                    <div>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
                        {writing.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{writing.title}</h3>
                    <p className="text-[#b4b4d0] line-clamp-3">{writing.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#8a8aaa]">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{writing.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{writing.readTime}</span>
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

interface WritingDetailProps {
  writing: Writing
  onBack: () => void
}

function WritingDetail({ writing, onBack }: WritingDetailProps) {
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
        Back to Writings
      </button>

      <div className="space-y-4">
        <div>
          <span className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">{writing.category}</span>
        </div>

        <h3 className="text-2xl font-bold text-white">{writing.title}</h3>

        <div className="flex items-center gap-4 text-sm text-[#8a8aaa]">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{writing.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{writing.readTime}</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#b4b4d0] prose-strong:text-white prose-li:text-[#b4b4d0]">
          {writing.content.split("\n").map((line, index) => {
            if (line.startsWith("# ")) {
              return (
                <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
                  {line.substring(2)}
                </h1>
              )
            } else if (line.startsWith("## ")) {
              return (
                <h2 key={index} className="text-xl font-semibold mt-5 mb-3">
                  {line.substring(3)}
                </h2>
              )
            } else if (line.startsWith("### ")) {
              return (
                <h3 key={index} className="text-lg font-semibold mt-4 mb-2">
                  {line.substring(4)}
                </h3>
              )
            } else if (line.startsWith("- ")) {
              return (
                <li key={index} className="ml-4">
                  {line.substring(2)}
                </li>
              )
            } else if (line.trim() === "") {
              return <br key={index} />
            } else {
              return (
                <p key={index} className="my-2">
                  {line}
                </p>
              )
            }
          })}
        </div>
      </div>
    </motion.div>
  )
}
