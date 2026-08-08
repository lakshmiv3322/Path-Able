import { useState } from 'react';
import { AppProvider } from '@/store/appStore';
import StoryIntro from '@/components/StoryIntro';
import MapPage from '@/pages/MapPage';
import Dashboard from '@/pages/Dashboard';

type Page = 'map' | 'dashboard';

function AppShell() {
  const [introDone, setIntroDone] = useState(false);
  const [page, setPage] = useState<Page>('map');
  const [replayKey, setReplayKey] = useState(0);

  function resetAll() {
    setIntroDone(false);
    setPage('map');
    setReplayKey((k) => k + 1);
  }

  if (!introDone) {
    return <StoryIntro key={replayKey} onDone={() => setIntroDone(true)} />;
  }

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('map')} />;
  }

  return (
    <MapPage
      onReplay={() => { setIntroDone(false); setReplayKey((k) => k + 1); }}
      onDashboard={() => setPage('dashboard')}
      onReset={resetAll}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
