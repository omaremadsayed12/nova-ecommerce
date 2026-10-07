# Nova

Nova is a bilingual demo ecommerce application built with React, Express, and MongoDB. Browse a sample catalog, manage a cart and wishlist, place orders through Stripe test checkout, and explore customer and administrator workflows.

## Staging Demo

**Live application:** [https://nova-ecommerce-pi.vercel.app/](https://nova-ecommerce-pi.vercel.app/)

This is a disposable staging/demo environment. It is not a production store; demo data may be reset.

## Demo Accounts

### Customer

- **Email:** `demo.customer@nova.dev`
- **Password:** `NovaDemo123!`
- Access: browse and search products, manage a wishlist/cart, check out in Stripe test mode, view orders, submit product reviews, and edit the demo profile.

### Admin

- **Email:** `demo.admin@nova.dev`
- **Password:** `NovaAdmin123!`
- Access: customer features plus the admin dashboard, product and user management, and filtered order management.

These are intentionally public demo credentials. Never reuse them for a real account or store real personal/payment information in this application.

## Features

- Customer registration/login and editable account profile
- Product browsing, search, category/price filters, sorting, pagination, and related products
- Cart and wishlist
- Server-priced order creation and inventory reservation
- Stripe Embedded Checkout in test mode, webhook processing, and bounded server-backed payment status refresh
- Product ratings and reviews with server-side validation and one-review-per-customer/product enforcement
- Customer order history and administrator order search, filters, pagination, cancellation, refund, and retry workflows
- Admin dashboard, product management, and paginated user management
- English/Arabic interface, right-to-left layout, and light/dark themes
- Responsive layouts, loading states, empty states, and error feedback
- Privacy Policy page for this staging/demo application

## Technology and Architecture

- **Frontend:** React, Vite, React Router, Tailwind CSS, i18next, Framer Motion, Stripe.js
- **Backend:** Node.js, Express, Mongoose, MongoDB, Stripe, Cloudinary
- **Hosting target:** Vercel Services for the frontend and Express API

The API follows `routes → controllers → services → models`; validation and authorization stay at the API/service boundary. The frontend follows `pages → components → services → API`. Product filtering, sorting, and pagination are performed by the backend. Prices, roles, order ownership, inventory, and payment state are server-authoritative.

## Project Structure

```text
api/                         Vercel API entrypoint
client/
  src/components/            Shared layout and UI components
  src/context/               Session, cart, wishlist, theme, and toast state
  src/pages/                 Storefront, account, orders, and admin pages
  src/services/              Client-side API calls
  src/styles/global.css      Tailwind entrypoint and application styles
server/
  scripts/                   Demo database seeding utility
  src/config/                Database, Stripe, and service configuration
  src/controllers/            HTTP request handlers
  src/middleware/             Authentication, uploads, and error handling
  src/models/                 Mongoose schemas
  src/routes/                 Express routes
  src/services/               Business logic and validators
  src/utils/                  Shared backend utilities
vercel.json                  Vercel Services and routing configuration
```

## How to Run Locally

### Prerequisites

- Node.js 22 LTS (22.12 or newer) and npm
- A staging/demo MongoDB database. Atlas is supported.
- Stripe test-mode credentials to try checkout
- Cloudinary credentials only if you want to test image uploads

Install dependencies and copy the safe environment templates:

```powershell
npm ci
npm ci --prefix server
npm ci --prefix client
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Set local values in the ignored `.env` files. Never use production credentials or commit these files.

### Backend environment (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; normally `5000` |
| `NODE_ENV` | `development` for local use |
| `MONGODB_URI` | Staging/demo MongoDB connection string |
| `JWT_ACCESS_SECRET` | Local access-token signing secret |
| `JWT_REFRESH_SECRET` | Separate local refresh-token signing secret |
| `STRIPE_SECRET_KEY` | Stripe test secret (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe test webhook signing secret |
| `CLOUDINARY_URL` | Cloudinary upload credentials, if using uploads |
| `CLIENT_URL` | Local frontend origin, normally `http://localhost:5173` |

### Frontend environment (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Local API base, normally `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe test publishable key (`pk_test_...`) |

Start both services from the repository root:

```powershell
npm run dev
```

Or start them in separate terminals with `npm run dev --prefix server` and `npm run dev --prefix client`. Open the Vite URL, normally `http://localhost:5173`.

## Demo / Seed Data

The seed command replaces the application-managed users, products, reviews, orders, payments, refresh tokens, and store settings in the selected database. It is intentionally guarded: first verify the configured `MONGODB_URI` points to a disposable staging/demo database, then pass that exact database name as an explicit confirmation. The script refuses a mismatch, a production-named database, or unexpected collections; it uses real MongoDB ObjectIds, validates references, and stores account passwords through the normal Mongoose password-hashing hook.

Run from the `server` directory only against a verified staging/demo database:

```powershell
npm run seed:demo -- --expected-db <exact-staging-database-name> --confirm-staging-reset
```

The seed creates the public demo customer and admin credentials above, 48 products across eight categories, 32 user accounts total (including the two demo accounts), 336 reviews, 120 orders, and store settings. Wishlist references are stored on users; Nova does not persist shopping carts separately. Seed orders are sample records, not real payments; the completed sample orders use cash on delivery. Stripe payment/session records are not fabricated.

## Checks

Run the client lint and production build:

```powershell
npm run lint --prefix client
npm run build --prefix client
```

Check backend JavaScript syntax:

```powershell
Get-ChildItem server\src,server\scripts -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

The server currently has no maintained automated test suite. The finish plan records additional API/database/Stripe checks only when they have been run. A successful local build does not verify hosted Vercel deployment, external webhook delivery, or a completed Stripe transaction.

## Payment Testing

Nova uses Stripe Embedded Checkout. The backend creates the Checkout Session and remains authoritative for prices and payment status; Stripe webhooks are the primary confirmation mechanism and the status endpoint is a bounded fallback. Only test-mode credentials belong in this demo.

For a Stripe card test, Stripe's standard success test number is `4242 4242 4242 4242`; use any future expiry date and any three-digit CVC when requested. Use Stripe's test dashboard to inspect test sessions/refunds. Actual completion still depends on the staging webhook configuration. Never enter real card details. Stripe-hosted embedded UI supports only Stripe's documented styling and locale choices; Nova cannot style the Stripe-owned form with application CSS, and the app's Arabic preference cannot force a locale Stripe does not support.

## Staging Deployment

The public staging URL is [https://nova-ecommerce-pi.vercel.app/](https://nova-ecommerce-pi.vercel.app/). Vercel's Project Root Directory must be the repository root (`.`), with the Services framework configured. `vercel.json` defines separate `client/` and `server/` services and routes `/api/*` to Express.

Set `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `CLOUDINARY_URL` as server-only environment variables. Set `VITE_API_URL=/api` and `VITE_STRIPE_PUBLISHABLE_KEY` as frontend build variables. Keep secret values out of all `VITE_` variables. Configure the Stripe test webhook at `/api/webhook/stripe` for the checkout completion, asynchronous success/failure, and expiration events.

## Important Notes

- This is a staging/demo deployment, not a production ecommerce service.
- The demo credentials are public and must only be used with disposable data.
- Payments use Stripe test mode; no real transactions should be made.
- The demo database may be reset and reseeded.
- Do not place real personal data, production keys, passwords, database URIs, or payment details in source control.
- The backend's secret keys and webhook signing secret must remain server-only.
