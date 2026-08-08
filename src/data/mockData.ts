import type { LatLngExpression } from 'leaflet';

export type AccessMode = 'wheelchair' | 'low-vision' | 'elderly';
export type Lang = 'en' | 'hi';

export interface FeatureChecklist {
  ramp: boolean;
  elevator: boolean;
  restroom: boolean;
  doorwayWidthCm: number;
  parking: boolean;
  tactilePaving: boolean;
}

export interface AuditEntry {
  date: string;
  verifier: string;
  note: string;
}

export interface Venue {
  id: string;
  name: string;
  type: 'metro' | 'library' | 'restaurant' | 'hospital' | 'mall' | 'park';
  position: [number, number];
  district: string;
  accessScore: number; // 0-10
  features: FeatureChecklist;
  lastVerified: string;
  audits: AuditEntry[];
  confirms: number;
  flags: number;
}

export interface Barrier {
  id: string;
  label: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  position: [number, number];
  reportedBy: string;
  reportedAt: string;
  photoSample?: string;
}

export interface District {
  name: string;
  coverage: number;
  totalVenues: number;
  accessibleVenues: number;
}

export interface TrendPoint {
  week: string;
  coverage: number;
}

export interface RouteOption {
  id: 'step-free' | 'fastest';
  label: string;
  color: string;
  dashArray?: string;
  distanceKm: number;
  etaMin: number;
  steps: { instruction: string; distance: string }[];
  path: LatLngExpression[];
  hasStairs: boolean;
}

export const ORIGIN: [number, number] = [28.613, 77.209];

export const VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Central Metro Station',
    type: 'metro',
    position: [28.6145, 77.2085],
    district: 'Central',
    accessScore: 8.4,
    features: { ramp: true, elevator: true, restroom: true, doorwayWidthCm: 95, parking: true, tactilePaving: true },
    lastVerified: '2 days ago',
    audits: [
      { date: '2 days ago', verifier: 'Ramya K.', note: 'Elevator confirmed operational, both cars.' },
      { date: '1 week ago', verifier: 'Arjun M.', note: 'Tactile paving intact on platform 2.' },
    ],
    confirms: 42,
    flags: 3,
  },
  {
    id: 'v2',
    name: 'City Public Library',
    type: 'library',
    position: [28.6162, 77.211],
    district: 'Central',
    accessScore: 7.8,
    features: { ramp: true, elevator: false, restroom: true, doorwayWidthCm: 82, parking: false, tactilePaving: true },
    lastVerified: '5 days ago',
    audits: [
      { date: '5 days ago', verifier: 'Priya S.', note: 'Ramp gradient slightly steep but passable.' },
    ],
    confirms: 28,
    flags: 2,
  },
  {
    id: 'v3',
    name: 'Green Leaf Restaurant',
    type: 'restaurant',
    position: [28.612, 77.214],
    district: 'Riverside',
    accessScore: 6.2,
    features: { ramp: true, elevator: false, restroom: false, doorwayWidthCm: 78, parking: true, tactilePaving: false },
    lastVerified: '3 weeks ago',
    audits: [{ date: '3 weeks ago', verifier: 'Vikram R.', note: 'No accessible restroom. Step at back entrance.' }],
    confirms: 11,
    flags: 4,
  },
  {
    id: 'v4',
    name: 'Sunrise General Hospital',
    type: 'hospital',
    position: [28.618, 77.206],
    district: 'Central',
    accessScore: 9.1,
    features: { ramp: true, elevator: true, restroom: true, doorwayWidthCm: 100, parking: true, tactilePaving: true },
    lastVerified: '1 day ago',
    audits: [
      { date: '1 day ago', verifier: 'Meena D.', note: 'All entrances step-free. 4 accessible parking bays.' },
      { date: '2 weeks ago', verifier: 'Sanjay T.', note: 'Elevator voice announcements working.' },
    ],
    confirms: 67,
    flags: 1,
  },
  {
    id: 'v5',
    name: 'Riverside Mall',
    type: 'mall',
    position: [28.6095, 77.2165],
    district: 'Riverside',
    accessScore: 7.5,
    features: { ramp: true, elevator: true, restroom: true, doorwayWidthCm: 88, parking: true, tactilePaving: false },
    lastVerified: '4 days ago',
    audits: [{ date: '4 days ago', verifier: 'Neha P.', note: 'Elevator on north wing out of service — flagged.' }],
    confirms: 35,
    flags: 5,
  },
  {
    id: 'v6',
    name: 'North Gate Metro',
    type: 'metro',
    position: [28.621, 77.205],
    district: 'Northgate',
    accessScore: 8.0,
    features: { ramp: true, elevator: true, restroom: true, doorwayWidthCm: 92, parking: false, tactilePaving: true },
    lastVerified: '6 days ago',
    audits: [{ date: '6 days ago', verifier: 'Aditi G.', note: 'Ramp at exit B repaired last month.' }],
    confirms: 31,
    flags: 2,
  },
  {
    id: 'v7',
    name: 'Lotus Park',
    type: 'park',
    position: [28.611, 77.202],
    district: 'Central',
    accessScore: 6.8,
    features: { ramp: true, elevator: false, restroom: true, doorwayWidthCm: 90, parking: true, tactilePaving: false },
    lastVerified: '2 weeks ago',
    audits: [{ date: '2 weeks ago', verifier: 'Karan B.', note: 'Paved paths mostly level, one uneven section near gate 3.' }],
    confirms: 19,
    flags: 3,
  },
  {
    id: 'v8',
    name: 'Spice Garden Restaurant',
    type: 'restaurant',
    position: [28.6195, 77.2125],
    district: 'Northgate',
    accessScore: 5.5,
    features: { ramp: false, elevator: false, restroom: false, doorwayWidthCm: 70, parking: false, tactilePaving: false },
    lastVerified: '1 month ago',
    audits: [{ date: '1 month ago', verifier: 'Rhea L.', note: 'Two steps at entrance, no ramp. Needs review.' }],
    confirms: 8,
    flags: 6,
  },
  {
    id: 'v9',
    name: 'Heritage Civic Hall',
    type: 'mall',
    position: [28.6158, 77.2048],
    district: 'Central',
    accessScore: 7.2,
    features: { ramp: true, elevator: true, restroom: false, doorwayWidthCm: 85, parking: true, tactilePaving: true },
    lastVerified: '10 days ago',
    audits: [{ date: '10 days ago', verifier: 'Imran Q.', note: 'Ramp added last quarter. Restroom not yet accessible.' }],
    confirms: 24,
    flags: 2,
  },
  {
    id: 'v10',
    name: 'Southbank Community Center',
    type: 'library',
    position: [28.608, 77.213],
    district: 'Riverside',
    accessScore: 8.7,
    features: { ramp: true, elevator: true, restroom: true, doorwayWidthCm: 96, parking: true, tactilePaving: true },
    lastVerified: '3 days ago',
    audits: [{ date: '3 days ago', verifier: 'Sara W.', note: 'Excellent facilities. Fully step-free throughout.' }],
    confirms: 51,
    flags: 0,
  },
];

export const SEED_BARRIERS: Barrier[] = [
  {
    id: 'b1',
    label: 'Broken concrete ramp at Central Metro exit B',
    type: 'Broken ramp',
    severity: 'High',
    confidence: 91,
    position: [28.6142, 77.2092],
    reportedBy: 'Aditi G.',
    reportedAt: '12 min ago',
    photoSample: 'Broken concrete ramp',
  },
];

export const DISTRICTS: District[] = [
  { name: 'Central', coverage: 78, totalVenues: 4, accessibleVenues: 3 },
  { name: 'Riverside', coverage: 64, totalVenues: 3, accessibleVenues: 2 },
  { name: 'Northgate', coverage: 71, totalVenues: 2, accessibleVenues: 1 },
  { name: 'Old Town', coverage: 52, totalVenues: 5, accessibleVenues: 3 },
];

export const TREND: TrendPoint[] = [
  { week: 'W1', coverage: 48 },
  { week: 'W2', coverage: 51 },
  { week: 'W3', coverage: 53 },
  { week: 'W4', coverage: 58 },
  { week: 'W5', coverage: 61 },
  { week: 'W6', coverage: 65 },
  { week: 'W7', coverage: 69 },
  { week: 'W8', coverage: 73 },
];

export const COMMUNITY_FEED: string[] = [
  'Ramya just verified Central Metro elevator ✓',
  'New barrier reported on Elm Rd — broken curb cut',
  'Arjun confirmed Lotus Park ramp is passable',
  'Priya flagged North Gate elevator as unreliable',
  'Vikram verified Sunrise Hospital tactile paving',
  'Meena confirmed Southbank Center is fully step-free',
  'Sanjay reported Riverside Mall north elevator out of service',
  'Neha verified City Library ramp — slightly steep',
];

export interface DemoSample {
  label: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  type: string;
  description: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    label: 'Broken concrete ramp',
    severity: 'High',
    confidence: 94,
    type: 'Damaged ramp',
    description: 'Concrete surface cracked and lifted — uneven gradient exceeding 1:12. Wheelchair passage unsafe.',
  },
  {
    label: 'Blocked curb cut',
    severity: 'Medium',
    confidence: 87,
    type: 'Obstructed path',
    description: 'Construction debris blocking the curb cut at the crossing. Reduced width for wheelchair users.',
  },
  {
    label: 'Missing handrail',
    severity: 'Medium',
    confidence: 82,
    type: 'Missing aid',
    description: 'Staircase handrail removed. Risk for elderly and low-vision users on the descent.',
  },
  {
    label: 'Tactile paving worn',
    severity: 'Low',
    confidence: 76,
    type: 'Worn surface',
    description: 'Tactile warning surface smoothed by wear — reduced detectability for cane users.',
  },
];

export const BADGES = [
  { level: 1, name: 'Community Scout', minReports: 0 },
  { level: 2, name: 'Community Guardian', minReports: 10 },
  { level: 3, name: 'Accessibility Champion', minReports: 30 },
  { level: 4, name: 'Civic Hero', minReports: 60 },
];
