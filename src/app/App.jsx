import { useEffect } from 'react';
import { navigation, site } from '../config/site.js';
import { usePath } from './router.js';
import SiteLayout from '../components/SiteLayout.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LeaderboardPage from '../pages/LeaderboardPage.jsx';
import CasesPage from '../pages/CasesPage.jsx';
import AgentsPage from '../pages/AgentsPage.jsx';
import ContentPage from '../pages/ContentPage.jsx';
import { getAbout, getMethodology } from '../services/benchmark.js';

const pages = {
  '/': <LeaderboardPage />,
  '/agents': <AgentsPage />,
  '/cases': <CasesPage />,
  '/methodology': <ContentPage contentKey="methodology" load={getMethodology} />,
  '/about': <ContentPage contentKey="about" load={getAbout} />,
};

export default function App() {
  const path = usePath();
  const page = navigation.find((item) => item.path === path);

  useEffect(() => {
    document.title = `${page?.title ?? 'Page not found'} · ${site.name}`;
    document.getElementById('page-title')?.focus();
  }, [path, page]);

  return (
    <SiteLayout path={path} page={page}>
      {pages[path] ?? (
        <EmptyState title="Page not found" description="Choose a page from the navigation.">
          <a className="button" href="#/">Back to leaderboard</a>
        </EmptyState>
      )}
    </SiteLayout>
  );
}
