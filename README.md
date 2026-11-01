# Rémi Rossello — Personal Website

Welcome to my website, showcasing projects, publications, and credentials.

## Tech Stack

### Frontend
- React 18 + Vite 5
- Framer Motion (UI animations)
- KaTeX + react-katex (math rendering)
- react-pdf (publication preview)
- Vitest + Testing Library + JSDOM (unit/component tests)

### Backend
- Node.js + Express 4

### Tooling
- npm workspaces (monorepo root)

## Features

- Tab-based SPA navigation: Home, About, Credentials, Projects
- Credentials tab with categorized cards (Engineering, Computer Science, Humanities)
- Credential detail viewer with optional image preview and verification links
- About tab with an embedded software CV preview
- Publications viewer with in-app PDF preview, pagination, open/download actions
- In projects tab: Interactive Standard Model Lagrangian explorer with drill-down term navigation
- Backend demo action from the frontend (`Call Backend`) hitting `/api/hello`
- Responsive UI and light/dark theme support

## Project Structure

```text
.
├─ frontend/               # React + Vite application
│  ├─ public/assets/       # Static images and PDF documents
│  └─ src/                 # App, components, styles, tests
├─ backend/                # Express API server
└─ package.json            # Workspace root
```

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### 1) Install dependencies
From repository root:

```bash
npm install
```

### 2) Start backend

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3000` by default.

### 3) Start frontend (in a second terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.


## Available Scripts

### Frontend (`frontend/package.json`)
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run test` — run tests in watch mode
- `npm run test:run` — run tests once
- `npm run start` — serve built frontend (`dist`)

### Backend (`backend/package.json`)
- `npm start` — start Express server

## Backend API

- `GET /` → backend status payload
- `GET /health` → health check (`{ status: "ok" }`)
- `GET /api/hello` → demo message with current date

## Testing

Run frontend tests:

```bash
cd frontend
npm run test:run
```

## Deployment Notes

- When the Railway frontend service uses `frontend` as its root directory, its
  `frontend/package-lock.json` is separate from the workspace root lockfile so
  Railway can install dependencies when it receives only the frontend folder.
  Update both lockfiles when changing frontend dependencies; regenerate the
  frontend lockfile from an isolated copy of `frontend/package.json`.
- For the frontend build, install development dependencies as well: Vite is
  required to build, and the configured start script uses `serve`.
- Backend is configured to allow:
	- local frontend (`http://localhost:5173`)
	- Railway domains (`*.up.railway.app`)
	- optional `FRONTEND_ORIGIN` environment variable
- Frontend assets and documents are served from `frontend/public/assets`.
