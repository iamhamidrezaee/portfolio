import React, { useState } from 'react';
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
      { label: 'Experience', ariaLabel: 'View Experience', href: 'experience' },
      { label: 'Education', ariaLabel: 'View Education', href: 'experience' },
    ],
  },
  {
    label: 'Work',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Projects', ariaLabel: 'View Projects', href: 'projects' },
      { label: 'GitHub', ariaLabel: 'GitHub Profile', isExternal: true, url: 'https://github.com/iamhamidrezaee' },
    ],
  },
  {
    label: 'Writings',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Blog Posts', ariaLabel: 'Read Blog Posts', href: 'writings' },
      { label: 'ML Chronicles', ariaLabel: 'The Why Chronicles', href: 'writings' },
    ],
  },
  {
    label: 'Art',
    bgColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#fff',
    links: [
      { label: 'Poems', ariaLabel: 'View Poems', href: 'art' },
      { label: 'Videos', ariaLabel: 'View Videos', href: 'art' },
      { label: 'Designs', ariaLabel: 'View Designs', href: 'art' },
      { label: 'Photography', ariaLabel: 'View Photography', href: 'art' },
    ],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const dockItems = [
    {
      icon: <VscHome size={22} />,
      label: 'Home',
      onClick: () => setCurrentPage('home'),
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
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'writings':
        return <WritingsPage onBack={() => setCurrentPage('home')} />;
      case 'experience':
        return <ExperiencePage onBack={() => setCurrentPage('home')} />;
      case 'projects':
        return <ProjectsPage onBack={() => setCurrentPage('home')} />;
      case 'art':
        return <ArtPage onBack={() => setCurrentPage('home')} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <CardNav
        items={NAV_ITEMS}
        onNavigate={handleNavigate}
        baseColor="rgba(10, 10, 10, 0.65)"
        menuColor="#fff"
        buttonBgColor="#fff"
        buttonTextColor="#000"
      />
      
      {renderPage()}
      
      <Dock
        items={dockItems}
        panelHeight={64}
        baseItemSize={46}
        magnification={65}
      />
    </div>
  );
}

export default App;
