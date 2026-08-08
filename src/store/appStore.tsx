import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ORIGIN, SEED_BARRIERS, VENUES, COMMUNITY_FEED, type AccessMode, type Barrier, type Lang, type RouteOption, type Venue } from '@/data/mockData';
import { makeT } from '@/data/i18n';
import { LatLngExpression } from 'leaflet';

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;

  mode: AccessMode;
  setMode: (m: AccessMode) => void;

  stepFree: boolean;
  setStepFree: (v: boolean) => void;

  venues: Venue[];
  barriers: Barrier[];
  addBarrier: (b: Barrier) => void;

  selectedVenue: Venue | null;
  setSelectedVenue: (v: Venue | null) => void;

  destination: Venue | null;
  setDestination: (v: Venue | null) => void;

  routes: RouteOption[];
  rerouted: boolean;
  triggerReroute: (barrierPos: [number, number]) => void;

  activeAlerts: number;
  alertFlash: boolean;

  reportOpen: boolean;
  setReportOpen: (v: boolean) => void;

  contributorReports: number;
  confirmVenue: (id: string) => void;
  flagVenue: (id: string) => void;

  heatmapOn: boolean;
  setHeatmapOn: (v: boolean) => void;
  compareOn: boolean;
  setCompareOn: (v: boolean) => void;

  resetDemo: () => void;
}

const Ctx = createContext<AppState | null>(null);

// ---- Route helpers --------------------------------------------------

function makeStepFreePath(origin: [number, number], dest: [number, number], detour?: [number, number]): LatLngExpression[] {
  // a gentle curved step-free path, optionally detouring around a barrier
  const [oLat, oLng] = origin;
  const [dLat, dLng] = dest;
  if (detour) {
    const [bLat, bLng] = detour;
    // route goes around the barrier to the north
    const offset = 0.004;
    return [
      [oLat, oLng],
      [oLat + offset, oLng + offset],
      [(bLat + dLat) / 2 + offset, (bLng + dLng) / 2],
      [dLat + offset * 0.5, dLng],
      [dLat, dLng],
    ];
  }
  return [
    [oLat, oLng],
    [oLat + 0.003, oLng + 0.002],
    [(oLat + dLat) / 2, (oLng + dLng) / 2],
    [dLat - 0.002, dLng + 0.001],
    [dLat, dLng],
  ];
}

function makeFastestPath(origin: [number, number], dest: [number, number]): LatLngExpression[] {
  const [oLat, oLng] = origin;
  const [dLat, dLng] = dest;
  // straight-ish diagonal — passes near barrier
  return [
    [oLat, oLng],
    [oLat + (dLat - oLat) * 0.35, oLng + (dLng - oLng) * 0.35],
    [oLat + (dLat - oLat) * 0.7, oLng + (dLng - oLng) * 0.7],
    [dLat, dLng],
  ];
}

function buildRoutes(origin: [number, number], dest: Venue | null, barrierDetour?: [number, number]): RouteOption[] {
  if (!dest) return [];
  const stepFreePath = makeStepFreePath(origin, dest.position, barrierDetour);
  const fastestPath = makeFastestPath(origin, dest.position);
  const stepFreeDist = barrierDetour ? 2.1 : 1.8;
  return [
    {
      id: 'step-free',
      label: 'Step-free route',
      color: '#1FA971',
      distanceKm: stepFreeDist,
      etaMin: barrierDetour ? 16 : 13,
      hasStairs: false,
      path: stepFreePath,
      steps: [
        { instruction: 'Head north on step-free pavement', distance: '120 m' },
        { instruction: 'Take ramp up to Central Metro overpass', distance: '80 m' },
        { instruction: 'Continue via elevator to ground level', distance: '—' },
        { instruction: `Arrive at ${dest.name}`, distance: '' },
      ],
    },
    {
      id: 'fastest',
      label: 'Fastest route',
      color: '#D64545',
      dashArray: '8 8',
      distanceKm: 1.4,
      etaMin: 9,
      hasStairs: true,
      path: fastestPath,
      steps: [
        { instruction: 'Head north-east on Main St', distance: '200 m' },
        { instruction: 'Descend 14 steps at Elm Rd', distance: '—' },
        { instruction: 'Continue straight to destination', distance: '600 m' },
        { instruction: `Arrive at ${dest.name}`, distance: '' },
      ],
    },
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [mode, setMode] = useState<AccessMode>('wheelchair');
  const [stepFree, setStepFree] = useState(true);
  const [venues, setVenues] = useState<Venue[]>(VENUES);
  const [barriers, setBarriers] = useState<Barrier[]>(SEED_BARRIERS);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [destination, setDestination] = useState<Venue | null>(VENUES[0]);
  const [rerouted, setRerouted] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(SEED_BARRIERS.length);
  const [alertFlash, setAlertFlash] = useState(false);
  const [contributorReports, setContributorReports] = useState(12);
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [compareOn, setCompareOn] = useState(false);

  const barrierDetourRef = useRef<[number, number] | undefined>(undefined);
  const [routes, setRoutes] = useState<RouteOption[]>(() => buildRoutes(ORIGIN, VENUES[0]));

  const t = useMemo(() => makeT(lang), [lang]);

  // rebuild routes when destination or detour changes
  useEffect(() => {
    setRoutes(buildRoutes(ORIGIN, destination, barrierDetourRef.current));
  }, [destination]);

  const triggerReroute = useCallback((barrierPos: [number, number]) => {
    barrierDetourRef.current = barrierPos;
    setRerouted(true);
    setRoutes(buildRoutes(ORIGIN, destination, barrierPos));
    setActiveAlerts((n) => {
      const next = n + 1;
      setAlertFlash(true);
      setTimeout(() => setAlertFlash(false), 1600);
      return next;
    });
    setTimeout(() => setRerouted(false), 6000);
  }, [destination]);

  const addBarrier = useCallback((b: Barrier) => {
    setBarriers((prev) => [...prev, b]);
  }, []);

  const confirmVenue = useCallback((id: string) => {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, confirms: v.confirms + 1 } : v)));
    setContributorReports((n) => n + 1);
  }, []);

  const flagVenue = useCallback((id: string) => {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, flags: v.flags + 1 } : v)));
    setContributorReports((n) => n + 1);
  }, []);

  const resetDemo = useCallback(() => {
    barrierDetourRef.current = undefined;
    setVenues(VENUES.map((v) => ({ ...v })));
    setBarriers(SEED_BARRIERS.map((b) => ({ ...b })));
    setSelectedVenue(null);
    setDestination(VENUES[0]);
    setRerouted(false);
    setReportOpen(false);
    setActiveAlerts(SEED_BARRIERS.length);
    setAlertFlash(false);
    setContributorReports(12);
    setHeatmapOn(false);
    setCompareOn(false);
    setStepFree(true);
    setRoutes(buildRoutes(ORIGIN, VENUES[0]));
  }, []);

  // live community feed ticker handled in component; here just expose count
  const feedRef = useRef(0);

  const value: AppState = {
    lang, setLang, t,
    mode, setMode,
    stepFree, setStepFree,
    venues, barriers, addBarrier,
    selectedVenue, setSelectedVenue,
    destination, setDestination,
    routes, rerouted, triggerReroute,
    activeAlerts, alertFlash,
    reportOpen, setReportOpen,
    contributorReports, confirmVenue, flagVenue,
    heatmapOn, setHeatmapOn, compareOn, setCompareOn,
    resetDemo,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { COMMUNITY_FEED, ORIGIN };
