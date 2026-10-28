# Ocean Explorer — Discover the Blue

**Ocean Explorer** is an interactive ocean and marine-life exploration web application built for an end-term software engineering project. It combines an immersive, responsive deep-ocean design with rigorous scientific domain modeling, JWT authentication with HTTP-only cookies, MongoDB Atlas persistence, and an empirical deep-sea speculative creature prediction engine.

---

## 1. Problem Statement & Proposed Solution

### Problem Statement
Ocean ecosystems cover 71% of the Earth's surface and harbor some of the most specialized adaptations known to science, yet deep-sea biological processes remain largely abstract and inaccessible to students and science enthusiasts. Most existing tools are either static encyclopedias or superficial wrappers around generic AI APIs that hallucinate ungrounded biological claims.

### Proposed Solution
Ocean Explorer solves this problem by delivering:
1. **Empirical Marine Catalog**: Verified real species profiles cross-referenced against NOAA, MBARI, and IUCN scientific databases with biological adaptations and citations.
2. **The Unknown — Speculative Creature Engine**: A deterministic biological synthesis model that simulates how real environmental variables (hydrostatic pressure, temperature, light, oxygen, trophic food webs) shape morphological and metabolic adaptations.
3. **Personalized Expedition Journal**: User authentication with secure password hashing and session tokens, allowing explorers to save favorites, record discoveries, and catalog hypothetical specimens.
4. **Resilient Architecture**: Dual-mode operation with live MongoDB Atlas synchronization when connected, alongside automatic guest in-memory and browser localStorage fallback when offline.

---

## 2. Target Users

- **Marine Biology Students & Educators**: Exploring real ocean depth zones, pressure gradients, and physiological adaptations.
- **Science Enthusiasts & Curious Learners**: Engaging with interactive knowledge quizzes and speculative biology simulations.
- **Researchers & Project Evaluators**: Reviewing full-stack web engineering standards, security hygiene, and responsive UI design.

---

## 3. Major Workflows & Features

### Workflow A — Explore Real Marine Species
- **Curated Catalogue**: Browse 12 scientifically verified marine species spanning sunlight, twilight, and midnight zones.
- **Dynamic Search & Filtering**: Instant full-text search across common names, taxonomic binomens, habitats, and ecological descriptions, combined with zone and creature type dropdown filters.
- **Rich Scientific Dossiers**: Comprehensive modal detailing biological adaptations, diet, IUCN conservation status, hydrostatic depth boundaries, and primary literature citations with external links.
- **Exploration Markers**: Mark species as "Discovered" to increment your expedition progress meter.

### Workflow B — Authentication & Personal Field Journal
- **Sign Up & Registration**: Register with name, email, password strength meter, and confirmation with client- and server-side validation. Passwords hashed using `bcrypt` (work factor 12).
- **Secure Sign In & Sign Out**: Authenticate against MongoDB Atlas. Issues a signed, secure, HTTP-only SameSite JWT cookie (`ocean_token`). Credentials are never placed in `localStorage`.
- **Guest Explorer Mode**: Unauthenticated visitors can browse all educational content and store local journal entries without being forced to create an account.
- **Account-Aware Persistence**: When signed in, personal favorites, documented discoveries, and hypothetical dossiers sync directly to the user's account in MongoDB Atlas.

### Workflow C — The Unknown: Deep Sea Creature Predictor
- **Environmental Input Modeling**: Configure depth (0–11,000 m), ocean habitat preset (Abyssal Plain, Hydrothermal Vent, Hadal Trench, Whale Fall, etc.), ambient temperature (-2°C to 120°C), light level, dissolved oxygen, and food availability.
- **Hydrostatic Physics**: Accurately computes hydrostatic gauge and absolute pressure using seawater density $\rho = 1025\text{ kg/m}^3$ and gravity $g = 9.80665\text{ m/s}^2$ ($P \approx 1.005\text{ bar per }10\text{ m}$).
- **Trait Determination Matrix**: Synthesizes fictional binomial names, metabolic strategies, bioluminescence plausibility, barophilic cell membranes, and piezolyte synthesis (e.g., trimethylamine N-oxide / TMAO).
- **Transparency & Disclaimers**: Explicitly stamped with *"Hypothetical creature — scientifically-inspired speculative concept, not an officially recognized species."*
- **Specimen Archiving**: Save, inspect, and delete predicted specimen dossiers from your logbook.

### Workflow D — Discovery Log & Learning
- **Three-Column Field Journal**: View saved real species, completed discoveries, and hypothetical dossiers in separate organized sections.
- **Interactive Knowledge Check**: 5-question ocean quiz with progress tracking, immediate scientific explanation feedback, and personal best score tracking.

### Workflow E — Data Reliability & Resilient Fallback
- **Live Status Telemetry**: Topbar status dot visibly indicates whether MongoDB Atlas synchronization is active or running on local browser cache.
- **Honest Error Handling**: If MongoDB Atlas is unavailable, authentication displays honest guidance, and the app continues operating smoothly in guest mode without discarding local data.

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 6, TypeScript Compiler (`tsc`)
- **Styling**: Vanilla CSS (CSS variables, glassmorphism, responsive grid/flexbox, custom animations, zero bulky frameworks)
- **State & Storage**: React Hooks (`useState`, `useMemo`, `useEffect`, `useCallback`) + `localStorage` fallback

### Backend
- **Runtime & Server**: Node.js (v18+ LTS, tested on v24) with Express 4 and TypeScript
- **Database**: MongoDB Atlas via Mongoose 9 ODM
- **Authentication**: `bcryptjs` for salted password hashing, `jsonwebtoken` (JWT) with HTTP-only cookies, `cookie-parser`
- **Security & Quality**: Rate limiters (general API + strict auth rate limiting), CORS credentials enforcement, payload size caps (`100kb`), strict input normalization
- **Testing**: Node.js built-in test runner (`node:test`) executed via `tsx`

---

## 5. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│               Ocean Explorer Web Client                │
│             (React 18 + TypeScript + Vite)             │
└──────────────┬──────────────────────────▲──────────────┘
               │ HTTP / JSON API Calls    │ HTTP-only JWT Cookie
               │ credentials: 'include'   │ (SameSite / Secure)
┌──────────────▼──────────────────────────┴──────────────┐
│             Ocean Explorer Express Server              │
│       CORS Origin Check & Cookie Parser Middleware     │
│             Auth Rate Limiter & JWT Verification       │
├────────────────────────────────────────────────────────┤
│ API Endpoints:                                         │
│ • /api/health           • /api/auth/register           │
│ • /api/species          • /api/auth/login              │
│ • /api/environments     • /api/auth/logout             │
│ • /api/predict          • /api/auth/me                 │
│ • /api/discoveries      • /api/me/favorites            │
└──────────────┬──────────────────────────▲──────────────┘
               │ Mongoose ODM Operations  │
               │ (with DNS SRV Fallback)  │
┌──────────────▼──────────────────────────┴──────────────┐
│                  MongoDB Atlas Cluster                 │
│  Collections:                                          │
│  • users (hashed passwords, favorite species slugs)    │
│  • species (curated catalogue with indexes & citations)│
│  • predictions (speculative biological dossiers)       │
│  • discoveries (user-scoped field log entries)         │
└────────────────────────────────────────────────────────┘
```

---

## 6. Prerequisites

- **Node.js**: v18.0.0 or later (Node 20+ LTS recommended)
- **npm**: v9.0.0 or later
- **MongoDB Atlas Account** (Optional for local guest evaluation; required for remote account persistence)

---

## 7. Step-by-Step Local Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/ocean-explorer.git
cd ocean-explorer

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables Configuration

Copy the example environment files into active `.env` files:

#### Frontend (`.env` in repository root):
```bash
# Optional in development; Vite proxy forwards /api to localhost:3001
VITE_API_URL=
```

#### Backend (`server/.env`):
```bash
# Copy template
cp server/.env.example server/.env   # On Windows: copy server\.env.example server\.env
```

Configure `server/.env` with your settings:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.1zhrsw6.mongodb.net/ocean-explorer?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
IMAGE_PROVIDER=none
```

> **Note on Windows DNS SRV Resolution**: Node.js default DNS resolver on some Windows network adapters can fail SRV lookups with `querySrv ECONNREFUSED`. The backend automatically configures reliable public DNS resolvers (`8.8.8.8`, `1.1.1.1`) so connection to MongoDB Atlas succeeds seamlessly.

### 3. Seed Documented Marine Species

Ensure `server/.env` has a valid `MONGODB_URI`, then run the idempotent seed script:

```bash
cd server
npm run seed
```
*Output: Seeds 12 verified species into Atlas. Running it repeatedly produces 0 duplicates (`upsert: true`).*

### 4. Run the Application

You can start both servers simultaneously or separately:

**Option A — Run Both (Recommended):**
```bash
# From repository root
npm run dev:all
```

**Option B — Run Separately:**
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/api/health`

---

## 8. Running Tests & Production Builds

### Run Backend Unit Tests (11 Tests)
```bash
cd server
npm test
```
All 11 tests execute against the built-in Node.js test runner covering:
1. `bcrypt` password salted hashing and validation
2. JWT generation and decoding roundtrip
3. Expired/tampered token rejection
4. Server input validation rules (names, emails, passwords)
5. Hydrostatic pressure calculation (gauge vs. absolute)
6. Environmental bounds validation
7. Hydrothermal vent mixing zone thermal allowances
8. Snailfish adaptations under hadal pressure (TMAO synthesis)
9. Counterillumination adaptation in the twilight zone
10. Deterministic PRNG seed reproducibility
11. Documented species data integrity & IUCN/NOAA citations

### Run Production Builds
```bash
# Build Frontend (TypeScript check + Vite production bundle)
npm run build

# Build Backend (TypeScript compiler)
cd server
npm run build
```

---

## 9. API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Reports server uptime, DB connection status, and entity counts |
| `POST` | `/api/auth/register` | Public (Rate Limited) | Creates account with salted password, returns HTTP-only JWT cookie |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Verifies credentials with constant-time response, sets JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clears the `ocean_token` cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieves current authenticated explorer profile |
| `GET` | `/api/species` | Public | Catalogue with filtering by `habitat`, `type`, `search`, and pagination |
| `GET` | `/api/species/:id` | Public | Species details by MongoDB ObjectId or URL slug |
| `GET` | `/api/environments` | Public | Returns presets for all 6 oceanic zones and benthic habitats |
| `POST` | `/api/predict` | Optional Auth | Synthesizes hypothetical creature profile from environmental inputs |
| `GET` | `/api/predictions/:id`| Public | Retrieves saved hypothetical creature dossier |
| `GET` | `/api/discoveries` | Optional Auth | Lists saved field journal discoveries (scoped to user when signed in) |
| `POST` | `/api/discoveries` | Optional Auth | Saves a discovery record to user's journal or public log |
| `DELETE`| `/api/discoveries/:id`| Optional Auth | Deletes a discovery record |
| `GET` | `/api/me/favorites` | Authenticated | Retrieves user's favorite species list |
| `POST` | `/api/me/favorites` | Authenticated | Adds or removes a species from user favorites |

---

## 10. Demonstration Script (3–5 Minutes)

When presenting Ocean Explorer for project evaluation, follow this structure:

1. **Introduction & Problem (30s)**
   - Explain why deep-sea biology is difficult to visualize and how Ocean Explorer bridges empirical data and speculative simulation.
2. **Species Catalogue & Filtering (45s)**
   - Demonstrate searching for "Snailfish" or "Barreleye", filter by "Midnight zone", and open the field notes modal to show IUCN status and scientific literature references.
3. **Authentication & Personal Journal (60s)**
   - Open the "Sign In" modal, demonstrate validation errors (invalid email, short password), toggle password visibility, and sign in.
   - Show the user pill in the topbar and demonstrate adding a species to favorites.
   - Visit "My log" to show the personalized account banner and synchronized favorites.
4. **The Unknown: Creature Predictor (60s)**
   - Navigate to "The Unknown", select "Mariana Hadal Trench", adjust depth to 10,000 meters, and observe the calculated hydrostatic pressure (~1,006 bar).
   - Click "Predict Specimen", review the synthesized traits (TMAO piezolyte synthesis, cartilage skeleton, absence of gas bladder), and note the honest AI/speculative disclaimer.
   - Click "Save Dossier" and show it appear in "My log".
5. **Interactive Quiz & Resiliency (45s)**
   - Take the 5-question Ocean Quiz, show immediate feedback on correct/incorrect answers, and show personal best score update.
   - Highlight the topbar status indicator and explain how the system gracefully falls back to guest mode if the database disconnects.

---

## 11. Known Limitations

- **AI Image Generation**: When `IMAGE_PROVIDER=none` (default), predicted creatures display high-fidelity SVG biological diagrams. Live DALL·E 3 generation requires a funded OpenAI API key in `server/.env`.
- **Third-Party Photography**: Curated species catalog photos are hosted on Unsplash CDN; loading them requires active internet access.
- **Third-Party OAuth**: Social login (Google/GitHub) is deliberately omitted to prevent external dependency failure during academic evaluation; secure local email+password with bcrypt is implemented.

- ## Demo Video

Watch the Ocean Explorer project demonstration:

[**Watch the Demo Video**](https://drive.google.com/file/d/1qyOToztRrgZAUbaePawG6Oo31ZTYS1DC/view?usp=sharing)

The video demonstrates the main features, application workflows, and deployed project.
