import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WritingsPage from './components/WritingsPage/WritingsPage';
import ExperiencePage from './components/ExperiencePage/ExperiencePage';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import ArtPage from './components/ArtPage/ArtPage';
import WorkPage from './components/WorkPage/WorkPage';
import NosyPage from './components/NosyPage/NosyPage';

const SoftWhisperPage = lazy(() => import('./components/SoftWhisperPage/SoftWhisperPage'));

function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (!location.hash) {
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      html.scrollTop = 0;
      const frame = window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        html.scrollTop = 0;
        html.style.scrollBehavior = previousScrollBehavior;
      });
      return () => {
        window.cancelAnimationFrame(frame);
        html.style.scrollBehavior = previousScrollBehavior;
      };
    }

    const targetId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nosy" element={<NosyPage />} />
        <Route
          path="/soft-whisper"
          element={(
            <Suspense fallback={<div className="route-loading">Soft Whisper</div>}>
              <SoftWhisperPage />
            </Suspense>
          )}
        />
        <Route path="/work" element={<Navigate to="/work/get-outta-me-head" replace />} />
        <Route path="/work/fun-surv" element={<Navigate to="/work/nosy" replace />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tech" element={<Navigate to="/projects" replace />} />
        <Route path="/writings" element={<WritingsPage />} />
        <Route path="/art/*" element={<ArtPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
