import { useEffect, useRef } from 'react';
import { Footprints, AlertTriangle, Volume2, Route as RouteIcon, Sparkles } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { speak, stopSpeak, playChime } from '@/lib/audio';
import { cn } from '@/lib/utils';

export default function RouteInfoCard() {
  const { t, routes, stepFree, setStepFree, rerouted, destination } = useApp();
  const active = stepFree ? routes.find((r) => r.id === 'step-free') : routes.find((r) => r.id === 'fastest');
  const spokeRef = useRef(false);

  // chime when a step-free route first appears
  useEffect(() => {
    if (stepFree && routes.length > 0 && !spokeRef.current) {
      playChime('success');
      spokeRef.current = true;
    }
  }, [stepFree, routes.length]);

  if (!destination || !active) return null;

  function readAloud() {
    if (!active) return;
    const text = `${t('routeStepFree')}. ${active.distanceKm} kilometers, ${active.etaMin} minutes. ` +
      active.steps.map((s, i) => `Step ${i + 1}: ${s.instruction}.${s.distance ? ' ' + s.distance : ''}`).join('. ');
    speak(text);
  }

  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-card/98 p-4 shadow-2xl ring-1 ring-border backdrop-blur animate-fade-in-up">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RouteIcon size={16} className="text-primary" aria-hidden />
          <span className="text-sm font-semibold">{destination.name}</span>
        </div>
        <button
          onClick={readAloud}
          className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-xs font-medium text-primary hover:bg-accent/80 focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
          aria-label={t('readRouteAloud')}
        >
          <Volume2 size={13} aria-hidden /> {t('readRouteAloud')}
        </button>
      </div>

      {/* toggle */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={() => setStepFree(true)}
          className={cn('flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
            stepFree ? 'bg-success text-success-foreground shadow' : 'bg-muted text-muted-foreground hover:bg-accent')}
          aria-pressed={stepFree}
        >
          <Footprints size={14} className="mr-1 inline" aria-hidden /> {t('routeStepFree')}
        </button>
        <button
          onClick={() => setStepFree(false)}
          className={cn('flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
            !stepFree ? 'bg-danger text-danger-foreground shadow' : 'bg-muted text-muted-foreground hover:bg-accent')}
          aria-pressed={!stepFree}
        >
          <AlertTriangle size={14} className="mr-1 inline" aria-hidden /> {t('routeFastest')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-success/10 p-3">
          <div className="text-2xl font-display font-bold text-success count-up">{active.etaMin}</div>
          <div className="text-xs text-muted-foreground">min ETA</div>
        </div>
        <div className="rounded-xl bg-primary/10 p-3">
          <div className="text-2xl font-display font-bold text-primary count-up">{active.distanceKm}</div>
          <div className="text-xs text-muted-foreground">km</div>
        </div>
      </div>

      {stepFree ? (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-success">
          <Sparkles size={13} aria-hidden /> {t('routeFound')}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-danger">
          <AlertTriangle size={13} aria-hidden /> {t('hasStairs')} · {t('routeFastest')}
        </div>
      )}

      {rerouted && (
        <div
          className="mt-3 rounded-lg bg-warning/20 px-3 py-2 text-xs font-semibold text-warning-foreground animate-highlight-flash"
          role="status"
        >
          {t('rerouted')}
        </div>
      )}

      {/* steps */}
      <ol className="mt-3 space-y-1.5 border-t border-border pt-3">
        {active.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
            <span className="text-foreground">{s.instruction}{s.distance && <span className="text-muted-foreground"> · {s.distance}</span>}</span>
          </li>
        ))}
      </ol>

      {/* hidden stop button for screen readers */}
      <button onClick={stopSpeak} className="sr-only" aria-label="Stop reading">Stop</button>
    </div>
  );
}
