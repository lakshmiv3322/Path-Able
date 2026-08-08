import { useEffect, useState } from 'react';
import { useApp } from '@/store/appStore';

const STORY = [
  { en: 'Meet Aditi.', hi: 'अदिति से मिलें।' },
  { en: 'She just arrived at Central Metro.', hi: 'वह अभी सेंट्रल मेट्रो पहुँची है।' },
  { en: 'The nearest ramp is broken.', hi: 'निकटतम रैंप टूटा हुआ है।' },
];

export default function StoryIntro({ onDone }: { onDone: () => void }) {
  const { lang } = useApp();
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (idx >= STORY.length) {
      setLeaving(true);
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 1700);
    return () => clearTimeout(t);
  }, [idx, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[3000] flex items-center justify-center bg-primary text-primary-foreground transition-opacity duration-700 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-live="polite"
      aria-label="PathAble story intro"
    >
      <div className="px-6 text-center">
        <div className="mb-6 flex items-center justify-center gap-2 opacity-80">
          <span className="font-display text-2xl font-semibold">PathAble</span>
        </div>
        <p
          key={idx}
          className={`font-display text-3xl font-medium leading-snug transition-all duration-500 sm:text-5xl ${idx < STORY.length ? 'animate-fade-in-up' : ''}`}
        >
          {idx < STORY.length ? STORY[idx][lang] : lang === 'hi' ? 'मार्ग खोज रहे हैं…' : 'Finding a way…'}
        </p>

        {/* progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STORY.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? 'w-8 bg-secondary' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>

        <button
          onClick={() => { setIdx(STORY.length); }}
          className="mt-10 text-xs font-medium text-white/60 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-white/80"
        >
          {lang === 'hi' ? 'छोड़ें' : 'Skip intro'}
        </button>
      </div>
    </div>
  );
}
