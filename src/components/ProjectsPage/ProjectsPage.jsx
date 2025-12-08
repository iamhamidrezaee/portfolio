import React from 'react';
import { projects } from '../../../data/projects.ts';
import { GoArrowUpRight, GoArrowLeft } from 'react-icons/go';
import './ProjectsPage.css';

const ProjectsPage = ({ onBack }) => {
  return (
    <div className="projects-page">
      <header className="projects-header">
        <button className="back-button" onClick={onBack}>
          <GoArrowLeft className="back-arrow" />
          <span>Home</span>
        </button>
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          Open-source tools and research projects in machine learning and information retrieval
        </p>
      </header>
      
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <article 
            key={project.id} 
            className="project-card"
            style={{ 
              animationDelay: `${idx * 0.1}s`,
              '--accent-color': project.color 
            }}
          >
            <div className="project-icon">
              <ProjectIcon type={project.icon} color={project.color} />
            </div>
            <div className="project-content">
              <h2 className="project-name">{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`View ${project.title} on GitHub`}
            >
              <GoArrowUpRight />
              <span>View Project</span>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

const ProjectIcon = ({ type, color }) => {
  const icons = {
    clustering: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" fill={color} opacity="0.8" />
        <circle cx="36" cy="12" r="6" fill={color} opacity="0.6" />
        <circle cx="12" cy="36" r="6" fill={color} opacity="0.6" />
        <circle cx="36" cy="36" r="6" fill={color} opacity="0.8" />
        <circle cx="24" cy="24" r="8" fill={color} />
      </svg>
    ),
    transformer: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="12" height="12" rx="2" fill={color} opacity="0.6" />
        <rect x="28" y="8" width="12" height="12" rx="2" fill={color} opacity="0.8" />
        <rect x="8" y="28" width="12" height="12" rx="2" fill={color} opacity="0.8" />
        <rect x="28" y="28" width="12" height="12" rx="2" fill={color} opacity="0.6" />
        <line x1="20" y1="14" x2="28" y2="14" stroke={color} strokeWidth="2" />
        <line x1="20" y1="34" x2="28" y2="34" stroke={color} strokeWidth="2" />
        <line x1="14" y1="20" x2="14" y2="28" stroke={color} strokeWidth="2" />
        <line x1="34" y1="20" x2="34" y2="28" stroke={color} strokeWidth="2" />
      </svg>
    ),
    'gradient-descent': (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 40 Q24 8 40 40" stroke={color} strokeWidth="3" fill="none" opacity="0.4" />
        <circle cx="16" cy="28" r="4" fill={color} opacity="0.6" />
        <circle cx="24" cy="16" r="4" fill={color} opacity="0.8" />
        <circle cx="32" cy="24" r="4" fill={color} />
        <path d="M16 28 L24 16 L32 24" stroke={color} strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
      </svg>
    ),
    'medical-imaging': (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <rect x="14" y="14" width="20" height="20" rx="2" fill={color} opacity="0.3" />
        <ellipse cx="24" cy="24" rx="6" ry="8" fill={color} opacity="0.8" />
        <line x1="24" y1="8" x2="24" y2="14" stroke={color} strokeWidth="2" />
        <line x1="24" y1="34" x2="24" y2="40" stroke={color} strokeWidth="2" />
      </svg>
    ),
  };
  
  return icons[type] || icons.clustering;
};

export default ProjectsPage;

