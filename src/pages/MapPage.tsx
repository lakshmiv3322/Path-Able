import { useEffect } from 'react';
import { Toaster } from 'sonner';
import MapView from '@/components/map/MapView';
import TopBar from '@/components/map/TopBar';
import ControlPanel from '@/components/map/ControlPanel';
import RouteInfoCard from '@/components/map/RouteInfoCard';
import VenueDetail from '@/components/map/VenueDetail';
import ReportBarrierModal from '@/components/map/ReportBarrierModal';
import MapFooter from '@/components/map/MapFooter';
import CommunityFeedTicker from '@/components/CommunityFeedTicker';
import { useApp } from '@/store/appStore';

export default function MapPage({ onReplay, onDashboard, onReset }: {
  onReplay: () => void;
  onDashboard: () => void;
  onReset: () => void;
}) {
  const { mode, selectedVenue, setSelectedVenue } = useApp();

  // apply assistive mode class to root html
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('mode-wheelchair', 'mode-low-vision', 'mode-elderly');
    html.classList.add(`mode-${mode}`);
    return () => { html.classList.remove('mode-wheelchair', 'mode-low-vision', 'mode-elderly'); };
  }, [mode]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapView />

      <TopBar />

      {/* route info card — left side, below topbar */}
      <div className="pointer-events-none absolute left-3 right-3 top-44 z-[1000] sm:left-5 sm:right-auto sm:top-36 sm:max-w-sm">
        <RouteInfoCard />
      </div>

      <ControlPanel onReset={onReset} />

      {selectedVenue && (
        <VenueDetail venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
      )}

      <ReportBarrierModal />

      <MapFooter onReplay={onReplay} onDashboard={onDashboard} onReset={onReset} />

      <CommunityFeedTicker />

      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: '12px', fontWeight: 600 },
          className: 'font-sans',
        }}
      />
    </div>
  );
}
