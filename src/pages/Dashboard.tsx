import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, MapPin, TrendingUp, AlertTriangle, Building2, Route as RouteIcon,
  Activity, FileText, Printer, X,
} from 'lucide-react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '@/store/appStore';
import { DISTRICTS, TREND } from '@/data/mockData';
import { useCountUp } from '@/hooks/use-count-up';
import ContributorBadge from '@/components/ContributorBadge';
import { cn } from '@/lib/utils';

const districtColor = (c: number) => (c >= 75 ? '#1FA971' : c >= 60 ? '#F2A93B' : '#D64545');

function StatCard({ icon: Icon, label, value, suffix, color, live }: {
  icon: typeof MapPin; label: string; value: number; suffix?: string; color: string; live?: boolean;
}) {
  const display = useCountUp(value);
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}20`, color }}>
          <Icon size={18} />
        </span>
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live
          </span>
        )}
      </div>
      <div className="mt-2 font-display text-3xl font-bold count-up" style={{ color }}>
        {display}{suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function MunicipalReport({ onClose }: { onClose: () => void }) {
  const { barriers } = useApp();
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, []);

  useFocusTrap(true, dialogRef, {
    initialRef: closeRef,
    onEscape: onClose,
    returnRef: { current: triggerRef.current } as React.RefObject<HTMLElement>,
  });

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Municipal Accessibility Report">
      <div ref={dialogRef} className="print-report max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl thin-scroll animate-fade-in-up">
        <div className="flex items-start justify-between border-b-2 border-primary pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary">Municipal Accessibility Report</h2>
            <p className="text-sm text-muted-foreground">Unresolved barriers requiring civic action · {date}</p>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close report" className="rounded-lg p-1.5 hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"><X size={18} aria-hidden /></button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-danger/10 p-3"><div className="font-display text-2xl font-bold text-danger">{barriers.length}</div><div className="text-xs text-muted-foreground">Open barriers</div></div>
          <div className="rounded-xl bg-warning/10 p-3"><div className="font-display text-2xl font-bold text-warning">{barriers.filter(b => b.severity === 'High').length}</div><div className="text-xs text-muted-foreground">High severity</div></div>
          <div className="rounded-xl bg-primary/10 p-3"><div className="font-display text-2xl font-bold text-primary">{DISTRICTS.length}</div><div className="text-xs text-muted-foreground">Districts</div></div>
        </div>

        <h3 className="mt-6 font-display text-lg font-semibold">Barrier inventory</h3>
        <table className="mt-2 w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr><th className="py-2">Barrier</th><th>Type</th><th>Severity</th><th>Confidence</th><th>Reported</th></tr>
          </thead>
          <tbody>
            {barriers.map((b) => (
              <tr key={b.id} className="border-b border-border/60">
                <td className="py-2.5 font-medium">{b.label}</td>
                <td>{b.type}</td>
                <td><span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: districtColor(b.severity === 'High' ? 40 : b.severity === 'Medium' ? 60 : 80) }}>{b.severity}</span></td>
                <td>{b.confidence}%</td>
                <td className="text-muted-foreground">{b.reportedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Recommended action:</p>
          <p className="mt-1">Prioritize High-severity ramp and curb-cut barriers in the Central district. Estimated 3,200 daily step-free journeys affected.</p>
        </div>

        <button onClick={() => window.print()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary print:hidden">
          <Printer size={16} aria-hidden /> Print this report
        </button>
      </div>
    </div>
  );
}

export default function Dashboard({ onBack }: { onBack: () => void }) {
  const { t, venues, barriers, activeAlerts } = useApp();
  const [reportOpen, setReportOpen] = useState(false);

  const avgCoverage = Math.round(DISTRICTS.reduce((s, d) => s + d.coverage, 0) / DISTRICTS.length);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary">
            <ArrowLeft size={16} aria-hidden /> {t('navMap')}
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">PS-16 · Accessibility &amp; Inclusion</span>
          </div>
          <ContributorBadge compact />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-5">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={TrendingUp} label={t('stepFreeCoverage')} value={avgCoverage} suffix="%" color="#1FA971" live />
          <StatCard icon={Building2} label={t('totalVenues')} value={venues.length} color="#3D1766" />
          <StatCard icon={AlertTriangle} label={t('barriersReported')} value={barriers.length + 14} color="#D64545" />
          <StatCard icon={RouteIcon} label={t('activeRoutes')} value={activeAlerts * 8 + 42} color="#F2A93B" />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* trend chart */}
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Activity size={16} className="text-primary" aria-hidden />
              <h2 className="font-display text-base font-semibold">{t('coverageTrend')}</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="covGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1FA971" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1FA971" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                  <Area type="monotone" dataKey="coverage" stroke="#1FA971" strokeWidth={3} fill="url(#covGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* contributor */}
          <div className="space-y-5">
            <ContributorBadge />
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <h2 className="mb-3 font-display text-base font-semibold">{t('municipalReport')}</h2>
              <p className="text-xs text-muted-foreground">{t('reportSummary')}</p>
              <button
                onClick={() => setReportOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
              >
                <FileText size={15} aria-hidden /> {t('exportReport')}
              </button>
            </div>
          </div>
        </div>

        {/* districts */}
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="mb-3 font-display text-base font-semibold">{t('coverageByDistrict')}</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICTS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Bar dataKey="coverage" radius={[8, 8, 0, 0]}>
                  {DISTRICTS.map((d, i) => (
                    <Cell key={i} fill={districtColor(d.coverage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* live feed */}
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            {t('liveFeed')}
          </h2>
          <LiveFeedList />
        </div>
      </main>

      {reportOpen && <MunicipalReport onClose={() => setReportOpen(false)} />}
    </div>
  );
}

function LiveFeedList() {
  const items = [
    'Ramya verified Central Metro elevator ✓',
    'New barrier on Elm Rd — broken curb cut',
    'Arjun confirmed Lotus Park ramp passable',
    'Priya flagged North Gate elevator',
    'Vikram verified Sunrise Hospital tactile paving',
    'Meena confirmed Southbank Center fully step-free',
    'Sanjay reported Riverside Mall elevator out',
    'Neha verified City Library ramp',
  ];
  return (
    <ul className="space-y-2">
      {items.map((m, i) => (
        <li key={i} className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm animate-fade-in-up', i % 2 ? 'bg-muted/30' : 'bg-muted/50')} style={{ animationDelay: `${i * 60}ms` }}>
          <MapPin size={13} className="text-primary shrink-0" aria-hidden />
          {m}
        </li>
      ))}
    </ul>
  );
}
