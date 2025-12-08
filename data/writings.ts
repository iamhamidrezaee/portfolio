export interface Writing {
  id: string
  title: string
  date: string
  readTime: string
  excerpt: string
  content: string
  category: string
}

export const writings: Writing[] = [
  {
    id: "ml-healthcare",
    title: "The ‘Why’ Chronicles, Part 1: Toddler Approach",
    date: "January 12, 2025",
    readTime: "8 min read",
    excerpt:
      "Exploring the technical and philosophical challenges in aligning large language models with human values and intentions.",
    content: `# The 'Why' Chronicles, Part 1: Toddler Approach

## Engineering vs. Research: A Fundamental Distinction

There is a very interesting distinction between doing machine learning engineering and doing machine learning research.

In machine learning engineering, you're given tasks like: \n
\n
  - Creating an ML pipeline \n
  \n
  - Deploying a model \n
  \n
  - Maintaining ML infrastructure \n
  \n

* On the research side, you suddenly turn into a grown-up toddler asking "why?" every five minutes:

Why am I using this optimizer?
Why should I use this loss function?
Why is coffee not on my table?
Why linear regression and not a neural network?
Why a neural network and not a linked list (nah, seriously)?

These might seem like silly questions, but they're fundamentally important.

## Why Ask Why?

My ML research supervisor, Rachit Saluja, might have had enough of me at this point…

But my rationale behind asking why is this:

> It leads to far more creative and effective solutions than simply sticking to and digging into one solution approach.

I've seen engineers and researchers obsess over avoiding overfitting in their models without realizing:

> They themselves are **overfitting to a single solution space**.

## A Toddler in the Lab: My Research Style

This is exactly what I'm doing in my medical imaging + machine learning research project: I look at things in a toddler-like, imaginative way.

Imagine the research field as a race:

- The model is the racer \n
\n
- The researcher is the coach \n
\n

Now, think of the different kinds of coaches:

- One empowers the racer \n
\n
- One gets them better equipment \n
\n
- One plans a good diet \n
\n
- One even encourages them to cheat \n

But those who win?

> They study the rules, the terrain, the nature of the race itself—and use that to their advantage.

## From Benchmarks to Breakthroughs

Some researchers focus on improving a model's benchmark from 46.2 to 46.3.

They may forget to ask:
Why is it still only 46.3?
What's really holding us back from getting to 100?
Where is the limitation?
What is the true core of the challenge?

These questions don't always need answers.

> They just need to be **asked**—and that opens the great door of thought and possibilities.

## Final Thought

If you've read this far—thank you!
But why did you, though?
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
    content: `# The 'Why' Chronicles, Part 2: This or That?

Everything I'm about to describe actually happened during my machine learning research project at Pequity. I worked with a massive amount of text data. The goal: predict a specific label by looking at historical data tied to that label and similar ones. I used Stella EN 1.5B v5 for embedding (eventually switched to ModernBERT—super fast and memory-friendly, shoutout to Tom Aarsen and his team!).

After doing semantic similarity search, I realized... it was a decision tree task. My "This or That" moment: a natural flow of thought and a bunch of questions led me to the solution.

In my early days, I always reached for the most complex model—why? Because it felt exciting! Seeing loss go down each epoch was empowering.

But over time, I learned:

> **ML is a flow of thought.**

Let me illustrate that thought with a conversation:

Silly Dinosaur (SD): Are we predicting or generating? \n
\n
Wise Pigeon (WP): Predicting. \n
\n
SD: What are we predicting? A number? A category? \n
\n
WP: A number. \n
\n
SD: What does the data look like? \n
\n
WP: Yes/no questions mostly. \n
\n
SD: So... neural net? \n
\n
WP: Say that again and the asteroid's coming for your house. It's tree-based. You've got binary splits and numbers at the end—sounds like a job for decision trees.

What's key is this:

> The best model **reveals itself** through a process of reasoning.

Whether it's linear regression or Transformers, it's not about cool tech—it's about understanding your problem deeply.

**Note:** \n No neural networks were harmed in the process.
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
    content: `# The 'Why' Chronicles, Part 3: An Architect

We're living in a time where LLMs are writing most of our code. So how can developers still bring value?

Answer: **by building architectures.**

At startups I've worked with, I don't ask for a task list. Instead:

1. I understand the team's value proposition by attending lots of meetings.
2. I note two things:
   - What's not being improved that should be? \n
   \n
   - What can I propose that would significantly enhance the product? \n
   \n

Then I draw up an architecture diagram—from input to output—breaking it into manageable chunks. This makes the proposal clear, executable, and easy to delegate.

LLMs help speed up coding. But they can't:
* Understand startup dynamics
* Sit in on every critical meeting
* Think creatively or strategically

That's the human edge.

At LessonLoop, Cornell Tech, and CUSD, I've taken this approach. And it works—9 out of 10 times.

> **Real developer value = low supervision + creativity + strong architectural thinking.**
`,
    category: "Software Architecture",
  },
  {
    id: "why-4",
    title: "The 'Why' Chronicles, Part 4: What's Next?",
    date: "March 12, 2025",
    readTime: "6 min read",
    excerpt:
      "Why on-device LLMs like OLMoE might mark the beginning of a privacy-focused AI future.",
    content: `# The 'Why' Chronicles, Part 4: What's Next?

Call me a nerd, but the launch of Ai2's iOS app OLMoE has me thrilled. It's open-source and runs on-device—that means full privacy.

Every time I use ChatGPT and input something personal, I feel like, "They know that now." That mental load disappears with on-device LLMs.

But here's the problem: perception.

When I told a friend they could input medical info safely, they said: "Nah, I wouldn't go that far."

People don't yet understand the privacy advantage.

Technically, running a performant LLM on-device is insanely hard. Hats off to Ai2. Ironically, I haven't tried OLMoE—my iPhone 13 mini doesn't have the 8GB RAM it needs. So yes, I'm eyeing an upgrade just to try it.

This is the start of something bigger:

- Smaller models like SmolLM by Loubna Ben Allal \n
\n
- More optimization \n
\n
- Built-in memory and image reasoning \n
\n

Imagine: everything local, private, offline.

I'm not anti-cloud—cloud LLMs are great for heavy-duty reasoning. But for sensitive stuff? I want it local.

> If I worked at Ai2, I'd already be proposing OLMoE+.

And that's what's next.
`,
    category: "On-Device AI",
  },
  {
    id: "why-5",
    title: "The 'Why' Chronicles, Part 5: Adaptive Optimization",
    date: "November 2, 2024",
    readTime: "7 min read",
    excerpt:
      "Building a voice agent architecture that stays under 800ms end-to-end latency, and reimagining how systems could automatically optimize as models scale.",
    content: `# The 'Why' Chronicles, Part 5: Adaptive Optimization

During a project, I've been building and continuously improving a voice agent architecture consisting of STT, LLM, and TTS components. I successfully kept the end-to-end latency under 800ms for the entire pipeline, but the journey there led to some interesting realizations.

## The Small Model Dilemma

When building low-latency applications like voice agents that need to respond in under a second, you're typically working with small LLMs in the 1B-4B parameter range. This creates a constant tension: fast but small models that produce mediocre results, or larger models that produce great results but sacrifice latency.

Here's the challenge: even on high-end GPUs, jumping from a 1B to a 3B parameter model can add 100-200ms of latency. For a voice application, that's significant.

## The Optimization Journey

I experimented with memory optimization techniques, like:

- Preloading model weights on GPU \n
\n
- Eliminating wrapper overhead in forward passes \n
\n
- Building tensors directly on GPU \n
\n

The result was consistent 700-800ms latency even as context grew, which was great. But it got me thinking about a bigger problem.

## What If Systems Could Self-Optimize?

What if we built a pipeline that automatically orchestrates optimizations as components scale?

Instead of accepting the naive scaling penalty (3B model = 3x latency), what if the system intelligently adapted? When you swap in a larger LLM, the architecture could automatically:

- Apply speculative decoding using the smaller model as a draft generator, getting larger model quality at nearly small model speed

- Dynamically quantize to INT8/INT4 based on latency budget and quality requirements or thresholds

- Adjust KV cache sizes and attention mechanisms (Flash Attention, GQA) based on model characteristics

- Use early exit strategies for simple responses, reserving full compute for complex ones

- Leverage prefix caching for repeated patterns in conversational flows

## The Vision

The goal isn't to defy compute physics; a 3B model has 3x the parameters and that's unavoidable. But intelligent composition of these techniques could mean upgrading from 1B→3B results in only a 10-20% latency penalty instead of 200-300%, and that is a huge upgrade by itself.

Additionally, we're not incorporating it by default to avoid overengineering and, as mentioned in my earlier posts, to avoid pulling out a bazooka where we need a pistol.

Of course, there's a ceiling. At some point, no amount of optimization compensates for fundamental compute requirements. But the whole point of my focus on this is exploring how far I can push this adaptive approach before hitting those bounds.

## Still Exploring

This is still a research direction I'm investigating, of course! A research on the entire stack, not just individual components, but the intelligent orchestration between them based on latency requirements and model characteristics.

> **The ultimate vision is a pipeline where you can upgrade to the latest, best-performing models in each category, and the system automatically configures itself to maintain the lowest latency achievable.**
`,
    category: "Voice AI & Optimization",
  },
]
