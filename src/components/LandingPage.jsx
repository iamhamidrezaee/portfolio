import React from 'react';
import { Link } from 'react-router-dom';
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import { artWorks } from '../data/artWorks';
import PortfolioNav from './PortfolioNav';
import './LandingPage.css';

const mediumLabels = [
  'video',
  'sound',
  'machinima',
  'computer vision',
  'voice',
  'photo booth',
  'installation',
  'software',
];

const LandingPage = () => {
  const featured = artWorks[0];

  return (
    <main className="portfolio-home">
      <PortfolioNav />

      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div>
            <p className="hero-kicker">Artist / programmer / machine learning engineer</p>
            <h1 id="hero-title" className="hero-name">
              Hamid Rezaee
            </h1>
            <p className="hero-statement">
              I make videos, sound works, browser installations, and machine-learning systems
              about surveillance, obedience, memory, and the strange intimacy of machines.
            </p>
          </div>

          <div className="hero-lower">
            <div className="hero-actions">
              <a className="solid-link" href="#works">
                Selected works <GoArrowRight aria-hidden="true" />
              </a>
              <Link className="outline-link" to="/projects">
                Tech archive <GoArrowUpRight aria-hidden="true" />
              </Link>
              <a className="outline-link" href="/Hamid_Rezaee_Resume.pdf" target="_blank" rel="noreferrer">
                Resume <GoArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <aside className="hero-media" aria-label="Featured work">
          <Link className="hero-media-link" to={`/work/${featured.slug}`}>
            <img src={featured.cover} alt={`${featured.title} poster frame`} />
            <div className="hero-media-caption">
              <span>{featured.order} / {featured.eyebrow}</span>
              <span>{featured.title}</span>
            </div>
          </Link>
        </aside>
      </section>

      <section id="works" className="home-section" aria-labelledby="works-title">
        <div className="section-heading-row">
          <h2 id="works-title">Selected Works</h2>
          <p className="section-kicker">Art & Tech sequence</p>
        </div>

        <div className="work-list">
          {artWorks.map((work) => (
            <Link className="work-row" to={`/work/${work.slug}`} key={work.slug}>
              <span className="work-index">{work.order}</span>
              <span className="work-thumb" aria-hidden="true">
                <img src={work.cover} alt="" loading="lazy" />
              </span>
              <span>
                <span className="work-kicker">{work.eyebrow} / {work.dateLabel || work.year}</span>
                <span className="work-row-title">{work.title}</span>
                <span className="work-row-summary">{work.summary}</span>
              </span>
              <span className="row-arrow" aria-hidden="true">
                <GoArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="practice-title">
        <div className="practice-grid">
          <h2 id="practice-title" className="practice-copy">
            Familiar rooms and interfaces begin to answer back.
          </h2>
          <div className="practice-aside">
            <p>
              A bedroom listens back. A game world offers scripted freedom. A crowd becomes a
              diagram. A music box asks for obedience. A photo booth gets curious.
            </p>
            <p>
              The work stays close to ordinary gestures: entering a name, following a prompt,
              standing in front of a camera, trying to make a sound bearable.
            </p>
            <div className="medium-rail" aria-label="Media">
              {mediumLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>Hamid Rezaee / art, code, machine learning</span>
        <div className="home-footer-links">
          <a href="mailto:hr328@cornell.edu">Email</a>
          <a href="https://github.com/iamhamidrezaee" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/iamhamidrezaee" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
