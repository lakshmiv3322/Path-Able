# PathAble — AI-Assisted Accessible Navigation Engine

> **Problem Statement 16:** A City Full of Barriers  
> **Domain:** Accessibility & Inclusion  
> **Team Name:** lakshmivenkat316  



## Overview

PathAble is a community-verified, AI-assisted navigation web application designed to route citizens around urban accessibility barriers instead of into them. Traditional mapping engines optimize primarily for speed, frequently leading wheelchair users, elderly citizens, and low-vision individuals toward unusable infrastructure like broken ramps, steep stairs, or out-of-service elevators. PathAble combines step-free routing, real-time AI barrier detection, and crowdsourced venue checklists to make urban transit predictable and inclusive.



## Key Features

* **Step-Free Navigation Engine:** Live route engine that toggles between standard/fastest paths and step-free alternatives, factoring in elevators, ramps, and paved walkways with live distance/ETA metrics.

* **AI Barrier Reporting & Live Rerouting:** Photo-driven reporting flow where barrier severity is classified to trigger immediate, live rerouting across active navigation sessions.

* **Granular Access-Score Directory:** Venue accessibility ratings scored across specific criteria (ramps, elevators, doorway widths, accessible restrooms, and parking) visualized via interactive radar charts.

* **Multi-Modal UI Adaptation ("View As"):** Dynamic UI layout, contrast, and font adjustments tailored specifically for Wheelchair, Low Vision, and Elderly users.

* **Assistive Voice & Bilingual Support:** Integrated Web Speech API for voice navigation search, Web Speech Synthesis for read-aloud route guidance, and full English / Hindi (EN/HI) translation support.

* **Civic Insights & Municipal Reporting:** Interactive dashboard tracking district-level step-free coverage trends with a single-tap Municipal Report Export tool for local authorities.



## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 18, TypeScript, Vite |
| **Styling & UI Components** | Tailwind CSS, ShadCN UI, Radix UI Primitives |
| **Mapping & Dataviz** | Leaflet, react-leaflet, OpenStreetMap tiles, Recharts |
| **Assistive APIs** | Web Speech API, Speech Synthesis API, Web Audio API |
| **State & Notifications** | Centralized Store, Sonner Toast Notifications |
| **Deployment** | Vercel (Static Client-Side SPA) |


## Local Development Setup
### Prerequisites

* **Node.js**: `v18.0.0` or higher
* **npm** or **bun**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/lakshmivenkat316/Path-Able.git](https://github.com/lakshmivenkat316/Path-Able.git)
   cd Path-Able/project
``
   ### Deployment : Vercel
   Access the website here : https://path-able-e9y0d1wz7-lakshmis-projects-bd6c9528.vercel.app/


## System Architecture & Workflow
