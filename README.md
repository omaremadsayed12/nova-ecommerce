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
- **Hosting target:** Vercel Preview for the client and a free Render web service for the API

## Architecture

The backend follows `routes → controllers → services → models`; request and service-boundary validators are kept with the relevant service logic. Express centralizes errors and uses Stripe's signed webhook endpoint to record payment outcomes separately from order status.

The frontend follows `pages → components → services → API`. React contexts hold user-facing session, theme, cart, wishlist, and toast state. Product filtering, sorting, and pagination are requested from the backend.

## Repository layout

```text
client/
  src/
    components/
    context/
    pages/
    services/
    styles/global.css
  vercel.json
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
render.yaml
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
| `CLIENT_URL` | Client origin, normally `http://localhost:5173` |

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

- **Frontend:** Create a Vercel project with `client` as its root directory. `client/vercel.json` configures the Vite build and SPA route fallback. Set `VITE_API_URL` to the deployed API's `/api` URL and `VITE_STRIPE_PUBLISHABLE_KEY` to a Stripe test publishable key in the Vercel **Preview** environment.
- **Backend:** `render.yaml` describes a free Render web service with the API health-check path. Set its unsynchronized environment variables in the Render dashboard. `CLIENT_URL` must be the exact Vercel preview origin used to access the demo; the API uses it for CORS and Stripe return URLs.
- **Database:** Use only the existing demo MongoDB Atlas database, with access restricted as appropriate for the chosen staging host. Do not put its URI in this repository.
- **Payments:** Use Stripe test mode only. Configure the test webhook endpoint as `https://<render-service-host>/api/webhook/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`; enter its signing secret as `STRIPE_WEBHOOK_SECRET`. Never use a live key for this demo.

Free services may sleep or have resource limits, so a cold start or delayed webhook should be expected. Deployment remains incomplete until the Vercel/Render projects are authorized, their environment variables are entered in the provider dashboards, and the deployed API/frontend smoke checks pass.

## Security

Never commit `.env` files, database credentials, JWT secrets, Stripe secret/webhook keys, or Cloudinary credentials. Only the Stripe publishable test key belongs in the frontend environment; all other Stripe credentials must remain backend-only. Treat the demo database and all test accounts/data as disposable staging data. Rotate any credential that is accidentally exposed, and do not paste secrets into issues, logs, or chat.
