import { AlertTriangle, Layers, GitCompare, Plus, RotateCcw } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { cn } from '@/lib/utils';

export default function ControlPanel({ onReset }: { onReset?: () => void }) {
  const { t, activeAlerts, alertFlash, setReportOpen, heatmapOn, setHeatmapOn, compareOn, setCompareOn, resetDemo } = useApp();

  function handleReset() {
    resetDemo();
    onReset?.();
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] flex items-end justify-between gap-3 p-3 sm:p-5">
      {/* screen-reader announcement for alert count changes */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {t('activeAlerts')}: {activeAlerts}
      </div>
      {/* active alerts badge */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <div className={cn(
          'flex items-center gap-2 rounded-2xl bg-card/98 px-3 py-2 shadow-xl ring-1 ring-border backdrop-blur',
          alertFlash && 'animate-highlight-flash'
        )}>
          <div className="relative">
            <AlertTriangle size={18} className="text-danger" aria-hidden />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-danger">
              <span className="absolute inset-0 rounded-full bg-danger animate-pulse-ring" />
            </span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-danger count-up">{activeAlerts}</div>
            <div className="text-[10px] text-muted-foreground">{t('activeAlerts')}</div>
          </div>
        </div>

        {/* layer toggles */}
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => setHeatmapOn(!heatmapOn)}
            aria-pressed={heatmapOn}
            className={cn(
              'flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold shadow-lg ring-1 ring-border backdrop-blur transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
              heatmapOn ? 'bg-primary text-primary-foreground' : 'bg-card/95 text-primary hover:bg-accent'
            )}
          >
            <Layers size={14} aria-hidden /> {t('heatmap')}
          </button>
          <button
            onClick={() => setCompareOn(!compareOn)}
            aria-pressed={compareOn}
            className={cn(
              'flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold shadow-lg ring-1 ring-border backdrop-blur transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
              compareOn ? 'bg-primary text-primary-foreground' : 'bg-card/95 text-primary hover:bg-accent'
            )}
          >
            <GitCompare size={14} aria-hidden /> {t('compare')}
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset Demo"
            title="Reset Demo"
            className="flex items-center gap-1.5 rounded-2xl bg-card/95 px-3 py-2 text-xs font-semibold text-danger shadow-lg ring-1 ring-border backdrop-blur transition-all hover:bg-danger/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary lg:hidden"
          >
            <RotateCcw size={14} aria-hidden /> Reset
          </button>
        </div>
      </div>

      {/* report barrier FAB */}
      <button
        onClick={() => setReportOpen(true)}
        className="pointer-events-auto group flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-2xl transition-all hover:scale-[1.03] hover:bg-primary/90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
        aria-label={t('reportBarrier')}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/30 transition-transform group-hover:rotate-90" aria-hidden>
          <Plus size={16} />
        </span>
        <span className="hidden sm:inline">{t('reportBarrier')}</span>
      </button>
    </div>
  );
}
