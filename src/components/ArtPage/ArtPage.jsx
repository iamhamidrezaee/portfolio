import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import './ArtPage.css';

// ───────────────────────────────────────
// Utilities
// ───────────────────────────────────────

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ───────────────────────────────────────
// Placeholder Data
// ───────────────────────────────────────

const poems = [
  {
    title: 'Our Garden Rose',
    meta: 'spring — 2026',
    stanzas: [
      'Among the rest of them, one\nstands out: the rose.\nOur garden, petite and delicate, now\nhas a rose, so red, so inviting, so fresh\nthat it bleeds fragrance, sheds\nliver-red petals, and is whispering,\n"come forth, and lick me into poetry."',
    ],
  },
  {
    title: 'Yellow Soccer Ball',
    meta: 'spring — 2026',
    stanzas: [
      'My yellow soccer ball\ndad brings it home, and\nI have not blinked once;\nA piece of the sun before me\nGlorious, tough, loyal, how much\nI adore it! So yellow, I want to eat it,\nbite into its flesh like a\nhungry fox.',
      'A day passed, and my yellow soccer ball\ntore open, what\na short life it had, little did\nI know, the yellow was telling me goodbye from\nthe start.',
    ],
  },
  {
    title: 'Guilt, Betrayel / The Radioactive Glass',
    meta: 'spring — 2026',
    stanzas: [
      'The delicate glass, shiny and\nso beautiful, while all I\nhad to do was to\nhold it near and dear to me\nIt fell, now shattered in\npieces, all broken, never\nrecoverable in its very\nfirst form. All I\nhad to do was\nto protect it. I failed,\nI did not fulfil; and now\nI am writing this poem\u2014\nlittle do I know that I...\nam uncapable of\u2026 even fini\u2014',
    ],
  },
  {
    title: 'A Smile Behind the Bars',
    meta: 'spring — 2026',
    stanzas: [
      'You put me in this\ngolden cage, behind the\ngolden golden bars',
      'And if I had the\nchoice of choosing',
      'I will pick your\ngolden golden shackles a\nmillion times over',
      'If only I was\ngiven the chance\nonce again, and\nbreak free of\nthis choking freedom\u2014\nIf only',
    ],
  },
  {
    title: 'A Long Lost Hope',
    meta: 'spring — 2026',
    stanzas: [
      '\u201CIf I could\u2026\u201D, \u201CIf I could\u2026\u201D, \u201CIf I could\u2026\u201D\nis haunting me, and\nwill forever do\nBut hey! I am okay, and\nas it should.',
    ],
  },
  {
    title: 'O Distant Refuge',
    meta: 'spring — 2026',
    stanzas: [
      'refuge, O source of my hope\nhow are you? \nO glow of moonlight, O feather\nof a heart\nhow are you?\nO so beautiful soul, O innocent\nhands, O owner of the pearls, O breeze\nof joy\nhow are you?\nO graceful, O pure, O glamorous',
      '\nO beautiful blue eyes',
      'How are you?',
    ],
  },
  {
    title: 'Fading, Memory by Memory',
    meta: 'spring — 2026',
    stanzas: [
      'Walking next to you\nnot holding hands\nyou are disappointed at me\nThe sky is clear, with a soft breeze\ntaking over our shoulders\nWhy were you still there? \nThere, right then, right that second\nand you disappeared, nobody was next \nto me from the beginning of that night, or\nat least, not the same body, not the same person and now \nwho are you? who is this?\nI am afraid, full of fear\nAs if you are a memory\nfalling off a cliff\nand with my hand stretched\nI\u2019m holding on to you, while\nyou, with tears in your eyes\nand a soft crying voice, say\n\u201CDon\u2019t forget me.\u201D',
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

const PoemsSection = ({ slug }) => {
  useEffect(() => {
    if (slug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(slug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [slug]);

  return (
    <div className="art-section">
      <div className="art-section-header">
        <h1 className="art-section-title">Poems</h1>
      </div>
      <hr className="art-section-rule" />

      {poems.map((poem, i) => (
        <div className="art-work" key={i} id={slugify(poem.title)}>
          <div className="art-work-media">
            <div className="poem-header">
              <h2 className="art-work-title">{poem.title}</h2>
            </div>
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
            <div className="poem-footer-meta">
              <p className="art-work-meta">{poem.meta}</p>
            </div>
          </div>
        </div>
      ))}

      <footer className="art-section-footer">
        <span className="art-section-colophon">poems — hamid rezaee</span>
      </footer>
    </div>
  );
};

const DesignsSection = () => (
  <div className="art-section">
    <div className="art-section-header">
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

const VideosSection = () => {
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

const PhotographySection = () => (
  <div className="art-section">
    <div className="art-section-header">
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
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL: /art → hub, /art/poems → section, /art/poems/some-slug → section + item
  const pathParts = location.pathname.replace(/^\/art\/?/, '').split('/').filter(Boolean);
  const activeSection = pathParts[0] || null;
  const slug = pathParts[1] || null;

  const openSection = (section) => {
    navigate(`/art/${section}`);
    window.scrollTo(0, 0);
  };

  const backToHub = () => {
    navigate('/art');
    window.scrollTo(0, 0);
  };

  const sections = {
    poems: <PoemsSection slug={slug} />,
    designs: <DesignsSection />,
    videos: <VideosSection />,
    photography: <PhotographySection />,
  };

  return (
    <div className="art-page">
      {/* Fixed back button — context-aware */}
      <button
        className="art-back-button"
        onClick={activeSection ? backToHub : onBack}
      >
        <GoArrowLeft className="back-arrow" />
        <span>{activeSection ? 'back' : 'home'}</span>
      </button>

      {activeSection && sections[activeSection] ? (
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
