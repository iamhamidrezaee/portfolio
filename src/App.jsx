import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WritingsPage from './components/WritingsPage/WritingsPage';
import ExperiencePage from './components/ExperiencePage/ExperiencePage';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import ArtPage from './components/ArtPage/ArtPage';
import CardNav from './components/CardNav/CardNav';
import Dock from './components/Dock/Dock';
import { VscHome, VscGithubInverted, VscMail } from 'react-icons/vsc';
import { FaLinkedinIn } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';

// Static nav items - defined outside component to prevent recreation
const NAV_ITEMS = [
  {
    label: 'About',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Experience', ariaLabel: 'View Experience', href: '/experience' },
      { label: 'Education', ariaLabel: 'View Education', href: '/experience' },
    ],
  },
  {
    label: 'Work',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Projects', ariaLabel: 'View Projects', href: '/projects' },
      { label: 'GitHub', ariaLabel: 'GitHub Profile', isExternal: true, url: 'https://github.com/iamhamidrezaee' },
    ],
  },
  {
    label: 'Writings',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Blog Posts', ariaLabel: 'Read Blog Posts', href: '/writings' },
      { label: 'ML Chronicles', ariaLabel: 'The Why Chronicles', href: '/writings' },
    ],
  },
  {
    label: 'Art',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Poems', ariaLabel: 'View Poems', href: '/art/poems' },
      { label: 'Videos', ariaLabel: 'View Videos', href: '/art/videos' },
      { label: 'Designs', ariaLabel: 'View Designs', href: '/art/designs' },
      { label: 'Photography', ariaLabel: 'View Photography', href: '/art/photography' },
    ],
  },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    {
      icon: <VscHome size={22} />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
    {
      icon: <VscGithubInverted size={22} />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/iamhamidrezaee', '_blank'),
    },
    {
      icon: <FaLinkedinIn size={20} />,
      label: 'LinkedIn',
      onClick: () => window.open('https://www.linkedin.com/in/iamhamidrezaee', '_blank'),
    },
    {
      icon: <VscMail size={22} />,
      label: 'Email',
      onClick: () => window.location.href = 'mailto:hr328@cornell.edu',
    },
    {
      icon: <HiDocumentText size={22} />,
      label: 'Resume',
      onClick: () => window.open('/Hamid_Rezaee_Resume.pdf', '_blank'),
    },
  ];

  const handleNavigate = (page) => {
    const path = page.startsWith('/') ? page : `/${page}`;
    navigate(path);
    window.scrollTo(0, 0);
  };

  const isArtPage = location.pathname.startsWith('/art');

  const artDockItems = [
    {
      icon: <VscHome size={22} />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {!isArtPage && (
        <CardNav
          items={NAV_ITEMS}
          onNavigate={handleNavigate}
          baseColor="rgba(10, 10, 10, 0.65)"
          menuColor="#fff"
          buttonBgColor="#fff"
          buttonTextColor="#000"
        />
      )}
      
      <Routes>
        <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
        <Route path="/experience" element={<ExperiencePage onBack={() => navigate('/')} />} />
        <Route path="/projects" element={<ProjectsPage onBack={() => navigate('/')} />} />
        <Route path="/writings" element={<WritingsPage onBack={() => navigate('/')} />} />
        <Route path="/art/*" element={<ArtPage onBack={() => navigate('/')} />} />
      </Routes>
      
      <Dock
        items={isArtPage ? artDockItems : dockItems}
        panelHeight={64}
        baseItemSize={46}
        magnification={isArtPage ? 46 : 65}
      />
    </div>
  );
}

export default App;
