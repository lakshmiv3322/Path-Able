import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Circle } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp, ORIGIN } from '@/store/appStore';
import { venueIcon, barrierIcon, originIcon, venueColor } from './icons';
import type { Venue } from '@/data/mockData';
import { MapPin } from 'lucide-react';

/** Progressive route draw: animates the visible portion of the polyline. */
function AnimatedRoute({ positions, color, dashArray, drawKey }: {
  positions: LatLngExpression[];
  color: string;
  dashArray?: string;
  drawKey: string;
}) {
  const [progress, setProgress] = useState(0);
  const fullLen = positions.length;

  useEffect(() => {
    setProgress(0);
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drawKey]);

  const visible = useMemo(() => {
    if (progress >= 1) return positions;
    const segs = Math.max(2, Math.ceil(fullLen * progress));
    return positions.slice(0, segs);
  }, [progress, positions, fullLen]);

  return (
    <Polyline
      positions={visible}
      pathOptions={{
        color,
        weight: 6,
        opacity: 0.9,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round',
        className: dashArray ? 'route-polyline dash-flow' : 'route-polyline',
      }}
    />
  );
}

/** Heatmap layer — colored circles showing accessibility density. */
function HeatLayer() {
  const { venues, barriers } = useApp();
  const points = useMemo(() => {
    return venues.map((v) => ({ pos: v.position, color: venueColor(v.accessScore), radius: 300, score: v.accessScore }))
      .concat(barriers.map((b) => ({ pos: b.position, color: '#D64545', radius: 250, score: 3 })));
  }, [venues, barriers]);
  return (
    <>
      {points.map((p, i) => (
        <Circle
          key={i}
          center={p.pos as [number, number]}
          radius={p.radius}
          pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.18, weight: 0 }}
        />
      ))}
    </>
  );
}

function FitBounds({ dest }: { dest: Venue | null }) {
  const map = useMap();
  const { barriers } = useApp();
  useEffect(() => {
    const pts: [number, number][] = [ORIGIN];
    if (dest) pts.push(dest.position);
    barriers.forEach((b) => pts.push(b.position));
    if (pts.length > 1) {
      const b = L.latLngBounds(pts.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(b, { padding: [80, 80], maxZoom: 16 });
    } else {
      map.setView(ORIGIN, 15);
    }
  }, [dest, barriers, map]);
  return null;
}

export default function MapView() {
  const {
    venues, barriers, setSelectedVenue, destination, routes, stepFree,
    heatmapOn, compareOn,
  } = useApp();
  const [recentBarrierIds, setRecentBarrierIds] = useState<Set<string>>(new Set());
  const [tilesError, setTilesError] = useState(false);

  useEffect(() => {
    // mark newly added barriers as "recent" for pulse for 6s
    const ids = new Set(barriers.filter((b) => b.reportedAt === 'just now').map((b) => b.id));
    if (ids.size) {
      setRecentBarrierIds(ids);
      const timer = setTimeout(() => setRecentBarrierIds(new Set()), 6000);
      return () => clearTimeout(timer);
    }
  }, [barriers]);

  const activeRoute = stepFree ? routes.find((r) => r.id === 'step-free') : routes.find((r) => r.id === 'fastest');
  const drawKey = `${destination?.id}-${routes.length}-${stepFree}`;

  return (
    <MapContainer
      center={ORIGIN}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl
      aria-label="Accessible city map"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{ tileerror: () => setTilesError(true) }}
      />

      {tilesError && (
        <div className="leaflet-container !bg-muted">
          <div className="absolute inset-0 z-[500] flex items-center justify-center p-6 text-center">
            <div className="max-w-sm rounded-2xl bg-card/95 p-6 shadow-xl ring-1 ring-border">
              <MapPin size={28} className="mx-auto mb-2 text-primary" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Map tiles unavailable</p>
              <p className="mt-1 text-xs text-muted-foreground">The map couldn't load. Your routes and venue pins are still active — try refreshing the page.</p>
            </div>
          </div>
        </div>
      )}

      <Marker position={ORIGIN} icon={originIcon()} aria-label="Your location" />

      {venues.map((v) => (
        <Marker
          key={v.id}
          position={v.position}
          icon={venueIcon(v)}
          eventHandlers={{ click: () => setSelectedVenue(v) }}
          aria-label={`${v.name}, Access-Score ${v.accessScore}`}
        />
      ))}

      {barriers.map((b) => (
        <Marker
          key={b.id}
          position={b.position}
          icon={barrierIcon(b, recentBarrierIds.has(b.id))}
          aria-label={`Barrier: ${b.label}`}
        />
      ))}

      {destination && (
        <Marker position={destination.position} icon={venueIcon(destination)} aria-label={`Destination: ${destination.name}`} />
      )}

      {heatmapOn && <HeatLayer />}

      {routes.length > 0 && !compareOn && activeRoute && (
        <AnimatedRoute
          key={drawKey}
          positions={activeRoute.path}
          color={activeRoute.color}
          dashArray={activeRoute.dashArray}
          drawKey={drawKey}
        />
      )}

      {compareOn && routes.length > 0 && routes.map((r) => (
        <AnimatedRoute
          key={`cmp-${r.id}-${drawKey}`}
          positions={r.path}
          color={r.color}
          dashArray={r.dashArray}
          drawKey={`cmp-${r.id}-${drawKey}`}
        />
      ))}

      <FitBounds dest={destination} />
    </MapContainer>
  );
}
