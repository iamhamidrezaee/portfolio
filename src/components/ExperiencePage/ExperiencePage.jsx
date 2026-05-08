import React from 'react';
import { GoArrowRight } from 'react-icons/go';
import PortfolioNav from '../PortfolioNav';
import './ExperiencePage.css';

const currentPractice = {
  company: 'Vali Health',
  role: 'Founding Engineer',
  period: 'April 2026 - Present',
  location: 'San Francisco Bay Area',
  summary:
    'Current work inside home-care operations, where AI systems have to act through real scheduling, messaging, caregiver, and agency workflows instead of stopping at a demo.',
  notes: [
    {
      title: 'Operational trust',
      copy:
        'I start by asking what the system is allowed to do, what it must verify first, and where a human handoff belongs. In home care, a wrong lookup or a confident guess can create real operational pain, so the work is less about spectacle and more about constraint.',
    },
    {
      title: 'Tool boundaries',
      copy:
        'The useful agent is the one that knows when a caregiver profile, shift record, message thread, or external system is the source of truth. I treat retrieval, matching, and action as separate steps so the system can be inspected when something goes wrong.',
    },
    {
      title: 'Production rhythm',
      copy:
        'Latency, retry behavior, tests, and logs matter because the user is usually in the middle of a task. The goal is not a clever answer; it is a system that can close loops without hiding its uncertainty.',
    },
  ],
};

const practiceThreads = [
  {
    title: 'Voice and conversation systems',
    copy:
      'At Atlas Health, I worked on Ava, an AI voice assistant, through simulation-heavy evaluation, prompt iteration, latency control, and voice naturalness. The work taught me to treat conversation as timing, not only language.',
  },
  {
    title: 'Retrieval and market intelligence',
    copy:
      'At Pequity and Dalus, I worked on search, retrieval, compression, web-search expansion, and agent state. The throughline was speed with evidence: getting the right context into the system without letting the model invent the missing parts.',
  },
  {
    title: 'Models that survive handoff',
    copy:
      'At CUSD and Cornell Tech, the work moved from experiments toward explanation: why a feature belongs, how a model behaves under noise, what the output means, and what another team needs in order to use it.',
  },
  {
    title: 'Teaching design as critique',
    copy:
      'As a TA for Design Technology for Social Impact, I helped students slow down around intention, audience, and consequence. That critique habit now shows up in both the artwork and the engineering.',
  },
];

const timeline = [
  {
    company: 'Vali Health',
    role: 'Founding Engineer',
    period: 'April 2026 - Present',
    location: 'San Francisco Bay Area',
    copy:
      'Building current AI workflow systems for home-care operations, with attention to lookup correctness, caregiver context, shift flow, and action through existing tools.',
  },
  {
    company: 'Atlas Health',
    role: 'Machine Learning Engineer',
    period: 'December 2025 - January 2026',
    location: 'San Francisco, California',
    copy:
      'Deployed Ava, an AI voice assistant, after scenario-based evaluation. The work moved from pass-rate repair to latency, backchanneling, ambient sound, and a voice that could keep pace with a person.',
  },
  {
    company: 'Cornell University',
    role: 'Teaching Assistant, Design Technology for Social Impact',
    period: 'August 2025 - December 2025',
    location: 'Ithaca, New York',
    copy:
      'Led speculative-design sessions, mentored student concepts, and gave critique around social values embedded in technology. The role sharpened how I write about systems without treating them as neutral.',
  },
  {
    company: 'Pequity',
    role: 'Machine Learning Engineering Intern',
    period: 'September 2024 - October 2025',
    location: 'Ithaca, New York',
    copy:
      'Built Scout, an AI compensation research assistant, around retrieval speed, sensitive enterprise data, and role-aware architecture. The core question was how to make research faster without making it careless.',
  },
  {
    company: 'Dalus, Inc. (YC W25)',
    role: 'Software Engineering Intern, AI/ML Engineering',
    period: 'June 2025 - August 2025',
    location: 'San Francisco Bay Area',
    copy:
      'Replaced slow model-dependent retrieval with a custom LSA engine, moved document processing onto GPU infrastructure, and built safer JSON Patch flows for agent updates and stateful copilot behavior.',
  },
  {
    company: 'Cornell University Sustainable Design',
    role: 'Machine Learning Engineering Lead',
    period: 'August 2024 - May 2025',
    location: 'Ithaca, New York',
    copy:
      'Led model work from experimentation into handoff: noisy-data testing, error handling, statistical rationale, and documentation clear enough for a backend team to build around.',
  },
  {
    company: 'Cornell Tech',
    role: 'Machine Learning Engineering Intern',
    period: 'May 2024 - August 2024',
    location: 'New York City',
    copy:
      'Worked on PyTorch optimization, M-Loss, hyperparameter tuning, regularization, GPU resource management, and UNet training logs. The useful part was learning to read model behavior as evidence, not decoration.',
  },
  {
    company: 'LessonLoop',
    role: 'Machine Learning Engineering Intern',
    period: 'August 2023 - May 2024',
    location: 'Chappaqua, New York',
    copy:
      'Tested RAG systems, deployed evaluation infrastructure on AWS CloudFormation, compared vector databases, and evaluated Bedrock models for how well retrieved context actually entered the answer.',
  },
  {
    company: 'Kquika Inc',
    role: 'Machine Learning Engineering Intern',
    period: 'May 2023 - August 2023',
    location: 'Queens, New York',
    copy:
      'Built early machine-learning foundations through regression, clustering, random forests, XGBoost, visualization, and weekly technical communication with the CTO.',
  },
];

const ExperiencePage = () => {
  return (
    <main className="experience-page">
      <PortfolioNav />

      <section className="experience-hero" aria-labelledby="experience-title">
        <div>
          <p className="experience-kicker">Experience</p>
          <h1 id="experience-title">Work in practice</h1>
          <p>
            Production AI systems, retrieval, voice, teaching, and design critique. The useful
            pattern is the same: make the system act carefully when the situation is messy.
          </p>
        </div>
      </section>

      <section className="current-work" aria-labelledby="current-work-title">
        <div>
          <p className="experience-kicker">{currentPractice.period} / {currentPractice.location}</p>
          <h2 id="current-work-title">{currentPractice.company}</h2>
          <p>{currentPractice.role}</p>
        </div>
        <div className="current-work-copy">
          <p>{currentPractice.summary}</p>
          <div className="current-work-notes">
            {currentPractice.notes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="practice-notes" aria-labelledby="practice-notes-title">
        <p className="experience-kicker">Working threads</p>
        <h2 id="practice-notes-title">How I approach systems</h2>
        <div>
          {practiceThreads.map((thread) => (
            <article key={thread.title}>
              <h3>{thread.title}</h3>
              <p>{thread.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-list" aria-label="Selected experience">
        {timeline.map((experience, index) => (
          <article className="experience-row" key={`${experience.company}-${experience.period}`}>
            <span className="experience-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="experience-kicker">{experience.period} / {experience.location}</p>
              <h2>{experience.company}</h2>
              <h3>{experience.role}</h3>
              <p>{experience.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="education-block" aria-labelledby="education-title">
        <p className="experience-kicker">Education</p>
        <h2 id="education-title">Cornell University</h2>
        <p>Bachelor of Arts in Information Science / August 2022 - May 2026</p>
        <div>
          <span>Dean's List</span>
          <span>Summer Experience Grant</span>
          <span>Cane Grant</span>
          <span>Design Technology for Social Impact</span>
        </div>
      </section>

      <footer className="experience-footer">
        <a href="/Hamid_Rezaee_Resume.pdf" target="_blank" rel="noreferrer">
          Resume
          <GoArrowRight aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
};

export default ExperiencePage;
