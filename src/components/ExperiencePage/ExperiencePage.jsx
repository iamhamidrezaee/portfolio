import React from 'react';
import { GoArrowLeft } from 'react-icons/go';
import SpotlightCard from '../SpotlightCard/SpotlightCard';
import Plasma from '../Plasma/Plasma';
import './ExperiencePage.css';

const experiences = [
  {
    company: 'Cornell University',
    role: 'Teaching Assistant, Design Technology for Social Impact',
    period: 'August 2025 - Present',
    location: 'Ithaca, New York',
    type: 'education',
    highlights: [
      'Led instructional session on speculative design, guiding students in applying design methodologies',
      'Mentored students individually and in groups to strengthen design thinking and creativity',
      'Evaluated and graded assignments with constructive feedback',
    ],
  },
  {
    company: 'Pequity',
    role: 'Machine Learning Engineering Intern',
    period: 'September 2024 - October 2025',
    location: 'Ithaca, New York',
    type: 'work',
    highlights: [
      'Built Scout, an AI compensation research assistant automating 5-8 weeks of manual work',
      'Accelerated data retrieval 3.6x through multi-threaded Python implementation',
      'Reduced API response times from 2.3s to sub-100ms with aggressive lossless compression',
      'Engineered security-first architecture with role-based access controls',
    ],
  },
  {
    company: 'Dalus, Inc. (YC W25)',
    role: 'Software Engineering Intern (AI/ML)',
    period: 'June 2025 - August 2025',
    location: 'San Francisco Bay Area',
    type: 'work',
    highlights: [
    ],
    contributions: [
      {
        capability: 'Retrieval engine for AI copilot',
        before: 'Reliant on Gemini 2.5 Flash; ~10s response latency; recurring model cost',
        after: 'Custom LSA retrieval engine purpose-built for Dalus',
        impact: 'Cut latency 10s → 50ms; saved ~$24k/yr in model spend'
      },
      {
        capability: 'Document processing pipeline',
        before: 'CPU-bound processing; ~20s per doc; higher infra cost',
        after: 'GPU-accelerated pipeline on NVIDIA T4',
        impact: 'Cut latency 20s → 70ms; saved ~$9k/yr in infra'
      },
      {
        capability: 'Safe agent modifications',
        before: 'Ad-hoc, schema-tied patches that risked runtime errors',
        after: 'Schema-agnostic JSON Patch system for agent updates',
        impact: 'Eliminated runtime errors in production updates'
      },
      {
        capability: 'Conversation memory / context',
        before: 'Context overflow in longer sessions; brittle state handling',
        after: 'Dynamic context management for stateful conversations',
        impact: 'Resolved overflow; unlocked reliable long-horizon sessions'
      },
      {
        capability: 'Web search for agentic workflows (new)',
        before: 'Agent couldn\'t search the internet; limited to internal knowledge',
        after: 'Integrated online search into the AI agent',
        impact: 'Expanded answer coverage; reduced manual research loops'
      }
    ]
  },
  {
    company: 'Cornell University Sustainable Design',
    role: 'Machine Learning Engineering Lead',
    period: 'August 2024 - May 2025',
    location: 'Ithaca, New York',
    type: 'leadership',
    highlights: [
      'Delivered production-ready model with extensive error handling to backend team',
      'Documented statistical rationale and correlation analysis for dimension selection',
      'Experimented with multiple ML algorithms evaluating robustness on noisy data',
    ],
  },
  {
    company: 'Cornell Tech',
    role: 'Machine Learning Engineering Intern',
    period: 'May 2024 - August 2024',
    location: 'New York City',
    type: 'work',
    highlights: [
      'Developed M-Loss (multi-component loss) function with PyTorch optimization',
      'Optimized hyperparameters and implemented regularization for model generalization',
      'Managed GPU resources for UNet model training and testing',
      'Parallelized processes for faster and more efficient training',
    ],
  },
  {
    company: 'LessonLoop',
    role: 'Machine Learning Engineering Intern',
    period: 'August 2023 - May 2024',
    location: 'Chappaqua, New York',
    type: 'work',
    highlights: [
      'Tested RAG-based chatbot and deployed testing stack on AWS CloudFormation',
      'Evaluated vector databases: OpenSearch Serverless and Aurora',
      'A/B tested Bedrock LLMs: Amazon Titan, Meta Llama 2, Cohere Command',
    ],
  },
  {
    company: 'Kquika Inc',
    role: 'Machine Learning Engineering Intern',
    period: 'May 2023 - August 2023',
    location: 'Queens, New York',
    type: 'work',
    highlights: [
      'Implemented models: linear/logistic regression, k-means, random forest, XGBoost',
      'Visualized metrics and predictions to improve technical communication skills',
    ],
  },
];

const ExperiencePage = ({ onBack }) => {
  return (
    <div className="experience-page">
      <div className="plasma-background">
        <Plasma
          color="#a3c0f0"
          speed={0.5}
          direction="forward"
          scale={1.7}
          opacity={0.2}
          mouseInteractive={false}
          resolution={0.5}
        />
      </div>
      <header className="experience-header">
        <button className="back-button" onClick={onBack}>
          <GoArrowLeft className="back-arrow" />
          <span>Home</span>
        </button>
        <h1 className="experience-title">Experience</h1>
      </header>
      
      <div className="experience-timeline">
        {experiences.map((exp, idx) => {
          const isSpecial = exp.company.includes('Dalus');
          return (
          <SpotlightCard
            key={idx}
            className={`experience-card ${exp.type} ${isSpecial ? 'special-experience' : ''}`}
            spotlightColor="rgba(163, 192, 240, 0.15)"
          >
            <div className="card-content">
              <div className="card-header">
                <div className="company-info">
                  <h2 className="company-name">{exp.company}</h2>
                  <h3 className="role-title">{exp.role}</h3>
                </div>
                <div className="card-meta">
                  <span className="period">{exp.period}</span>
                  <span className="location">{exp.location}</span>
                </div>
              </div>
              <ul className="highlights">
                {exp.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
              {exp.contributions && (
                <div className="contributions-container">
                  <span className="section-label">Detailed Impact</span>
                  <table className="contributions-table">
                    <thead>
                      <tr>
                        <th>Capability</th>
                        <th>Before I joined</th>
                        <th>After I shipped</th>
                        <th>Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exp.contributions.map((row, i) => (
                        <tr key={i}>
                          <td data-label="Capability">{row.capability}</td>
                          <td data-label="Before I joined">{row.before}</td>
                          <td data-label="After I shipped">{row.after}</td>
                          <td data-label="Impact">{row.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SpotlightCard>
          );
        })}
      </div>
      
      <div className="education-section">
        <h2 className="section-title">Education</h2>
        <SpotlightCard
          className="education-card"
          spotlightColor="rgba(163, 192, 240, 0.15)"
        >
          <div className="edu-icon">🎓</div>
          <div className="edu-content">
            <h3>Cornell University</h3>
            <p className="degree">Bachelor of Arts in Information Science</p>
            <p className="edu-period">August 2022 - May 2026</p>
            <div className="honors">
              <span>Dean's List</span>
              <span>Summer Experience Grant</span>
              <span>Cane Grant</span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default ExperiencePage;
