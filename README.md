# Nova

Nova is a bilingual (English/Arabic) MERN ecommerce demo. It includes a React storefront and an Express API backed by MongoDB, with Stripe Checkout restricted to test-mode credentials.

This repository is intended for development and staging/demo use. It is not a production deployment or a source of production credentials.

## Features

- Product catalog with server-side search, category and price filters, sorting, and pagination
- Product detail pages, stock-aware cart controls, and wishlist
- Customer registration, login, account/order views, and role-protected admin screens
- Order creation and inventory reservation using server-side product prices
- Stripe Embedded Checkout and webhook-verified payment status
- English/Arabic localization, RTL layout, and light/dark themes
- Responsive navigation, search, loading, empty, and error states

## Technology

- **Frontend:** React, Vite, React Router, Tailwind CSS, i18next, Framer Motion, Stripe.js
- **Backend:** Node.js, Express, Mongoose, MongoDB Atlas, Stripe, Cloudinary
- **Hosting target:** One Vercel project for the frontend and Express API, using Vercel's free Hobby plan for staging/demo

## Architecture

The backend follows `routes → controllers → services → models`; request and service-boundary validators are kept with the relevant service logic. Express centralizes errors and uses Stripe's signed webhook endpoint to record payment outcomes separately from order status.

The frontend follows `pages → components → services → API`. React contexts hold user-facing session, theme, cart, wishlist, and toast state. Product filtering, sorting, and pagination are requested from the backend.

## Repository layout

```text
api/
  [...path].mjs
client/
  src/
    components/
    context/
    pages/
    services/
    styles/global.css
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
  .env.example
vercel.json
```

## Local setup

Requirements: Node.js 22 LTS (22.12 or newer) and npm.

Install dependencies from the repository root:

```powershell
npm ci
npm ci --prefix server
npm ci --prefix client
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Fill in the local environment files with **demo/staging** values only. Do not commit either `.env` file.

### Backend environment (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Local API port; defaults to `5000` |
| `NODE_ENV` | Use `development` locally |
| `MONGODB_URI` | Connection string for the demo Atlas database |
| `CLOUDINARY_URL` | Cloudinary upload credentials, if using image uploads |
| `JWT_ACCESS_SECRET` | Local access-token signing secret |
| `JWT_REFRESH_SECRET` | A separate local refresh-token signing secret |
| `STRIPE_SECRET_KEY` | Stripe **test-mode** secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Test webhook signing secret (`whsec_...`) |
| `CLIENT_URL` | Local client origin (`http://localhost:5173`); optional deployment override (Vercel otherwise uses `VERCEL_URL`) |

### Frontend environment (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL, normally `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe **test-mode** publishable key (`pk_test_...`) |

Start both services from the repository root:

```powershell
npm run dev
```

Alternatively, run `npm run dev --prefix server` and `npm run dev --prefix client` in separate terminals. The client uses Vite's default local origin, `http://localhost:5173`.

## Checks

The client provides:

```powershell
npm run lint --prefix client
npm run build --prefix client
```

The server package currently has no automated test script or checked-in test suite. JavaScript syntax can be checked with:

```powershell
Get-ChildItem server\src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

The current local verification completed successfully: client lint, client production build, syntax checks for all 58 server JavaScript files, the clean server install/import check, and a production-dependency audit (zero runtime advisories). Browser checks covered 40 route/viewport combinations at 320, 375, 768, and 1440px, light/dark preferences, RTL/mobile navigation, and mocked paid/failed/cancelled cart outcomes. The build reports a bundle-size advisory above 500 kB. The full server audit still reports advisories in the development-only `nodemon` dependency chain.

The completion plan records focused Atlas-backed API, authentication, order, inventory-concurrency, and locally signed Stripe webhook checks. These are integration checks documented from prior work, not a substitute for a maintained automated test suite. Browser checkout and an externally delivered Stripe webhook require the corresponding hosted services and credentials.

## Staging/demo deployment

- **Single Vercel project:** Import this repository into Vercel with the repository root as the Project Root Directory (not `client`). The root [vercel.json](./vercel.json) installs the client/server lockfiles, builds Vite from `client`, serves `client/dist`, and leaves `/api/*` to the Express function in `api/[...path].mjs`; other paths use the SPA fallback.
- **Function setup:** The catch-all function exports the existing Express app without starting a persistent listener. It connects to MongoDB and initializes store settings once per warm function instance. Vercel environment variables supply database/auth/payment secrets. Vercel's deployment, branch, and production URL variables are allowed CORS origins; `VERCEL_URL` is used as the Stripe return origin when `CLIENT_URL` is not explicitly set.
- **Vercel environment variables:** Set `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY` (test key only), `STRIPE_WEBHOOK_SECRET`, and `CLOUDINARY_URL` as server-only variables. Set `VITE_API_URL=/api` and `VITE_STRIPE_PUBLISHABLE_KEY` (test publishable key only) for the Vite build. Keep `VITE_` variables limited to public values; never prefix secrets with `VITE_`. `CLIENT_URL` is optional; set it only when using a specific stable frontend origin instead of Vercel's deployment URL.
- **Database:** Continue using only the existing demo MongoDB Atlas database. Vercel Hobby does not provide a fixed outbound IP, so Atlas network access may require allowing `0.0.0.0/0`; that exposes the database endpoint publicly, so use a strong unique database password, least-privilege Atlas user, and demo-only data. Do not put its URI in this repository.
- **Payments:** Use Stripe test mode only. Configure the test webhook endpoint at `https://<deployed-vercel-host>/api/webhook/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`. Store its signing secret in the Vercel server environment as `STRIPE_WEBHOOK_SECRET`. Never use a live key for this demo.

The Express function disables Vercel's automatic body parser so the existing Express raw-body middleware can validate Stripe webhook signatures. File uploads use the function's temporary directory and must be persisted to Cloudinary; Vercel function filesystems are otherwise ephemeral, and uploads must stay within Vercel's request-size limits. Vercel Hobby functions can cold-start and have platform execution/resource limits, so checkout/API work should remain request-bound. No separate backend host or production infrastructure is used.

Deployment remains incomplete until the Vercel project is authorized, environment variables are entered in its dashboard, the deployment succeeds, and deployed health/API/Stripe test-mode smoke checks pass.

## Security

Never commit `.env` files, database credentials, JWT secrets, Stripe secret/webhook keys, or Cloudinary credentials. Only the Stripe publishable test key belongs in the frontend environment; all other Stripe credentials must remain backend-only. Treat the demo database and all test accounts/data as disposable staging data. Rotate any credential that is accidentally exposed, and do not paste secrets into issues, logs, or chat.
