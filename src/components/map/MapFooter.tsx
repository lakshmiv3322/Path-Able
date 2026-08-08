import { ChevronUp, ChevronDown, Navigation, MapPinned, RotateCcw } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { useState } from 'react';

export default function MapFooter({ onReplay, onDashboard, onReset }: {
  onReplay: () => void;
  onDashboard: () => void;
  onReset: () => void;
}) {
  const { t, destination, routes, resetDemo } = useApp();
  const [expanded, setExpanded] = useState(false);
  const active = routes.find((r) => r.id === 'step-free');

  function handleReset() {
    resetDemo();
    onReset();
  }

  return (
    <footer className="pointer-events-none absolute bottom-0 left-0 z-[999] hidden lg:block">
      <div className="pointer-events-auto ml-[max(1rem,calc(50vw-30rem))] mb-0 w-[28rem] max-w-[90vw] rounded-t-2xl bg-card/95 px-4 py-2 shadow-lg ring-1 ring-border backdrop-blur">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary rounded-lg p-1"
          aria-expanded={expanded}
        >
          <span className="flex items-center gap-1.5">
            <MapPinned size={13} className="text-primary" aria-hidden /> PathAble
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">PS-16 · Accessibility &amp; Inclusion</span>
            {expanded ? <ChevronDown size={14} aria-hidden /> : <ChevronUp size={14} aria-hidden />}
          </span>
        </button>
        {expanded && (
          <div className="mt-2 space-y-1.5 border-t border-border pt-2 text-xs animate-fade-in-up">
            <p className="text-muted-foreground">{t('appTagline')}</p>
            {destination && active && (
              <p className="flex items-center gap-1.5 text-foreground">
                <Navigation size={12} className="text-success" aria-hidden /> {destination.name} · {active.etaMin} min · {active.distanceKm} km
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <button onClick={onReplay} className="font-medium text-primary underline underline-offset-2 hover:text-secondary focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary rounded">
                {t('replayStory')}
              </button>
              <button onClick={onDashboard} className="font-medium text-primary underline underline-offset-2 hover:text-secondary focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary rounded">
                {t('navDashboard')}
              </button>
              <button onClick={handleReset} className="flex items-center gap-1 font-medium text-danger underline underline-offset-2 hover:text-danger/80 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary rounded">
                <RotateCcw size={11} aria-hidden /> Reset Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
