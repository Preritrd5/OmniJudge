# Ideathon 2026 — Submission & Evaluation Platform

A full-stack web application for running idea-pitching hackathons. Teams submit a PDF pitch; an AI panel scores it against a transparent 10-criterion rubric — every mark backed by evidence, every deduction explained.

---

## ✨ Features

### For Teams
- Browse registered teams and select yours in a single click
- Drag-and-drop (or click-to-browse) PDF upload — 15 MB max
- Instant success confirmation once the submission is queued for evaluation

### For Admins
- **Secure login** via Supabase email/password authentication
- **Dashboard** with live stats: total teams, submissions, evaluated count, top score
- **Leaderboard** with animated score bars — ranked in real time
- **Team management**: add teams, rename (autosave, 600ms debounce), delete with confirmation dialog
- **Submission viewer**: per-criterion scores (F1–F10, 0–10 each), evidence, strengths, weaknesses, risks, suggestions
- **JSON export**: download full dataset, a single team, or a single submission
- **PDF viewer**: open the original submission PDF directly from the modal

### Evaluation Engine
- Powered by Google Gemini via an OpenAI-compatible AI gateway
- Deterministic scoring (`temperature: 0`) — consistent, reproducible results
- Rubric bands: Outstanding (9–10), Strong (7–8), Average (5–6), Weak (3–4), Missing (0–2)
- Overall ratings: Excellent (85–100), Strong (70–84), Promising with gaps (61–69), Major gaps (41–60), Weak/incomplete (0–40)

### Design
- Dark glassmorphism UI on a `#08070f` background
- Animated 3-D chrome sphere (Three.js) in hero and team portal
- Radial dot grid, ambient glow blobs, scroll marquee ticker
- Space Grotesk + DM Sans typography
- Fully accessible: ARIA labels, progress bars, keyboard navigation, focus rings

---

## 🗂 Project Structure

```
src/
├── components/
│   └── ChromeScene.tsx          # Three.js animated 3-D chrome sphere
├── integrations/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client (lazy, singleton)
│       ├── client.server.ts     # Server Supabase admin client (service role)
│       ├── auth-middleware.ts   # TanStack Start auth middleware
│       └── types.ts             # Auto-generated DB types
├── lib/
│   ├── admin.functions.ts       # Server functions: teams CRUD, PDF URL
│   ├── ai-gateway.server.ts     # OpenAI-compatible AI gateway provider
│   ├── error-reporting.ts       # Generic error capture utility
│   ├── evaluation.server.ts     # PDF evaluation via Gemini AI
│   └── utils.ts                 # cn() helper
└── routes/
    ├── __root.tsx               # App shell, QueryClientProvider
    ├── index.tsx                # Landing page
    ├── auth.tsx                 # Admin login
    ├── team.tsx                 # Team submission portal
    ├── _authenticated/
    │   ├── route.tsx            # Auth guard layout
    │   └── admin.tsx            # Admin dashboard
    └── api/public/
        └── submit.ts            # POST /api/public/submit — PDF upload & eval
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

### 1. Clone & install

```bash
git clone <your-repo-url> ideathon-2026
cd ideathon-2026
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env` (or create `.env`) and fill in the values:

```env
# Supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<anon key>
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key>

# Required for admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# AI evaluation gateway (OpenAI-compatible)
OPENAI_API_KEY=<your api key>
# Optional override if using a custom gateway
# AI_GATEWAY_BASE_URL=https://your-gateway.example.com/v1
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Database Schema (Supabase)

The app uses two core tables:

### `teams`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Team display name (unique) |
| `created_at` | timestamptz | Creation timestamp |

### `submissions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `team_id` | uuid | FK → teams.id |
| `file_name` | text | Original PDF filename |
| `pdf_path` | text | Storage path in Supabase bucket |
| `status` | text | `pending` / `evaluating` / `done` / `error` |
| `score` | int4 | Total score (0–100) |
| `result` | jsonb | Full AI evaluation JSON |
| `error` | text | Error message if failed |
| `created_at` | timestamptz | Submission timestamp |

---

## 📋 Evaluation Rubric

10 criteria × 10 marks each = **100 marks total**

| ID | Criterion | Description |
|----|-----------|-------------|
| F1 | Innovation & Creativity | Novelty of idea & creative problem-solving |
| F2 | Technical Feasibility | Complexity, feasibility, and scalability |
| F3 | User Experience & Design | UI/UX, accessibility, and inclusivity |
| F4 | Impact & Usefulness | Problem-solution fit, potential impact, and multiple use cases |
| F5 | Technical Execution | Prototype, code quality, and technology stack |
| F6 | Sustainability & Future Scope | Long-term viability & eco-friendly practices |
| F7 | Presentation & Communication | Clarity, pitch effectiveness, and Q&A handling |
| F8 | Collaboration & Teamwork | Team dynamics & problem-solving approach |
| F9 | Business Viability (if applicable) | Market potential, revenue model, and affordability |
| F10 | Security & Privacy | Data protection & compliance with privacy regulations |

---

## 🔗 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — overview, rubric, team / admin portals |
| `/team` | Team portal — select team, upload PDF |
| `/auth` | Admin login |
| `/admin` | Admin dashboard (requires auth) |
| `POST /api/public/submit` | File upload & evaluation API |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR, file-based routing) |
| UI | React 19 + Tailwind CSS v4 |
| 3-D | Three.js |
| Database | Supabase (PostgreSQL + Storage) |
| Auth | Supabase Auth |
| AI | Google Gemini via OpenAI-compatible gateway |
| State | TanStack Query |
| Forms | react-hook-form + Zod |
| Build | Vite 8 |

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier formatter |

---

## 🔑 Creating the First Admin

Run the helper script after seeding your Supabase project:

```bash
node scripts-mkadmin.mjs
```

Follow the prompts to create an admin user in Supabase Auth.

---

## 📄 License

MIT — see `LICENSE` for details.
