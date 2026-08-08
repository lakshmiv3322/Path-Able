import { Award } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { BADGES } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function ContributorBadge({ compact = false }: { compact?: boolean }) {
  const { t, contributorReports } = useApp();
  const current = [...BADGES].reverse().find((b) => contributorReports >= b.minReports) ?? BADGES[0];
  const next = BADGES.find((b) => b.minReports > contributorReports);
  const level = current.level;
  const progress = next
    ? Math.min(100, Math.round(((contributorReports - current.minReports) / (next.minReports - current.minReports)) * 100))
    : 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
        <span className={cn('flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground')}>
          <Award size={14} aria-hidden />
        </span>
        <div className="leading-tight">
          <div className="text-xs font-bold text-primary">{current.name}</div>
          <div className="text-[9px] text-muted-foreground">{t('contributingLevel', { n: level })} · {contributorReports} pts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/25">
          <Award size={22} aria-hidden />
        </span>
        <div>
          <div className="font-display text-base font-semibold">{current.name}</div>
          <div className="text-xs opacity-80">{t('contributingLevel', { n: level })} · {contributorReports} contributions</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[10px] opacity-80">
          <span>{t('progressToNext')}</span>
          <span>{next ? `${contributorReports}/${next.minReports}` : 'MAX'}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-secondary transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
