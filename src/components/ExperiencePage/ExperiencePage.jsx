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
    company: 'Dalus (YC W25)',
    role: 'Software Engineering Intern (AI/ML)',
    period: 'June 2025 - August 2025',
    location: 'San Francisco Bay Area',
    type: 'work',
    highlights: [
      'Built custom LSA retrieval engine, saving $24k/year and reducing latency 10s → 50ms',
      'Architected schema-agnostic JSON Patch system eliminating runtime errors in production',
      'Deployed GPU document processing on NVIDIA T4, cutting latency 20s → 70ms, saving $9k/year',
      'Engineered dynamic context management solving overflow issues in AI copilot',
    ],
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
          const isSpecial = exp.company === 'Dalus (YC W25)';
          return (
          <SpotlightCard
            key={idx}
            className={`experience-card ${exp.type} ${isSpecial ? 'special-experience' : ''}`}
            spotlightColor={isSpecial ? "rgba(163, 192, 240, 0.4)" : "rgba(163, 192, 240, 0.15)"}
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
