import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { GoArrowLeft, GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import { getAdjacentWorks, getCanonicalWorkSlug, getWorkBySlug } from '../../data/artWorks';
import PortfolioNav from '../PortfolioNav';
import NosyBooth from '../NosyPage/NosyBooth';
import './WorkPage.css';

const MediaBlock = ({ work }) => {
  if (work.video) {
    return (
      <video
        className="work-hero-media"
        src={work.video}
        poster={work.cover}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  const internalLink = work.links?.find(
    (l) => l.href.startsWith('/') && !l.href.startsWith('/work'),
  );

  if (internalLink) {
    return (
      <Link className="work-hero-media-link" to={internalLink.href}>
        <img
          className="work-hero-media"
          src={work.cover}
          alt={`${work.title} still`}
        />
        <span className="work-hero-enter">{internalLink.label}</span>
      </Link>
    );
  }

  return (
    <img
      className="work-hero-media"
      src={work.cover}
      alt={`${work.title} still`}
    />
  );
};

const WorkPage = () => {
  const { slug } = useParams();
  const work = getWorkBySlug(slug);

  if (!work) {
    return <Navigate to="/" replace />;
  }

  const canonicalSlug = getCanonicalWorkSlug(slug);
  if (canonicalSlug !== slug) {
    return <Navigate to={`/work/${canonicalSlug}`} replace />;
  }

  const { previous, next } = getAdjacentWorks(slug);
  const bodySections = [
    { label: work.statementLabel || 'Artist statement', copy: work.statement },
    { label: work.documentationLabel || 'Documentation', copy: work.documentation },
    { label: work.processLabel || 'Process', copy: work.process },
  ].filter((section) => section.copy);
  const gallery = work.gallery || [];

  return (
    <main className="work-page">
      <PortfolioNav />

      <section className="work-hero">
        <div className="work-title-block">
          <p className="work-kicker">{work.order} / {work.eyebrow}</p>
          <h1>{work.title}</h1>
          <p>{work.summary}</p>
        </div>
        <div className="work-media-frame">
          <MediaBlock work={work} />
        </div>
      </section>

      <section className="work-meta-grid" aria-label="Work metadata">
        <div>
          <span className="meta-label">Date</span>
          <strong>{work.dateLabel || work.year}</strong>
        </div>
        <div>
          <span className="meta-label">Medium</span>
          <strong>{work.medium}</strong>
        </div>
        <div>
          <span className="meta-label">Duration</span>
          <strong>{work.duration}</strong>
        </div>
        <div>
          <span className="meta-label">Role</span>
          <strong>{work.role}</strong>
        </div>
      </section>

      <section className="work-body">
        {bodySections.map((section) => (
          <article className="work-copy" key={section.label}>
            <p className="section-kicker">{section.label}</p>
            <p>{section.copy}</p>
          </article>
        ))}
      </section>

      {work.liveEmbed === 'nosy' && (
        <section className="work-live" aria-labelledby="live-work-title">
          <div className="work-live-head">
            <p className="section-kicker">Live work</p>
            <h2 id="live-work-title">Enter the booth</h2>
          </div>
          <NosyBooth variant="compact" />
        </section>
      )}

      {(work.audio || work.supportImage || work.archivalNote || work.links.length > 0) && (
        <section className="work-access" aria-labelledby="access-title">
          <h2 id="access-title">Access</h2>
          <div className="access-grid">
            {work.audio && (
              <div className="access-panel">
                <p className="section-kicker">Listen</p>
                <audio controls preload="metadata" src={work.audio} />
              </div>
            )}

            {work.supportImage && (
              <div className="access-panel support-panel">
                <p className="section-kicker">{work.supportLabel || 'Image'}</p>
                <img src={work.supportImage} alt={`${work.title} support still`} loading="lazy" />
              </div>
            )}

            {work.archivalNote && (
              <div className="access-panel">
                <p className="section-kicker">Archive note</p>
                <p>{work.archivalNote}</p>
              </div>
            )}

            {work.links.length > 0 && (
              <div className="access-panel">
                <p className="section-kicker">Links</p>
                <div className="work-links">
                  {work.links.map((link) => (
                    link.href.startsWith('/') ? (
                      <Link to={link.href} key={link.href}>
                        {link.label}
                        <GoArrowUpRight aria-hidden="true" />
                      </Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                        {link.label}
                        <GoArrowUpRight aria-hidden="true" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="work-gallery" aria-labelledby="gallery-title">
          <h2 id="gallery-title">{work.galleryLabel || 'Stills'}</h2>
          <div className="gallery-grid">
            {gallery.map((item) => (
              <figure key={item.src}>
                <img src={item.src} alt={item.caption} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav className="next-work-nav" aria-label="Adjacent works">
        <Link to={`/work/${previous.slug}`}>
          <GoArrowLeft aria-hidden="true" />
          <span>
            <small>Previous</small>
            {previous.title}
          </span>
        </Link>
        <Link to={`/work/${next.slug}`}>
          <span>
            <small>Next</small>
            {next.title}
          </span>
          <GoArrowRight aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
};

export default WorkPage;
