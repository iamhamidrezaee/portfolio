import React, { useState, useRef, useEffect } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import './ArtPage.css';

// ───────────────────────────────────────
// Placeholder Data
// ───────────────────────────────────────

const poems = [
  {
    title: 'Untitled I',
    meta: 'spring — 2024',
    stanzas: [
      'The light pressed thin against the wall,\na quiet hum of afternoon—\nI held a thought too long\nand watched it turn to stone.',
      'There is a door I keep forgetting,\nnot locked, just heavy.\nSome days I stand before it\nwith nothing in my hands.',
    ],
  },
  {
    title: 'Untitled II',
    meta: 'winter — 2023',
    stanzas: [
      'I gave my name to the river\nand the river said nothing back.\nThat was the year I learned\nsilence is not empty.',
      'The birds returned\nbut not the same ones.\nI counted them anyway,\nthe way you count the days\nafter someone leaves.',
    ],
  },
  {
    title: 'Untitled III',
    meta: 'autumn — 2023',
    stanzas: [
      'Between the asking and the answer\nthere is a country\nwhere the rain falls upward\nand no one is surprised.',
    ],
  },
];

const designs = [
  {
    title: 'Visual System — Series A',
    meta: 'identity · 2024',
  },
  {
    title: 'Typographic Study',
    meta: 'experimental · 2024',
  },
  {
    title: 'Spatial Compositions',
    meta: 'print · 2023',
  },
];

const videos = [
  {
    title: 'Get Outta Me Head',
    meta: 'short film · 2024',
    src: '/get-outta-me-head.mp4',
  },
];

const photos = [
  {
    title: 'Series I — Light Studies',
    meta: '35mm · 2024',
  },
  {
    title: 'Series II — Urban Fragments',
    meta: 'digital · 2024',
  },
  {
    title: 'Series III — Portraits',
    meta: 'medium format · 2023',
  },
  {
    title: 'Series IV — Still Life',
    meta: 'digital · 2023',
  },
];

// ───────────────────────────────────────
// Sub-sections
// ───────────────────────────────────────

const PoemsSection = ({ onBack }) => (
  <div className="art-section">
    <div className="art-section-header">
      <button className="art-section-back" onClick={onBack}>
        <GoArrowLeft /> back
      </button>
      <h1 className="art-section-title">Poems</h1>
    </div>
    <hr className="art-section-rule" />

    {poems.map((poem, i) => (
      <div className="art-work" key={i}>
        <div className="art-work-media">
          <div className="art-work-text">
            {poem.stanzas.map((stanza, j) => (
              <p className={j > 0 ? 'poem-stanza' : ''} key={j}>
                {stanza.split('\n').map((line, k) => (
                  <React.Fragment key={k}>
                    {line}
                    {k < stanza.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
        <div className="art-work-info">
          <h2 className="art-work-title">{poem.title}</h2>
          <p className="art-work-meta">{poem.meta}</p>
        </div>
      </div>
    ))}

    <footer className="art-section-footer">
      <span className="art-section-colophon">poems — hamid rezaee</span>
    </footer>
  </div>
);

const DesignsSection = ({ onBack }) => (
  <div className="art-section">
    <div className="art-section-header">
      <button className="art-section-back" onClick={onBack}>
        <GoArrowLeft /> back
      </button>
      <h1 className="art-section-title">Designs</h1>
    </div>
    <hr className="art-section-rule" />

    {designs.map((design, i) => (
      <div className="art-work" key={i}>
        <div className="art-work-media">
          <div className="art-placeholder-img">
            <span>artwork</span>
          </div>
        </div>
        <div className="art-work-info">
          <h2 className="art-work-title">{design.title}</h2>
          <p className="art-work-meta">{design.meta}</p>
        </div>
      </div>
    ))}

    <footer className="art-section-footer">
      <span className="art-section-colophon">designs — hamid rezaee</span>
    </footer>
  </div>
);

const VideosSection = ({ onBack }) => {
  const videoRefs = useRef([]);

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    const container = video?.closest('.art-video-container');
    if (!video || !container) return;

    if (video.paused) {
      video.play();
      container.dataset.state = 'playing';
    } else {
      video.pause();
      container.dataset.state = 'paused';
    }
  };

  const handleVideoEnd = (index) => {
    const video = videoRefs.current[index];
    const container = video?.closest('.art-video-container');
    if (container) {
      container.dataset.state = 'paused';
    }
  };

  return (
    <div className="art-section">
      <div className="art-section-header">
        <button className="art-section-back" onClick={onBack}>
          <GoArrowLeft /> back
        </button>
        <h1 className="art-section-title">Videos</h1>
      </div>
      <hr className="art-section-rule" />

      {videos.map((vid, i) => (
        <div className="art-work" key={i}>
          <div className="art-work-media">
            <div
              className="art-video-container"
              data-state="paused"
              onClick={() => handleVideoClick(i)}
            >
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={vid.src}
                preload="metadata"
                playsInline
                onEnded={() => handleVideoEnd(i)}
              />
              <div className="art-play-indicator">
                <span>play</span>
              </div>
            </div>
          </div>
          <div className="art-work-info">
            <h2 className="art-work-title">{vid.title}</h2>
            <p className="art-work-meta">{vid.meta}</p>
          </div>
        </div>
      ))}

      <footer className="art-section-footer">
        <span className="art-section-colophon">videos — hamid rezaee</span>
      </footer>
    </div>
  );
};

const PhotographySection = ({ onBack }) => (
  <div className="art-section">
    <div className="art-section-header">
      <button className="art-section-back" onClick={onBack}>
        <GoArrowLeft /> back
      </button>
      <h1 className="art-section-title">Photography</h1>
    </div>
    <hr className="art-section-rule" />

    {photos.map((photo, i) => (
      <div className="art-work" key={i}>
        <div className="art-work-media">
          <div className="art-photo-placeholder">
            <span>photograph</span>
          </div>
        </div>
        <div className="art-work-info">
          <h2 className="art-work-title">{photo.title}</h2>
          <p className="art-work-meta">{photo.meta}</p>
        </div>
      </div>
    ))}

    <footer className="art-section-footer">
      <span className="art-section-colophon">photography — hamid rezaee</span>
    </footer>
  </div>
);

// ───────────────────────────────────────
// Main Art Page
// ───────────────────────────────────────

const ArtPage = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState(null);

  const openSection = (section) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  const backToHub = () => {
    setActiveSection(null);
    window.scrollTo(0, 0);
  };

  const sections = {
    poems: <PoemsSection onBack={backToHub} />,
    designs: <DesignsSection onBack={backToHub} />,
    videos: <VideosSection onBack={backToHub} />,
    photography: <PhotographySection onBack={backToHub} />,
  };

  return (
    <div className="art-page">
      {/* Fixed back button to portfolio home */}
      <button className="art-back-button" onClick={onBack}>
        <GoArrowLeft className="back-arrow" />
        <span>home</span>
      </button>

      {activeSection ? (
        sections[activeSection]
      ) : (
        <div className="art-hub">
          <div className="art-hub-header">
            <span className="art-hub-title">selected works</span>
          </div>

          <hr className="art-hub-rule" />

          <nav className="art-hub-nav">
            <button className="art-hub-link" onClick={() => openSection('poems')}>
              Poems
            </button>
            <button className="art-hub-link" onClick={() => openSection('designs')}>
              Designs
            </button>
            <button className="art-hub-link" onClick={() => openSection('videos')}>
              Videos
            </button>
            <button className="art-hub-link" onClick={() => openSection('photography')}>
              Photography
            </button>
          </nav>

          <hr className="art-hub-rule" />

          <div className="art-hub-footer">
            <span className="art-hub-colophon">hamid rezaee — art</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPage;
