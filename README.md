# MeeBhoomi Andhra Pradesh Reference Recreation (MERN Stack)

A full-stack reference recreation of the official **MeeBhoomi** Andhra Pradesh Land Records Portal (`https://meebhoomi.ap.gov.in/`). Built with MongoDB, Express.js, React (Vite, JSX, CSS), and Node.js.

---

## 🏛️ Project Architecture

```
mee_bhoomi/
├── client/                     # Frontend (React + Vite + JSX)
│   ├── src/
│   │   ├── components/         # Header, Navigation, Footer, CaptchaPanel, ResultsTable, Chatbot, Modal
│   │   ├── pages/              # HomePage, AdangalPage, ROR1BPage, LPMapPage, AadhaarStatusPage, EPassbookPage, etc.
│   │   ├── services/           # apiService.js (REST API integration)
│   │   ├── index.css           # Government design tokens & Telugu typography
│   │   └── App.jsx             # Main routing container
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # db.js (MongoDB connection with resilient in-memory fallback)
│   ├── controllers/            # districtController, recordController, captchaController, authController
│   ├── middleware/             # rateLimiter, errorHandler, validator
│   ├── models/                 # District, Mandal, Village, LandRecord, ApplicationStatus
│   ├── routes/                 # api.js
│   ├── seeds/                  # seedData.js (Realistic AP revenue records for Guntur, Krishna, etc.)
│   ├── services/               # captchaService.js (Server-side SVG CAPTCHA generator & HMAC token validator)
│   ├── tests/                  # api.test.js (Unit & integration test suite)
│   ├── server.js               # Express application entrypoint
│   ├── .env                    # Environment variables
│   └── package.json
│
├── docs/                       # Project Documentation & Audits
│   ├── reference-audit.md      # Detailed reverse-engineering audit of meebhoomi.ap.gov.in
│   ├── api.md                  # REST API endpoints & payload specifications
│   ├── implementation-progress.md # Checklist of implemented routes and features
│   └── visual-qa.md            # Visual verification across viewports
└── package.json                # Root orchestration package
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **MongoDB**: Required for persistent database storage. The in-memory dataset is a development-only demo fallback.

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
npm run seed     # Seed the configured MongoDB with synthetic demo records
npm run test     # Run unit and integration tests
npm start        # Starts server on http://localhost:5000
```

Before seeding, configure `server/.env` with a MongoDB connection string in `MONGODB_URI` and a private random `CAPTCHA_SECRET`. The seed command is idempotent: it inserts demo documents that are missing and preserves existing records. Do not put real Aadhaar numbers in demo seed data. The Aadhaar Status demo searches by the final four digits only; it does not contact UIDAI or verify a real Aadhaar number.

To run without MongoDB for local UI development, explicitly set `ALLOW_IN_MEMORY_FALLBACK=true` in `server/.env`. This mode is not persistent; changes are lost when the backend restarts. The bundled hierarchy and land records cover only the synthetic locations present in the demo seed, not every official Andhra Pradesh revenue village.

All location selectors load districts, mandals, and villages from the backend in parent-child order. The configured database currently contains a small synthetic sample dataset (8 districts, 12 mandals, 12 villages, and 5 land records when last checked). A location may have no matching land records; search results only include records matching the selected district, mandal, and village. These records are not official government records.

### 3. Frontend Setup (`client/`)
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 4. Running Both Concurrently from Root
```bash
npm install
npm run dev
```

### 5. Vercel Multi-Service Deployment

The root `vercel.json` defines a Vite `client` service and an Express `server`
service. Select **Services** as the Vercel project framework preset. Requests
under `/api/` route to Express without changing the path; other requests route
to the Vite frontend. The browser uses the same-origin `/api` URL, while the
Vite development proxy continues to forward local API calls to port 5000.

Configure these variables in Vercel project settings:

- `MONGODB_URI`: the existing Atlas connection string.
- `CAPTCHA_SECRET`: a long, private random value.
- `FRONTEND_URL`: optional; set to the deployed frontend origin when using a
  custom domain. Vercel's `VERCEL_URL` is used for deployment URLs by default.
- `NODE_ENV=production`: ensure the backend runs with production behavior.

Do not prefix backend secrets with `VITE_`, commit `.env` files, or enable
`ALLOW_IN_MEMORY_FALLBACK` in production. MongoDB Atlas connectivity from Vercel
must be authorized through a restricted network access configuration. Vercel
uses dynamic egress IPs by default; use Vercel Static IPs or Secure Compute and
allowlist those addresses rather than opening Atlas to `0.0.0.0/0`.

The login OTP remains a local demo flow and does not send SMS. No SMS provider
credentials are used or supported by the current implementation.

---

## 🛡️ CAPTCHA Verification Security

1. **Server-Generated Challenges**: Challenges are generated directly on the server in `server/services/captchaService.js` as an SVG vector image and an HMAC-SHA256 signed token.
2. **One-Time Use**: Tokens are consumed upon the first verification attempt to prevent replay attacks.
3. **Short Expiry**: Tokens expire in 3 minutes.
4. **Provider Secret**: Kept in `server/.env` under `CAPTCHA_SECRET`.
5. **No Blind Trust**: Client-side submissions must supply both the token and the answer, which are validated cryptographically on the server before executing record searches.

---

## 📋 Verified Service Routes & Demo Search Criteria

| Service | Route | Sample Search Query |
| :--- | :--- | :--- |
| **Home Portal** | `#home` | Mobile: `9876543210` (OTP: `975310`) |
| **Your Adangal** | `#adangal` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Sy No: `125/1` |
| **Village Adangal**| `#village-adangal`| Guntur ➔ Mangalagiri ➔ Chinakakani |
| **Your 1-B / ROR** | `#1b` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Khata No: `102` |
| **Village 1-B** | `#village-1b` | Guntur ➔ Mangalagiri ➔ Chinakakani |
| **LP Map / FMB** | `#lp-map` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Sy No: `125/1` |
| **Aadhaar Status** | `#aadhaar-status` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Khata No: `102` |
| **E-Passbook** | `#passbook` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Khata No: `102` |
| **Mutation Track** | `#mutation-status`| Application No: `MUT2026AP009412` |
| **Water Tax** | `#water-tax` | Guntur ➔ Mangalagiri ➔ Chinakakani ➔ Khata No: `102` |

---

## ⚖️ Disclaimer
*This repository is an educational reference recreation of the public Andhra Pradesh MeeBhoomi portal UI and API architecture. All records contained herein are synthetic demonstration records. This system does not claim live integration with official government databases.*
