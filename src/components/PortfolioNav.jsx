import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Works', to: '/#works', section: 'works' },
  { label: 'Poems', to: '/art/poems', section: 'poems' },
  { label: 'Tech', to: '/projects', section: 'tech' },
  { label: 'Experience', to: '/experience', section: 'experience' },
  { label: 'Writings', to: '/writings', section: 'writings' },
];

const sectionForLocation = ({ pathname, hash }) => {
  if (pathname.startsWith('/work') || pathname === '/nosy' || pathname === '/soft-whisper') return 'works';
  if (pathname.startsWith('/art')) return 'poems';
  if (pathname === '/projects' || pathname === '/tech') return 'tech';
  if (pathname === '/experience') return 'experience';
  if (pathname === '/writings') return 'writings';
  if (pathname === '/' && hash === '#works') return 'works';
  return 'home';
};

const PortfolioNav = ({ className = '' }) => {
  const location = useLocation();
  const activeSection = sectionForLocation(location);

  return (
    <header className={`portfolio-shell-topbar ${className}`.trim()}>
      <Link
        className="portfolio-mark"
        to="/"
        aria-current={activeSection === 'home' ? 'page' : undefined}
      >
        Hamid Rezaee
      </Link>
      <nav className="portfolio-nav-links" aria-label="Primary">
        {navItems.map((item) => (
          <Link
            key={item.section}
            to={item.to}
            aria-current={activeSection === item.section ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default PortfolioNav;
