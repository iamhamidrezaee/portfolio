import React from 'react';
import { Link } from 'react-router-dom';
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import { projects } from '../../../data/projects.ts';
import PortfolioNav from '../PortfolioNav';
import './ProjectsPage.css';

const projectLinks = (project) => {
  const links = [...(project.links || [])];
  if (project.github) links.push({ label: 'Repository', href: project.github });
  if (project.demo) links.push({ label: 'Live', href: project.demo });
  return links;
};

const ProjectsPage = () => {
  return (
    <main className="archive-page">
      <PortfolioNav />

      <section className="archive-hero" aria-labelledby="projects-title">
        <p className="archive-kicker">Technical archive</p>
        <h1 id="projects-title">Technology</h1>
        <p>
          Research systems, retrieval tools, model work, and selected builds that can be shown
          publicly without exposing private data.
        </p>
      </section>

      <section className="project-archive-list" aria-label="Technical projects">
        {projects.map((project, index) => (
          <article className="project-archive-row" key={project.id}>
            <span className="project-archive-index">{String(index + 1).padStart(2, '0')}</span>
            <div className="project-archive-main">
              <p className="archive-kicker">{project.context || project.technologies.slice(0, 2).join(' / ')}</p>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              {project.status && <p className="project-status">{project.status}</p>}
              <div className="project-tags">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <div className="project-link-list">
              {projectLinks(project).map((link) => (
                <a
                  className="project-archive-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  key={link.href}
                >
                  <span>{link.label}</span>
                  <GoArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="archive-footer">
        <Link to="/">
          Index
          <GoArrowRight aria-hidden="true" />
        </Link>
      </footer>
    </main>
  );
};

export default ProjectsPage;
