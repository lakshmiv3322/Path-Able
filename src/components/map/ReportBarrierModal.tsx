import { useEffect, useRef, useState } from 'react';
import { X, Camera, Sparkles, AlertTriangle, Check, Loader2, ScanLine } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { DEMO_SAMPLES, ORIGIN, type Barrier, type DemoSample } from '@/data/mockData';
import { playChime } from '@/lib/audio';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { toast } from 'sonner';

type Phase = 'select' | 'analyzing' | 'result';

const severityColor: Record<string, string> = {
  High: '#D64545',
  Medium: '#F2A93B',
  Low: '#1FA971',
};

export default function ReportBarrierModal() {
  const { t, reportOpen, setReportOpen, addBarrier, triggerReroute, destination, contributorReports } = useApp();
  const [phase, setPhase] = useState<Phase>('select');
  const [sample, setSample] = useState<DemoSample | null>(null);
  const [progress, setProgress] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // reset on open + capture trigger element for focus return
  useEffect(() => {
    if (reportOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setPhase('select');
      setSample(null);
      setProgress(0);
    }
  }, [reportOpen]);

  const handleClose = () => setReportOpen(false);

  useFocusTrap(reportOpen, dialogRef, {
    initialRef: closeRef,
    onEscape: () => { if (phase !== 'analyzing') handleClose(); },
    returnRef: { current: triggerRef.current } as React.RefObject<HTMLElement>,
  });

  function runAnalysis(s: DemoSample) {
    setSample(s);
    setPhase('analyzing');
    setProgress(0);
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    setTimeout(() => {
      setPhase('result');
      // commit barrier + signature moment
      const barrierPos: [number, number] = [
        ORIGIN[0] + 0.0015,
        ORIGIN[1] + 0.0012,
      ];
      const newBarrier: Barrier = {
        id: `b-${Date.now()}`,
        label: s.label,
        type: s.type,
        severity: s.severity,
        confidence: s.confidence,
        position: barrierPos,
        reportedBy: 'You',
        reportedAt: 'just now',
        photoSample: s.label,
      };
      addBarrier(newBarrier);
      triggerReroute(barrierPos);
      playChime('alert');
      const reroutedUsers = 10 + Math.floor(Math.random() * 8);
      toast.success(t('barrierReported', { n: reroutedUsers }), { duration: 4000 });
    }, 1500);
  }

  function finish() {
    setReportOpen(false);
  }

  if (!reportOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('reportBarrier')}
      onMouseDown={(e) => { if (e.target === e.currentTarget && phase === 'select') handleClose(); }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-t-3xl bg-card shadow-2xl animate-slide-up sm:rounded-3xl sm:animate-fade-in-up"
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-border sm:hidden" />

        {/* header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <AlertTriangle size={18} className="text-danger" aria-hidden /> {t('reportBarrier')}
          </h2>
          <button
            ref={closeRef}
            onClick={() => { if (phase === 'select') handleClose(); }}
            disabled={phase === 'analyzing'}
            aria-label={t('closeVenue')}
            className="rounded-lg p-1.5 hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary disabled:opacity-40"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="p-5">
          {phase === 'select' && (
            <div className="animate-fade-in">
              <div className="mb-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                <Camera size={32} className="mb-2 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">Upload a photo of the barrier, or pick a demo sample below</p>
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo samples</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => runAnalysis(s)}
                    className="group flex flex-col items-start gap-1 rounded-2xl bg-muted/40 p-3 text-left ring-1 ring-border transition-all hover:bg-accent hover:ring-primary/30"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-semibold">{s.label}</span>
                      <span className="h-2 w-2 rounded-full" aria-hidden style={{ background: severityColor[s.severity] }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.type}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      <Sparkles size={12} aria-hidden /> {t('runAnalysis')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'analyzing' && sample && (
            <div className="animate-fade-in py-6" aria-live="polite" role="status">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
                    <ScanLine size={36} className="text-primary animate-pulse" />
                  </div>
                  <Loader2 size={20} className="absolute -right-1 -top-1 animate-spin text-secondary" />
                </div>
                <p className="font-display text-lg font-semibold">{t('analyzing')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sample.label}</p>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-100"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex w-full justify-between text-[10px] text-muted-foreground">
                  <span>Detecting surface defects…</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {phase === 'result' && sample && (
            <div className="animate-fade-in-up" aria-live="polite" role="status">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: severityColor[sample.severity] }}>
                  <Check size={32} aria-hidden />
                </div>
                <p className="font-display text-xl font-semibold">{t('barrierConfirmed')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sample.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 text-center text-white" style={{ background: severityColor[sample.severity] }}>
                  <div className="text-xs opacity-90">{t('severity')}</div>
                  <div className="font-display text-2xl font-bold">{sample.severity}</div>
                </div>
                <div className="rounded-2xl bg-primary/10 p-4 text-center">
                  <div className="text-xs text-muted-foreground">{t('confidence')}</div>
                  <div className="font-display text-2xl font-bold text-primary">{sample.confidence}%</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-success/10 p-3 text-xs text-success">
                Map updated — route recalculated, {contributorReports + 1} nearby users notified.
              </div>

              <button
                onClick={finish}
                className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.01] focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
              >
                {t('reportAnother')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

