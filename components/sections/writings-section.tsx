"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Calendar, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
      id: "ml-healthcare",
      title: "The ‘Why’ Chronicles, Part 1: Toddler Approach",
      date: "January 12, 2025",
      readTime: "8 min read",
      excerpt:
        "Exploring the technical and philosophical challenges in aligning large language models with human values and intentions.",
      content: `# The ‘Why’ Chronicles, Part 1: Toddler Approach

## Engineering vs. Research: A Fundamental Distinction

There is a very interesting distinction between **doing machine learning engineering** and **doing machine learning research**.

* In **machine learning engineering**, you're given tasks like:
  * Creating an ML pipeline
  * Deploying a model
  * Maintaining ML infrastructure

* On the **research side**, you suddenly turn into a **grown-up toddler** asking *"why?"* every five minutes:

> Why am I using this optimizer?  
> Why should I use this loss function?  
> Why is coffee not on my table?  
> Why linear regression and not a neural network?  
> Why a neural network and not a linked list (nah, seriously)?

These might seem like silly questions, but they’re **fundamentally important**.

## Why Ask Why?

My ML research supervisor, **Rachit Saluja**, might have had enough of me at this point…

But my rationale behind asking *why* is this:

> It leads to far more creative and effective solutions  
> than simply sticking to and digging into one solution approach.

I’ve seen engineers and researchers **obsess over avoiding overfitting in their models** without realizing:

> They themselves are **overfitting to a single solution space**.

## A Toddler in the Lab: My Research Style

This is exactly what I’m doing in my **medical imaging + machine learning** research project:

> I look at things in a toddler-like, imaginative way.

Imagine the research field as a **race**:

* The **model** is the **racer**
* The **researcher** is the **coach**

Now, think of the different kinds of coaches:

* One empowers the racer
* One gets them better equipment
* One plans a good diet
* One even encourages them to cheat

But those who **win**?

> They study **the rules, the terrain, the nature of the race itself**—and use that to their advantage.

## From Benchmarks to Breakthroughs

Some researchers focus on improving a model’s benchmark from **46.2 to 46.3**.

> They may forget to ask:  
> *Why is it still only 46.3?*  
> *What’s really holding us back from getting to 100?*  
> *Where is the limitation?*  
> *What is the true core of the challenge?*

These questions don’t always need answers.

> They just need to be **asked**—and that opens the **great door** of thought and possibilities.

---

### Final Thought

If you’ve read this far—thank you!  
But *why* did you, though?
`,
      category: "Machine Learning in Healthcare",
    },
    {
      id: "why-2",
      title: "The ‘Why’ Chronicles, Part 2: This or That?",
      date: "January 17, 2025",
      readTime: "10 min read",
      excerpt:
        "Sometimes, it’s not about complexity—it’s about asking the right questions to find the right model.",
      content: `# The ‘Why’ Chronicles, Part 2: This or That?

Everything I’m about to describe actually happened during my machine learning research project at Pequity. I worked with a massive amount of text data. The goal: predict a specific label by looking at historical data tied to that label and similar ones. I used Stella EN 1.5B v5 for embedding (eventually switched to ModernBERT—super fast and memory-friendly, shoutout to Tom Aarsen and his team!).

After doing semantic similarity search, I realized... it was a decision tree task. My “This or That” moment: a natural flow of thought and a bunch of questions led me to the solution.

In my early days, I always reached for the most complex model—why? Because it felt exciting! Seeing loss go down each epoch was empowering.

But over time, I learned:

> **ML is a flow of thought.**

Let me illustrate that thought with a conversation:

**Silly Dinosaur (SD):** Are we predicting or generating?  
**Wise Pigeon (WP):** Predicting.  
**SD:** What are we predicting? A number? A category?  
**WP:** A number.  
**SD:** What does the data look like?  
**WP:** Yes/no questions mostly.  
**SD:** So... neural net?  
**WP:** Say that again and the asteroid's coming for your house. It’s tree-based. You’ve got binary splits and numbers at the end—sounds like a job for decision trees.

What’s key is this:

> The best model *reveals itself* through a process of reasoning.

Whether it’s linear regression or Transformers, it’s not about cool tech—it’s about understanding your problem deeply.

**Note:** No neural networks were harmed in the process.
`,
      category: "Machine Learning in Practice",
    },
    {
      id: "why-3",
      title: "The ‘Why’ Chronicles, Part 3: An Architect",
      date: "February 8, 2025",
      readTime: "9 min read",
      excerpt:
        "How developers can stay valuable in an era where LLMs write most of the code.",
      content: `# The ‘Why’ Chronicles, Part 3: An Architect

We’re living in a time where LLMs are writing most of our code. So how can developers still bring value?

Answer: **by building architectures.**

At startups I’ve worked with, I don’t ask for a task list. Instead:

1. I understand the team’s value proposition by attending lots of meetings.
2. I note two things:
   * What’s not being improved that should be?
   * What can I propose that would significantly enhance the product?

Then I draw up an **architecture diagram**—from input to output—breaking it into manageable chunks. This makes the proposal clear, executable, and easy to delegate.

LLMs help speed up coding. But they **can’t**:
- Understand startup dynamics
- Sit in on every critical meeting
- Think creatively or strategically

That’s the human edge.

At LessonLoop, Cornell Tech, and CUSD, I’ve taken this approach. And it works—**9 out of 10 times**.

> Real developer value = low supervision + creativity + strong architectural thinking.
`,
      category: "Software Architecture",
    },
    {
      id: "why-4",
      title: "The ‘Why’ Chronicles, Part 4: What’s Next?",
      date: "March 12, 2025",
      readTime: "6 min read",
      excerpt:
        "Why on-device LLMs like OLMoE might mark the beginning of a privacy-focused AI future.",
      content: `# The ‘Why’ Chronicles, Part 4: What’s Next?

Call me a nerd, but the launch of Ai2’s iOS app **OLMoE** has me thrilled. It’s **open-source** and **runs on-device**—that means full **privacy**.

Every time I use ChatGPT and input something personal, I feel like, *“They know that now.”* That mental load disappears with on-device LLMs.

But here’s the problem: **perception**.

When I told a friend they could input medical info safely, they said:  
> *"Nah, I wouldn’t go that far."*

People don’t yet **understand the privacy advantage**.

Technically, running a performant LLM **on-device** is insanely hard. Hats off to Ai2. Ironically, I haven’t tried OLMoE—my iPhone 13 mini doesn’t have the 8GB RAM it needs. So yes, I’m eyeing an upgrade just to try it.

This is the start of something bigger:

* Smaller models like **SmolLM** by Loubna Ben Allal
* More optimization
* Built-in memory and image reasoning

Imagine: **everything** local, private, offline.

I’m not anti-cloud—cloud LLMs are great for heavy-duty reasoning. But for sensitive stuff? I want it local.

> If I worked at Ai2, I’d already be proposing OLMoE+.

And that’s what’s next.
`,
      category: "On-Device AI",
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
            <div className="h-1 w-20 bg-gradient-to-r from-[#9e4aff] to-[#ff4a9e]" />
          </div>

          {selectedWriting ? (
            <WritingDetail
              writing={getWritingById(selectedWriting)!}
              onBack={() => setSelectedWriting(null)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {writings.map((w) => (
                <motion.div
                  key={w.id}
                  className="p-4 rounded-lg bg-[#1a1a30] border border-[#3a3a6a] cursor-pointer hover:bg-[#2a2a4a] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedWriting(w.id)}
                >
                  <div className="space-y-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
                      {w.category}
                    </span>
                    <h3 className="text-xl font-semibold text-white">{w.title}</h3>
                    <p className="text-[#b4b4d0] line-clamp-3">{w.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#8a8aaa]">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{w.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{w.readTime}</span>
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
  // Remove the leading "# Title" line if present
  const lines = writing.content.split("\n")
  const markdownBody =
    lines[0].startsWith("# ")
      ? lines.slice(1).join("\n")
      : writing.content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 rounded-md bg-[#2a2a4a] text-white/70 hover:text-white hover:bg-[#3a3a6a] transition-colors flex items-center gap-2 text-sm"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
        <span className="px-2 py-1 text-xs rounded-full bg-[#2a2a4a] text-[#b4b4d0]">
          {writing.category}
        </span>
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

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownBody}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
