PathAble — AI-Assisted Accessible Navigation Engine
Problem Statement 16: A City Full of Barriers
Domain: Accessibility & Inclusion
Team Name: lakshmivenkat316
PathAble is a community-verified, AI-assisted navigation web application designed to route citizens around urban accessibility barriers instead of into them. Traditional mapping engines optimize primarily for speed, frequently leading wheelchair users, elderly citizens, and low-vision individuals toward unusable infrastructure like broken ramps, steep stairs, or out-of-service elevators. PathAble combines step-free routing, real-time AI barrier detection, and crowdsourced venue checklists to make urban transit predictable and inclusive.
Key Features :
Step-Free Navigation Engine: Live route engine that toggles between standard/fastest paths and step-free alternatives, factoring in elevators, ramps, and paved walkways with live distance/ETA metrics.  
AI Barrier Reporting & Live Rerouting: Photo-driven reporting flow where barrier severity is classified to trigger immediate, live rerouting across active navigation sessions. 
Granular Access-Score Directory: Venue accessibility ratings scored across specific criteria (ramps, elevators, doorway widths, accessible restrooms, and parking) visualized via interactive radar charts. 
Multi-Modal UI Adaptation ("View As"): Dynamic UI layout, contrast, and font adjustments tailored specifically for Wheelchair, Low Vision, and Elderly users. 
Assistive Voice & Bilingual Support: Integrated Web Speech API for voice navigation search, Web Speech Synthesis for read-aloud route guidance, and full English / Hindi (EN/HI) translation support. 
Civic Insights & Municipal Reporting: Interactive dashboard tracking district-level step-free coverage trends with a single-tap Municipal Report Export tool for local authorities.  
Tech StackCategory : 
TechnologyCore - FrameworkReact 18, TypeScript, Vite  Styling & UI ComponentsTailwind CSS, ShadCN UI, Radix UI Primitives  Mapping & DatavizLeaflet, react-leaflet, OpenStreetMap tiles, Recharts  Assistive APIsWeb Speech API, Speech Synthesis API, Web Audio API  State & NotificationsZustand / Custom State Store, Sonner Toast Notifications  
Deployment : Vercel (Static Client-Side SPA)  System Architecture & Workflow[ User Input / Client Browser ]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│               Vite / React Frontend (TSX)               │
│                                                        │
│  ├── Navigation Views (MapPage, Dashboard)              │
│  ├── State Store (@/store/appStore)                     │
│  └── Accessibility Engine (Audio, Speech, i18n)         │
└────────────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────────────┐
│                Local State & Data Engine               │
│                                                        │
│  ├── Seeded Venue & Barrier Pipeline (@/data/mockData) │
│  └── Live Route Recalculator Logic                      │
└────────────────────────────────────────────────────────┘

Access the web app : https://path-able-e9y0d1wz7-lakshmis-projects-bd6c9528.vercel.app/
