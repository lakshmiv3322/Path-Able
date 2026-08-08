import { useEffect, useRef, useState } from 'react';
import { X, Navigation, Check, Flag, ShieldCheck, Clock } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '@/store/appStore';
import type { Venue } from '@/data/mockData';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { cn } from '@/lib/utils';

const scoreColor = (s: number) => (s >= 8 ? '#1FA971' : s >= 6.5 ? '#F2A93B' : '#D64545');

function breakdown(v: Venue) {
  const f = v.features;
  return [
    { feature: 'Ramp', value: f.ramp ? 10 : 2 },
    { feature: 'Elevator', value: f.elevator ? 10 : 2 },
    { feature: 'Restroom', value: f.restroom ? 10 : 2 },
    { feature: 'Doorway', value: Math.min(10, Math.round(f.doorwayWidthCm / 10)) },
    { feature: 'Parking', value: f.parking ? 10 : 2 },
    { feature: 'Tactile', value: f.tactilePaving ? 10 : 2 },
  ];
}

const featureLabels: { key: keyof Venue['features']; label: string }[] = [
  { key: 'ramp', label: 'ramp' },
  { key: 'elevator', label: 'elevator' },
  { key: 'restroom', label: 'restroom' },
  { key: 'parking', label: 'parking' },
  { key: 'tactilePaving', label: 'tactilePaving' },
];

export default function VenueDetail({ venue, onClose }: { venue: Venue; onClose: () => void }) {
  const { t, confirmVenue, flagVenue, setDestination } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const data = breakdown(venue);
  const color = scoreColor(venue.accessScore);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, []);

  useFocusTrap(true, sheetRef, {
    initialRef: closeRef,
    onEscape: onClose,
    returnRef: { current: triggerRef.current } as React.RefObject<HTMLElement>,
  });

  return (
    <div
      ref={sheetRef}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-[1100] mx-auto w-full max-w-lg animate-slide-up"
      role="dialog"
      aria-modal="true"
      aria-label={`${venue.name} details`}
    >
      <div className="rounded-t-3xl bg-card shadow-2xl ring-1 ring-border">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-border" />
        <div className="max-h-[70vh] overflow-y-auto thin-scroll p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold leading-tight">{venue.name}</h2>
              <p className="text-xs text-muted-foreground">{venue.district} district · {venue.type}</p>
            </div>
            <button ref={closeRef} onClick={onClose} aria-label={t('closeVenue')} className="rounded-lg p-1.5 hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary">
              <X size={18} aria-hidden />
            </button>
          </div>

          {/* access score */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: color }}>
                <span className="font-display text-2xl font-bold">{venue.accessScore.toFixed(1)}</span>
              </div>
              <span className="mt-1 text-[10px] font-medium text-muted-foreground">{t('accessScore')}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-success">
                <ShieldCheck size={13} aria-hidden /> {t('verified')} · {venue.lastVerified}
              </div>
              <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Check size={12} className="text-success" aria-hidden /> {venue.confirms} {t('confirms')}</span>
                <span className="flex items-center gap-1"><Flag size={12} className="text-danger" aria-hidden /> {venue.flags} {t('flags')}</span>
              </div>
            </div>
          </div>

          {/* radar */}
          <div className="mt-4">
            <h3 className="mb-1 text-sm font-semibold">{t('scoreBreakdown')}</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} outerRadius="72%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* features */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {featureLabels.map(({ key, label }) => (
              <div key={key} className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                venue.features[key] ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger')}>
                {venue.features[key] ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />}
                <span>{t(label)}</span>
              </div>
            ))}
            <div className="col-span-2 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
              <span className="font-semibold">{t('doorwayWidth')}:</span> {venue.features.doorwayWidthCm} cm
            </div>
          </div>

          {/* audits */}
          <div className="mt-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Clock size={14} aria-hidden /> {t('auditHistory')}</h3>
            <ul className="space-y-2">
              {venue.audits.map((a, i) => (
                <li key={i} className="rounded-xl bg-muted/50 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">{a.verifier}</span>
                    <span className="text-muted-foreground">{a.date}</span>
                  </div>
                  <p className="mt-1 text-foreground">{a.note}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* community actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => { if (!confirmed) { confirmVenue(venue.id); setConfirmed(true); } }}
              disabled={confirmed}
              className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
                confirmed ? 'bg-success/20 text-success' : 'bg-success text-success-foreground hover:opacity-90')}
            >
              <Check size={15} aria-hidden /> {confirmed ? t('verified') : t('confirmListing')}
            </button>
            <button
              onClick={() => { if (!flagged) { flagVenue(venue.id); setFlagged(true); } }}
              disabled={flagged}
              className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
                flagged ? 'bg-danger/20 text-danger' : 'bg-danger/90 text-danger-foreground hover:opacity-90')}
            >
              <Flag size={15} aria-hidden /> {flagged ? t('flags') : t('flagListing')}
            </button>
          </div>

          {/* navigate */}
          <button
            onClick={() => { setDestination(venue); onClose(); }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.01] focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
          >
            <Navigation size={16} aria-hidden /> {t('navigateHere')}
          </button>
        </div>
      </div>
    </div>
  );
}
