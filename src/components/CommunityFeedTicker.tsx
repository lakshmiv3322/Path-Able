import { useEffect, useRef, useState } from 'react';
import { useApp, COMMUNITY_FEED } from '@/store/appStore';

/** Cycles a non-blocking aria-live toast through mock community activity every 7-10s. */
export default function CommunityFeedTicker() {
  const { t } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  const idxRef = useRef(Math.floor(Math.random() * COMMUNITY_FEED.length));

  useEffect(() => {
    let timer: number;
    const cycle = () => {
      const next = COMMUNITY_FEED[idxRef.current % COMMUNITY_FEED.length];
      idxRef.current++;
      setMsg(next);
      timer = window.setTimeout(() => {
        setMsg(null);
        timer = window.setTimeout(cycle, 1800 + Math.random() * 1500);
      }, 6000);
    };
    timer = window.setTimeout(cycle, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {msg ? `${t('liveFeed')}: ${msg}` : ''}
    </div>
  );
}
