import { useEffect, useRef, useState } from 'react';
import { Accessibility, Eye, PersonStanding, Mic, MicOff, Search, CloudRain, Languages } from 'lucide-react';
import { useApp } from '@/store/appStore';
import type { AccessMode } from '@/data/mockData';
import { cn } from '@/lib/utils';

const modes: { id: AccessMode; icon: typeof Accessibility }[] = [
  { id: 'wheelchair', icon: Accessibility },
  { id: 'low-vision', icon: Eye },
  { id: 'elderly', icon: PersonStanding },
];

export default function TopBar() {
  const { t, lang, setLang, mode, setMode, venues, setDestination, setSelectedVenue } = useApp();
  const [query, setQuery] = useState('Central Metro Station');
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);
  const [voiceSupported] = useState(typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window));
  const recRef = useRef<any>(null);

  const results = query.trim()
    ? venues.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.district.toLowerCase().includes(query.toLowerCase()))
    : venues;

  function choose(name: string) {
    const v = venues.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (v) {
      setDestination(v);
      setSelectedVenue(v);
    }
    setQuery(v?.name ?? name);
    setOpen(false);
  }

  function toggleVoice() {
    setVoiceMsg(null);
    if (!voiceSupported) {
      setVoiceMsg(lang === 'hi' ? 'वॉइस सर्च समर्थित नहीं — कृपया टाइप करें' : 'Voice search not supported on this browser — please type instead');
      // mock fallback
      setListening(true);
      setTimeout(() => {
        setListening(false);
        setQuery('Central Metro Station');
        choose('Central Metro Station');
      }, 1400);
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      choose(text);
    };
    rec.onerror = (e: any) => {
      setListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setVoiceMsg(lang === 'hi' ? 'माइक अनुमति अस्वीकृत — कृपया टाइप करें' : 'Microphone permission denied — please type instead');
      }
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
  }

  useEffect(() => () => recRef.current?.stop(), []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-3 pt-3 sm:px-5 sm:pt-5">
      {/* weather advisory */}
      <div className="pointer-events-auto mb-2 flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1.5 text-xs font-medium text-warning-foreground ring-1 ring-warning/30 backdrop-blur w-fit animate-fade-in">
        <CloudRain size={14} className="text-warning shrink-0" />
        <span>{t('weatherAdvisory')}</span>
      </div>

      <div className="pointer-events-auto flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* brand */}
        <div className="hidden items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground shadow-lg sm:flex">
          <Accessibility size={20} aria-hidden />
          <span className="font-display text-lg font-semibold leading-none">{t('navHome')}</span>
        </div>

        {/* search */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 rounded-2xl bg-card/95 px-3 py-2.5 shadow-lg ring-1 ring-border backdrop-blur">
            <Search size={18} className="text-muted-foreground shrink-0" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 180)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={toggleVoice}
              aria-label={t('voiceSearch')}
              title={t('voiceSearch')}
              className={cn(
                'rounded-lg p-1.5 transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
                listening ? 'bg-danger text-danger-foreground animate-pulse' : 'hover:bg-accent text-primary'
              )}
            >
              {listening ? <MicOff size={18} aria-hidden /> : <Mic size={18} aria-hidden />}
            </button>
            {listening && (
              <span className="text-xs font-medium text-danger animate-fade-in" aria-live="polite">{t('listening')}</span>
            )}
            {voiceMsg && (
              <span className="text-xs font-medium text-danger animate-fade-in" role="alert">{voiceMsg}</span>
            )}
          </div>

          {open && query.trim() && (
            <ul
              id="search-results"
              role="listbox"
              className="absolute mt-2 w-full overflow-hidden rounded-2xl bg-card/98 py-1 shadow-xl ring-1 ring-border backdrop-blur animate-fade-in-up"
            >
              {results.length > 0 ? results.slice(0, 6).map((v) => (
                <li key={v.id}>
                  <button
                    role="option"
                    aria-selected="false"
                    onMouseDown={(e) => { e.preventDefault(); choose(v.name); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); choose(v.name); } }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
                  >
                    <span className="font-medium">{v.name}</span>
                    <span className="text-xs text-muted-foreground">{v.district} · {v.accessScore.toFixed(1)}</span>
                  </button>
                </li>
              )) : (
                <li className="px-3 py-3 text-sm text-muted-foreground">
                  {lang === 'hi'
                    ? 'कोई परिणाम नहीं — City Library या Central Metro आज़माएँ'
                    : 'No results — try City Library or Central Metro'}
                </li>
              )}
            </ul>
          )}
        </div>

        {/* view-as */}
        <div className="flex items-center gap-1 rounded-2xl bg-card/95 px-2 py-1.5 shadow-lg ring-1 ring-border backdrop-blur">
          <span className="px-1.5 text-xs font-semibold text-muted-foreground">{t('viewAs')}</span>
          {modes.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              aria-label={t(id)}
              title={t(id)}
              className={cn(
                'rounded-xl p-2 transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary',
                mode === id ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent text-primary'
              )}
            >
              <Icon size={18} aria-hidden />
            </button>
          ))}
        </div>

        {/* language */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 rounded-2xl bg-card/95 px-3 py-2.5 text-sm font-semibold text-primary shadow-lg ring-1 ring-border backdrop-blur transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary"
          aria-label={t('language')}
        >
          <Languages size={16} aria-hidden />
          {lang === 'en' ? 'EN' : 'हिं'}
        </button>

        {/* PS-16 pitch deck badge */}
        <span className="hidden rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary sm:inline-block">
          PS-16 · Accessibility &amp; Inclusion
        </span>
      </div>
    </div>
  );
}
