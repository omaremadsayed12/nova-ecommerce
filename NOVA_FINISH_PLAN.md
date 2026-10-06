# Nova Finish Plan

## Phase 1 - Security
- [x] Prevent role escalation
- [x] Verify authorization across protected resources

Completed: Public registration forces `CUSTOMER`; customers cannot change their role; admin-only user creation/update paths can assign roles. Protected route guards and owner checks were reviewed, and ObjectId ownership comparisons were corrected. Database-backed user-operation checks passed. Some route middleware denials were reviewed from source rather than exercised over HTTP.

## Phase 2 - Orders
- [x] Repair order creation
- [x] Inventory reservation
- [x] Cancellation
- [x] Verify MongoDB transaction support

Completed: Orders use database product snapshots and settings. Conditional stock reservation, order creation, cancellation restoration, and status transitions run in transactions. Atlas replica-set support was confirmed. Database checks passed for successful orders, insufficient stock, injected save failure rollback, concurrent cancellation, and repeated cancellation. A two-customer concurrent reservation test and API-level lifecycle checks were later completed in Phase 7. There is no server cart model/service.

## Phase 3 - Payments
- [x] Checkout
- [x] Stripe payment creation
- [x] Stripe webhook
- [x] Payment status transitions
- [x] Failed payment handling
- [x] Successful payment handling
- [x] Prevent duplicate payment processing

Completed: Checkout creates orders from product IDs and quantities, initiates Stripe Embedded Checkout using server totals, and clears the browser cart only after the server reports `PAID`. Payment rows are unique per order and retries reuse the same Stripe session. Signed webhook transitions validate metadata and totals, keep order/payment states separate, and handle duplicate events idempotently. Atlas + Stripe test-mode checks covered session creation, amount, retry, locally signed success/expiry/failure payloads, duplicate events, mismatch rejection, and stock restoration. Phase 7 also exercised locally signed webhook requests over HTTP. No charge was made and Stripe did not deliver an actual webhook. Browser checkout was not exercised at that stage; Phase 9 later confirmed the local test publishable key initializes Stripe.js, but did not submit checkout.

## Phase 4 - User experience
- [x] Order history
- [x] Admin product management
- [x] Admin dashboard

Completed: Customer order history uses newest-first pagination and displays saved item snapshots, dates, statuses, and totals. Atlas checks verified customer scoping and page metadata; client lint and backend syntax checks passed. Browser rendering was not checked.

Completed: Admin product management now uses the protected product API for list/create/edit/delete, with bilingual fields, price, stock, currency, activation, and optional image upload. Atlas service checks and client lint passed. Multipart upload and live route authorization were not exercised.

Completed: Admin dashboard reports order/product/customer counts, paid revenue by currency, and recent orders through an admin-only endpoint, preserving the public homepage stats response. Atlas + local HTTP checks passed for metrics, access denial, and public stats compatibility. Client lint/backend syntax passed; browser rendering was not checked at implementation time.

## Phase 5 - Reviews and validation
- [x] Review updates
- [x] Product partial updates
- [x] User partial updates

Completed: Review owners can update only rating/comment; validation, duplicate lookup, owner/anonymous denial, and response shape passed Atlas + local HTTP checks. No review-edit UI exists.

Completed: Product PATCH validates supported fields, preserves omitted translations, rejects mass-assignment, and returns the saved document. Atlas + HTTP checks covered patches, preservation, authorization, and invalid fields; backend syntax and diff checks passed.

Completed: User PATCH validates localized names, normalized unique email, password, admin-only role, and image URL; merges fields and returns the saved user. Atlas + HTTP checks covered field preservation, duplicate email, customer isolation, role restrictions, and trusted admin operations. Backend syntax checks passed.

## Phase 6 - Frontend
- [x] Repair build environment
- [x] Shop API integration
- [x] Homepage API integration
- [x] Cart
- [x] Wishlist
Completed: Wishlist now loads and mutates through the authenticated existing API, normalizes ObjectId/string IDs, clears account-scoped items on logout or account switch, and exposes loading, retry, and error states. The page shows product details, empty and unavailable products, remove controls, and stock-aware add-to-cart actions. Server comparisons now match Mongoose ObjectIds safely. Client lint/build, backend syntax checks, and a focused service check for duplicate rejection/removal passed. Browser interaction and live HTTP/database wishlist flow were not exercised.
- [x] Checkout
Completed: The existing checkout sends cart IDs/quantities to server order creation and waits to clear cart until payment success. Payment status errors now retry polling; FAILED/CANCELLED removes only the matching obsolete pending-order ID while preserving the cart, and offers a fresh checkout link. Refunded payments remain distinct. Client lint and production build passed. Browser checkout itself has not been submitted against a live backend/Stripe session.
- [x] Loading/error/empty states
Completed: Key API-backed views now expose loading, error, retry, and empty states. Navbar search uses server query parameters and localized product fields instead of an invalid no-argument request; category-filter failures and product-detail failures can be retried, and stale product requests are cancelled. Home/Footer error notifications now pass readable messages. Cart, wishlist, shop, order, admin, and checkout states were reviewed. Client lint/build passed; browser interaction was not performed.
- [x] RTL/i18n
- [x] Responsive UI

Completed: Arabic and English now stay in sync with the document language and direction. Customer shopping, order, checkout, payment, search, and admin screens use localized labels, status text, prices/dates, and product fields; mobile navigation labels and translated accessible names were corrected. Client lint, production build, a language/direction smoke check, and `git diff --check` passed. Browser visual interaction was not performed. Server-provided error messages can still be English.

Completed: Responsive layouts now stack the footer on narrow screens, scale product-detail imagery and quantity controls, and render the About page with its intended styles. The 320px minimum body width was removed to prevent a forced horizontal scrollbar when browser scrollbars reduce the available width. Toast callbacks are stable across provider renders so toast updates do not retrigger dependent error-fetch effects. Browser checks at 320px, 375px, and 768px confirmed the main customer/admin routes fit; the mobile menu opened successfully. Client lint, production build, and `git diff --check` passed. The local backend was not running, so API-backed page data (including the homepage and product details) could not be visually verified; the homepage showed its existing unavailable state.

Completed: The production build issue was traced to one invalid Windows-1252 byte in `AdminDashboardPage.jsx`, corrected to UTF-8. Client lint and production build pass; Vite still reports an existing bundle-size advisory.

Completed: Shop search, category, price, sort, and page parameters now match the API. The UI uses server pagination and filters, cancels stale requests, and displays localized catalog values. Atlas + HTTP checks passed for filters, sorting, and pagination; client lint and build passed.

Completed: Homepage data now consumes the API envelopes with stale-request cancellation and localized fallbacks. Carousel requests use the expected query format and returned item count; category sorting uses validated Mongo sort keys. Atlas + HTTP checks and client lint/build passed.

Completed: Cart rows load authoritative product display details by ID, show current localized names, images, currencies and estimated subtotals, and support remove/quantity controls. Quantity changes are bounded by current stock; unavailable or over-stock items block checkout, and a stale over-stock quantity can still be reduced. Cart persistence tolerates malformed local storage. Prices/tax/shipping/final totals remain server-calculated. Client lint and production build passed. Browser interaction and live cart API behavior were not exercised.

## Phase 7 - Verification
- [x] Backend tests
- [x] Frontend build
- [x] API smoke tests
- [x] Authentication flow
- [x] Order lifecycle
- [x] Payment lifecycle

Completed: The server package exposes only `dev` and `start`; the repository has no backend test files or test runner. `node --check` passed for all 58 server JavaScript files. No automated backend test suite could be run; focused Atlas-backed service and local HTTP checks from earlier milestones are documented above. Frontend `npm run lint`, `npm run build`, and `git diff --check` passed after responsive changes; the build reports a 594.90 kB minified JavaScript chunk advisory. The API, authentication, order, and payment smoke flows are recorded below.

Completed: With the configured Atlas-backed server running locally, `/api/health`, `/api/stats`, `/api/products`, and `/api/categories` returned 200 success envelopes. Unauthenticated `/api/order`, `/api/users`, and `/api/stats/admin` requests returned 401 error envelopes. API smoke calls passed.

Completed: An Atlas-backed HTTP flow registered a disposable customer while ignoring a submitted `ADMIN` role, logged in, fetched `/api/auth/me`, updated the owner's name, denied a self-role change, refreshed access, logged out, rejected refresh-token replay, and deleted the disposable account. Cleanup confirmed no test user or refresh token remained. This flow exposed and fixed registration's object-shaped `name` parsing and owner checks for User documents (`_id`); malformed stringified names now return the existing validation envelope. `node --check` passed for all 58 server files.

Completed: Atlas-backed HTTP order checks confirmed database-sourced price/tax/shipping/currency, product snapshots, pending/unpaid separation, stock reservation, owner-only reads/cancellation, rejection of over-stock multi-item carts without partial writes, exact stock restoration, and idempotent cancellation. Two concurrent customers competing for one temporary stock unit produced exactly one order; the winner's cancellation restored stock once. Temporary users, orders, payment rows, and product were removed, and stock was confirmed restored.

Completed: Stripe test-mode HTTP checks created and retried Checkout Sessions, rejected invalid signatures and amount mismatches, and exercised locally signed expiry, async-failure, and success events through the webhook route. Expiry/failure cancelled unpaid orders and restored inventory once; success kept order/payment states separate, reported `PAID`, and did not restore sold stock. Duplicate events were idempotent; retrying a completed order returned a 400 validation envelope. Test Checkout Sessions were expired and temporary database records removed. No real charge or Stripe-delivered event occurred; browser checkout remains unverified because `VITE_STRIPE_PUBLISHABLE_KEY` is missing.

## Phase 8 - Staging/demo deployment
- [x] Select Vercel-only hosting for the SPA and Express API
- [x] Configure current Vercel Services schema for client and server
- [x] Route `/api/*` to Express and other paths to the SPA
- [x] Add per-instance MongoDB connection/store-settings initialization
- [x] Preserve raw Stripe webhook signature verification
- [x] Adapt temporary uploads for function filesystem
- [ ] Deploy staging app - requires Vercel project authorization and dashboard setup
- [ ] Configure Atlas network access and Stripe TEST webhook - requires dashboard setup
- [ ] Run deployed health/API/checkout/webhook smoke tests - blocked until deployment

Architecture decision: use one Vercel project with the repository root as the Project Root Directory and the Project Framework set to Services. Root `vercel.json` declares separate Vite and Express services rooted at `client/` and `server/`; ordered top-level rewrites route `/api/*` to the server and all other requests to the client, whose own rewrite preserves SPA routes. The Express service uses the existing default-exported `server/src/app.js` entry point; MongoDB and store settings initialize once per warm instance before API requests, while `server/src/server.js` remains the local development listener.

Services configuration: the root `vercel.json` builds the client and server independently using their own root directories, framework settings, and lockfiles. The frontend SPA fallback is scoped to the client service, while the ordered top-level `/api/(.*)` rewrite routes to Express and the catch-all rewrite routes to the client. Express already mounts the Stripe webhook before JSON parsing, so its raw-body signature verification remains intact. MongoDB/store settings initialize once per service instance; failures return an API error envelope and may be retried. Express file uploads use the runtime temp directory (`TMPDIR` or Node's OS temp path); only Cloudinary persists uploaded files. CORS and Stripe return URLs use explicit `CLIENT_URL` when supplied, otherwise Vercel's runtime `VERCEL_URL`. Deployed auth cookies are secure on Vercel and remain HttpOnly/SameSite=Lax. The frontend API base must be the same-origin `/api`, avoiding cross-origin cookie requirements.

The obsolete catch-all API adapter is removed because the server now builds as its own Express service. The obsolete separate-host manifest remains removed. The existing demo Atlas database is unchanged. No production database, production payment credentials, or paid infrastructure are introduced.

Dependency note: the production backend dependency audit previously reported zero vulnerabilities. The full audit had three high-severity findings in the development-only `nodemon → chokidar → braces` chain; npm's only offered forced fix downgraded nodemon to 1.x, so it was not applied.

Requires manual action: import this GitHub repository with **Project Root Directory = `.` (repository root)** and set **Project Framework = Services** in Vercel's Build and Deployment settings. Add server-only Vercel variables `MONGODB_URI` (existing demo Atlas URI), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY` (Stripe TEST key), `STRIPE_WEBHOOK_SECRET` (Stripe TEST endpoint signing secret), and `CLOUDINARY_URL`. Add frontend build variables `VITE_API_URL=/api` and `VITE_STRIPE_PUBLISHABLE_KEY` (Stripe TEST publishable key). Optionally set `CLIENT_URL` only if using a stable custom deployment origin; otherwise the service derives its origin from Vercel's `VERCEL_URL`. Keep all secret values in Vercel's dashboard and never paste them into chat or commit them. Vercel Hobby has no fixed outbound IP; if required by the Atlas allowlist, permitting `0.0.0.0/0` exposes the endpoint publicly, so use a strong unique database password, least-privilege user, and demo-only data. After the first deployment, configure the Stripe TEST webhook at the actual deployed URL `https://<deployed-vercel-host>/api/webhook/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`; add its signing secret to Vercel and redeploy. Verify `/api/health`, authenticated-cookie flows, checkout, and webhook delivery against TEST mode. No deployment has yet been made or tested.

Previous local checks exercised the former catch-all function and Stripe raw-body behavior. The current Services config is based on Vercel's Services schema: service roots and framework/build settings are defined per service, `/api/(.*)` is routed to the Express service before the frontend catch-all, and the SPA fallback is scoped to the client service. Verified the JSON shape and route order against the checked-in `client/` and `server/` roots and lockfiles; `server/src/app.js` imports as the default Express app. Client lint/build and `node --check` for all 60 server JavaScript files pass; the build retains its >500 kB chunk advisory. No Vercel deployment is claimed; hosted routing, Atlas, and Stripe webhook behavior still require a real deployment.

## Phase 9 - Finish objectives and verification
- [x] Audit light/dark styling and responsive layouts
- [x] Correct Preferences menu sizing and spacing
- [x] Consolidate frontend styling into `client/src/styles/global.css`
- [x] Preserve cart until verified paid status
- [x] Correct Arsenal external navigation behavior
- [x] Verify Stripe frontend key wiring and test-mode initialization
- [x] Create public-facing root README and clean repository ignore/docs
- [x] Run local build, lint, syntax, and browser checks
- [x] Prepare the whole repository for Vercel-only staging deployment
- [ ] Complete hosted staging smoke checks - blocked by Phase 8 Vercel actions

Verified: browser checks exercised light/dark surfaces and preferences, RTL preferences at 320px, desktop navigation, and the mobile menu. The preferences panel measured 352x232px at 1440px wide and 296x232px at 320px wide; its controls fit without horizontal overflow. The initial viewport matrix caught oversized Home and Shop skeletons; those were made responsive, and a follow-up checked 40 route/viewport combinations (320, 375, 768, and 1440px) with no document overflow. Browser-level mocked payment-status checks confirmed `PAID` empties the cart while `PENDING`, `FAILED`, and `CANCELLED` preserve it; pending state also retains its pending-order ID. This verifies client behavior only; server-side payment verification remains in Phase 3.

Verified: client ESLint and production build pass, and `node --check` passes for all 58 server JavaScript files. A clean install from `server/` and import of the Express app also pass. The backend production-dependency audit reports zero vulnerabilities; the full audit has three high-severity findings in the development-only `nodemon → chokidar → braces` chain, with no non-breaking automated fix. The build reports the existing advisory that the minified JavaScript bundle exceeds 500 kB. `git diff --check` passes. Stripe.js loads in the browser from the local `pk_test_` configuration; no backend checkout session was created in this browser check. The local API was not running, so pages depending on API data rendered their existing loading/error states; no live browser API/payment flow was verified here.

Verified cleanup: `client/src/main.jsx` is the only frontend stylesheet import and imports `global.css`; `global.css` is the only remaining frontend CSS file in the working tree. The old component/page CSS files, obsolete Vite template README, and unused Webhint config were removed after reference checks. Root ignore rules cover env files, build output, dependency directories, logs, and hosting/tool caches; package-lock files remain. No tracked `.env` files or recognized Stripe, database, Cloudinary, GitHub-token, or AWS credential markers were detected in Git history. Existing local `.env` files remain ignored and were not displayed or copied into public files.

Still blocked: no Vercel CLI authentication or dashboard authorization is available. A deployed health check, frontend-to-backend connectivity test, hosted Stripe test checkout, and Stripe-delivered webhook test must wait until the manual actions in Phase 8 are complete.
