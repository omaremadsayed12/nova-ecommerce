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

Completed: Orders use database product snapshots and settings. Conditional stock reservation, order creation, cancellation restoration, and status transitions run in transactions. Atlas replica-set support was confirmed. Database checks passed for successful orders, insufficient stock, injected save failure rollback, concurrent cancellation, and repeated cancellation. Concurrent order-reservation stress testing and API-level lifecycle testing were not performed. There is no server cart model/service.

## Phase 3 - Payments
- [x] Checkout
- [x] Stripe payment creation
- [x] Stripe webhook
- [x] Payment status transitions
- [x] Failed payment handling
- [x] Successful payment handling
- [x] Prevent duplicate payment processing

Completed: Checkout creates orders from product IDs and quantities, initiates Stripe Embedded Checkout using server totals, and clears the browser cart only after the server reports `PAID`. Payment rows are unique per order and retries reuse the same Stripe session. Signed webhook transitions validate metadata and totals, keep order/payment states separate, and handle duplicate events idempotently. Atlas + Stripe test-mode checks covered session creation, amount, retry, locally signed success/expiry/failure payloads, duplicate events, mismatch rejection, and stock restoration. No charge was made and Stripe did not deliver an HTTP webhook. Browser checkout was not exercised because `client/.env` lacks `VITE_STRIPE_PUBLISHABLE_KEY`.

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
Completed: The existing checkout sends cart IDs/quantities to server order creation and waits to clear cart until payment success. Payment status errors now retry polling; FAILED/CANCELLED removes only the matching obsolete pending-order ID while preserving the cart, and offers a fresh checkout link. Refunded payments remain distinct. Client lint and production build passed. Browser checkout remains unverified because the client Stripe publishable key is not configured.
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
- [ ] Backend tests
- [x] Frontend build
- [ ] API smoke tests
- [ ] Authentication flow
- [ ] Order lifecycle
- [ ] Payment lifecycle

Completed: After the responsive changes, `npm run lint`, `npm run build`, and `git diff --check` passed. The production build still reports the existing 594.90 kB minified JavaScript chunk advisory. Backend/API lifecycle verification remains open below.

## Phase 8 - Deployment
- [ ] Production environment variables
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Database configuration
- [ ] Webhook production configuration
