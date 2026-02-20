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

// Vertical offset for poem images: up/down with a number, clamped so the image stays in bounds (px).
const IMAGE_OFFSET_MIN = -900;
const IMAGE_OFFSET_MAX = 900;

const getPoemImageOffsetStyle = (poem) => {
  const clamp = (n) => Math.max(IMAGE_OFFSET_MIN, Math.min(IMAGE_OFFSET_MAX, n));
  if (poem.up != null && poem.up !== '') {
    const n = parseInt(poem.up, 10);
    if (!Number.isNaN(n)) return { transform: `translateY(${clamp(-n)}px)` };
  }
  if (poem.down != null && poem.down !== '') {
    const n = parseInt(poem.down, 10);
    if (!Number.isNaN(n)) return { transform: `translateY(${clamp(n)}px)` };
  }
  return undefined;
};

// ───────────────────────────────────────
// Placeholder Data
// ───────────────────────────────────────

const poems = [
  {
    title: 'Our Garden Rose',
    
    image: '/rose.jpg',
    stanzas: [
      'Among the rest of them, one\nstands out: the rose.\nOur garden, petite and delicate, now\nhas a rose, so red, so inviting, so fresh\nthat it bleeds fragrance, sheds\nliver-red petals, and is whispering,\n"come forth, and lick me into poetry."',
    ],
  },
  {
    title: 'Yellow Soccer Ball',
    
    stanzas: [
      'My yellow soccer ball\ndad brings it home, and\nI have not blinked once;\nA piece of the sun before me\nGlorious, tough, loyal, how much\nI adore it! So yellow, I want to eat it,\nbite into its flesh like a\nhungry fox.',
      'A day passed, and my yellow soccer ball\ntore open, what\na short life it had, little did\nI know, the yellow was telling me goodbye from\nthe start.',
    ],
  },
  {
    title: 'Guilt, Betrayel / The Radioactive Glass',
    
    stanzas: [
      'The delicate glass, shiny and\nso beautiful, while all I\nhad to do was to\nhold it near and dear to me\nIt fell, now shattered in\npieces, all broken, never\nrecoverable in its very\nfirst form. All I\nhad to do was\nto protect it. I failed,\nI did not fulfil; and now\nI am writing this poem\u2014\nlittle do I know that I...\nam uncapable of\u2026 even fini\u2014',
    ],
  },
  {
    title: 'A Smile Behind the Bars',
    image: '/shackles.png',
    stanzas: [
      'You put me in this\ngolden cage, behind the\ngolden golden bars',
      'And if I had the\nchoice of choosing',
      'I will pick your\ngolden golden shackles a\nmillion times over',
      'If only I was\ngiven the chance\nonce again, and\nbreak free of\nthis choking freedom\u2014\nIf only',
    ],
  },
  {
    title: 'A Long Lost Hope',
    
    stanzas: [
      '\u201CIf I could\u2026\u201D, \u201CIf I could\u2026\u201D, \u201CIf I could\u2026\u201D\nis haunting me, and\nwill forever do\nBut hey! I am okay, and\nas it should.',
    ],
  },
  {
    title: 'O Distant Refuge',
    
    stanzas: [
      'refuge, O source of my hope\nhow are you? \nO glow of moonlight, O feather\nof a heart\nhow are you?\nO so beautiful soul, O innocent\nhands, O owner of the pearls, O breeze\nof joy\nhow are you?\nO graceful, O pure, O glamorous',
      '\nO beautiful blue eyes',
      'How are you?',
    ],
  },
  {
    title: 'Fading, Memory by Memory',
    image: "/ballerina.png",
    stanzas: [
      'Walking next to you\nnot holding hands\nyou are disappointed at me\nThe sky is clear, with a soft breeze\ntaking over our shoulders\nWhy were you still there? \nThere, right then, right that second\nand you disappeared, nobody was next \nto me from the beginning of that night, or \nat least, not the same body, \nnot the same person and now \nwho are you? who is this?\nI am afraid, full of fear\nAs if you are a memory\nfalling off a cliff\nand with my hand stretched\nI\u2019m holding on to you, while\nyou, with tears in your eyes\nand a soft crying voice, say\n\u201CDon\u2019t forget me.\u201D',
    ],
  },
  {
    title: 'One Last Look',
    stanzas: [
      'at the lights of San Francisco\nfrom the plane window\nand a flash\nof all the moments\nwhere I thought life\ncannot get any happier\nthan this',
      '',
      'One last look and\nwe were now far\nfar away, the plane\nflying so aggressively, the\nwooshing sound, this damned\ndeafening sound',
      'I am far, my ears\nlocked and nothing\nbut darkness visible for\nmiles',
      'And now you\nare all of this city\neverywhere, at every two\nhands holding, at every\nkiss, at every heart, at\nevery work of art, at every\nlove, is all you and all\nof you',
      'Then the landing, I jump\nout of my sleep, I sigh\nand prepare once\nagain to walk\nonto my journey that\nis all of this.'
    ]
  },
  {
    title: 'Year is Checkered',
    image:"/hand.png",
    down:"500",
    stanzas: [
      'When we were overwhelmed\nwith happiness, frolicing along\nthe Columbus street\nall I saw was light, even\nat the midnight when we\ncraved ice cream\nThe soft breeze of summer\nplaying with your skirt, and my\nhand locked with yours',
      '',
      'At that moment, all I could see\nwas light',
      'But then, winter arrived, and\nmy hand now was piercing\nthrough your skin, a set\nof invisible claws that were\ndipped in the poison\nof betrayal\ngoing deeper and deeper into your essence of honesty and trust and love and care and loyalty\nbut my words, those cold, shiny, thin blades were why you never saw\nthe horns, the claws, the hell in my eyes.',
      'A winter, gloomy\nand harsh, that is who\nI was to your delicate soul.',
      'Your year got checkered,\nand I am sawing my horns,\ncutting my claws,\nwanting to\none day, kill this winter of a monster,\nand maybe, again, reach the light!'
    ]
  },
  {
    title: 'A Long Last Blue Poem',
    image:"/blue_eyes_1.jpeg",
    stanzas: [
      'where each stanza talks\nof you, for you, and only you.\nHow are you?\nWhy are you\nhere, to read a long blue poem?\nwhy should you, even?',
      '',
      'How are your eyes, your face,\nyour hands, your legs, your heart?\nDo they feel craved-for, longed-for, yet?',
      'How about your words, your love, your thoughts\ndo they?',
      'When your ear-to-ear beam of joy\nwas such a bless to see, to\nyour scent not to wear off my sheets',
      'and your feeble self that\nnever plotted nor schemed\nand you who named a hater "an asshole"',
      'how funny of a language-\nwhere what comes after the alphabet\u2019s cursed letter "h" \nwould never be found\nalong a blue poem',
      'Lana\u2019s vocals echo\nback from the corners of\na small room located east\nof Yerba Buena',
      'Went back\nto your baby photo\nThe colorful ball before your foot\nyour hat so large, so gangster\nYour floral red dress that\nhas blue flowers too\nyou are that same creature\nbut now hurt, or not, for who\nhas that power over you\nYou hold the sheer power, so beyond thought, beyond\nhuman',
      'You are caressed\nby the hands of Venus\nand made of dust\nfrom the gorgeous moon\u2014\nlook at you\nthe blue sky\u2019 glow\nreflects from your eyes\nthe glow on darkness\nmarked all over the art\non one glamorous canvas:\nyour body',
      'You deserve a lord\nof Ephyra, but one eternally\nblessed to kneel\nbefore you and cry\nscream, bleed, and hug\nthe sweet shackles, only\ngrateful of your presence',
      'Soon, you may see less\nof Stefan\nwho betrayed you\nHe shall be gone\nand for all that he has done for self,\nfor once, he may do one\nfor you:\nto be gone\nand never make\nyour eyes of much beauty\nsee such creature of no\nvalue, essence, nor soul',
      'Those last words of yours\nare a lullaby and a wake up call.\nThoughts of you are hugs of\ncalm, the dark\nblue scarf\nwrapped around my neck\npresents me the joy to\nyearn, for such a thorn to be\ncursed to yearn and never can\nlove, or at least, so to be told',
      'Remember:\nnot one Marlboro shall be\nheld by my hands\nunless\nyou are there,\nand not one love\nshall be felt that does not\ncarry your breeze\u2014\nyou see the moon, please\nwave and say hello\nback, for a hello was sent\nto you from far far away\nor why\nshould you, but hey,\nwho knows one who\nhas no hope.\nAt the absence of your words,\nthat hope, the only and last one, keeps me company',
      'And here, at last',
      'Peace, Love\nso long, blue eyes!'
    ]
  }
];

const designs = [
  {
    title: 'To be added soon',
    meta: '',
  }
];

const videos = [
  {
    title: 'Get Outta Me Head',
    meta: 'short film · 2024',
    src: '/get-outta-me-head.mp4',
    visible: true, // toggle to true when ready to show
  },
];

const photos = [
  {
    title: 'To be added soon',
    meta: '',
  }
];

// ───────────────────────────────────────
// Sub-sections
// ───────────────────────────────────────

const POEM_IMAGE_OFFSET_BREAKPOINT = 768; // match ArtPage.css poem-with-image column layout

const PoemsSection = ({ slug }) => {
  const [applyImageOffset, setApplyImageOffset] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > POEM_IMAGE_OFFSET_BREAKPOINT : true
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${POEM_IMAGE_OFFSET_BREAKPOINT + 1}px)`);
    const handler = () => setApplyImageOffset(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
            <div className={poem.image ? 'poem-with-image' : undefined}>
              <div className="poem-body">
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
              {poem.image && (
                <div
                  className="poem-image"
                  style={applyImageOffset ? getPoemImageOffsetStyle(poem) : undefined}
                >
                  <img src={poem.image} alt={poem.title} />
                </div>
              )}
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

      {videos.filter((v) => v.visible).length === 0 && (
        <div className="art-work">
          <div className="art-work-media" style={{ textAlign: 'center', padding: '8vh 0' }}>
            <span style={{ fontFamily: 'var(--art-sans)', fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.08em', opacity: 0.35 }}>
              coming soon
            </span>
          </div>
        </div>
      )}
      {videos.filter((v) => v.visible).map((vid, i) => (
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
