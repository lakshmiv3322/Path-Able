import { divIcon, LatLngExpression } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { CheckCircle2, AlertTriangle, Building2, Utensils, Library, Hotel, TreePalm } from 'lucide-react';
import type { Venue, Barrier } from '@/data/mockData';

const venueColor = (score: number) =>
  score >= 8 ? '#1FA971' : score >= 6.5 ? '#F2A93B' : '#D64545';

function venueIconHTML(score: number, type: Venue['type'], pulse: boolean) {
  const color = venueColor(score);
  const Icon =
    type === 'hospital' ? Hotel : type === 'restaurant' ? Utensils :
    type === 'library' ? Library : type === 'park' ? TreePalm : Building2;
  const icon = renderToStaticMarkup(<Icon size={16} color="#fff" strokeWidth={2.5} />);
  return `
    <div style="position:relative;width:36px;height:36px;">
      ${pulse ? `<div class="pulse-ring" style="background:${color};"></div>` : ''}
      <div class="pin-pop" style="
        width:36px;height:36px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);
        background:${color};border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;">
        <div style="transform:rotate(45deg);display:flex;">${icon}</div>
      </div>
    </div>`;
}

export function venueIcon(v: Venue, pulse = false) {
  return divIcon({
    className: 'pathable-pin',
    html: venueIconHTML(v.accessScore, v.type, pulse),
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -34],
  });
}

function barrierIconHTML(pulse: boolean) {
  const icon = renderToStaticMarkup(<AlertTriangle size={16} color="#fff" strokeWidth={2.5} />);
  return `
    <div style="position:relative;width:34px;height:34px;">
      ${pulse ? `<div class="pulse-ring" style="background:#D64545;"></div>` : ''}
      <div class="pin-pop" style="
        width:34px;height:34px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);
        background:#D64545;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;">
        <div style="transform:rotate(45deg);display:flex;">${icon}</div>
      </div>
    </div>`;
}

export function barrierIcon(b: Barrier, pulse = false) {
  return divIcon({
    className: 'pathable-pin',
    html: barrierIconHTML(pulse),
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -32],
  });
}

function originIconHTML() {
  const icon = renderToStaticMarkup(<CheckCircle2 size={18} color="#fff" strokeWidth={2.5} />);
  return `
    <div style="
      width:34px;height:34px;border-radius:50%;background:#3D1766;
      border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;">${icon}</div>`;
}

export function originIcon() {
  return divIcon({
    className: 'pathable-pin',
    html: originIconHTML(),
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export function destinationIcon() {
  return divIcon({
    className: 'pathable-pin',
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#3D1766;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export { venueColor };
