# Nova Finish Plan

## Phase 1 - Security
- [x] Prevent role escalation
- [x] Verify authorization across protected resources

Completed: public registration forces `CUSTOMER`; customers cannot change their role; the admin-only user creation/update path can assign roles. Protected route guards and owner checks were reviewed. Owner comparisons now compare MongoDB ObjectId values, so customers can act on their own records. Database-backed checks confirmed customer/admin user operations and denials. Product/settings/user administration is admin-gated; homepage stats and catalog/review reads are public in the current routes. HTTP middleware denials were reviewed from route setup but not exercised through live HTTP requests. Review update handling remains unfinished for Phase 5.

## Phase 2 - Orders
- [x] Repair order creation
- [x] Inventory reservation
- [x] Cancellation
- [x] Verify MongoDB transaction support

Completed: order items use database product snapshots and store settings. Conditional stock reservation, order save, cancellation stock restoration, and status transition run in transactions. Atlas topology probe confirmed a replica set with logical sessions. Database-backed checks passed for successful ordering, insufficient stock, injected save failure rollback, concurrent cancellation, and repeated cancellation. Concurrent order-reservation stress testing and the API-level flow were not performed. The backend has no cart model/service, so it accepts submitted cart items and does not clear a persisted server cart.

## Phase 3 - Payments
- [x] Checkout
- [x] Stripe payment creation
- [x] Stripe webhook
- [x] Payment status transitions
- [x] Failed payment handling
- [x] Successful payment handling
- [x] Prevent duplicate payment processing

Completed: checkout creates orders from cart IDs and quantities, initiates Stripe Embedded Checkout using server order totals, and clears the browser cart only after the server reports `PAID`. Payment rows are unique per order; retries reuse the same Stripe session. Signed webhook events verify order/payment metadata and amount/currency, keep order and payment status separate, and make paid/failed/expired transitions idempotent. Failed/expired sessions cancel the unpaid order and restore inventory once. Atlas + Stripe test-mode checks passed for session creation, amount, initiation retry, signed success/expiry/failure payloads, duplicate events, mismatch rejection, and stock restoration. No card charge was made. Frontend lint and backend syntax checks passed. Browser checkout was not exercised because `client/.env` has no `VITE_STRIPE_PUBLISHABLE_KEY`; the frontend build remains blocked by the installed Tailwind native binding and Windows `spawn EPERM`. Webhook events were signed and verified locally with the configured test secret, not delivered by Stripe over HTTP.

## Phase 4 - User experience
- [x] Order history
- [x] Admin product management
- [x] Admin dashboard
Admin product management completed: replaced the static inventory sample with an admin-only list and create/edit/delete controls backed by the existing protected product API. The form covers bilingual fields, price, stock, currency, activation, and optional image upload. Atlas service checks passed for product create/update/list/delete, and client lint passed. HTTP multipart image upload and live route authorization were not exercised; the existing route middleware protects these writes.
Order history completed: the existing authenticated endpoint now returns newest-first paginated results, and the page displays item snapshots, date, order/payment states, and totals with sign-in, loading, error, retry, and empty states. Atlas verification confirmed customer scoping and page metadata; client lint and backend syntax checks passed. Browser rendering was not verified because the frontend build is currently blocked by its native Tailwind binding environment issue.

Admin dashboard completed: replaced fabricated revenue/conversion/category/order samples with an admin-only summary of order, product, active-product, and customer counts; paid revenue grouped by currency; and recent orders. The existing public homepage stats route and response remain unchanged. Atlas + local HTTP checks passed for paid-only revenue, metrics, anonymous/customer denials, admin access, and public stats compatibility. Client lint and backend syntax checks passed. Browser rendering was not verified because the frontend build is blocked by the current Tailwind native binding environment issue.
## Phase 5 - Reviews and validation
- [x] Review updates
Review update API completed: implemented the existing authenticated PUT handler and fixed its service/validator wiring. Only the review owner can change `rating` and `comment`; other fields, out-of-range/non-integer ratings, and comments over 225 characters are rejected. The related add-review duplicate lookup now uses `findOne`, with the same rating/comment validation. Atlas and local HTTP checks passed for create, duplicate prevention, owner update, non-owner/anonymous denial, response format, and invalid input rejection. Client lint and backend syntax checks passed. No review editing UI existed, so browser-level review editing was not verified.- [x] Product partial updates
Product partial updates completed: update validation now accepts only supported product fields, validates supplied scalar/nested values, merges language subfields without replacing omitted translations, rejects mass-assignment fields, and saves/returns the updated document. Atlas + local HTTP checks passed for stock-only and nested-language patches, preserved fields, saved response data, customer authorization, and invalid/unsupported inputs. Backend syntax and diff checks passed.- [ ] User partial updates

## Phase 6 - Frontend
- [ ] Repair build environment
- [ ] Shop API integration
- [ ] Homepage API integration
- [ ] Cart
- [ ] Wishlist
- [ ] Checkout
- [ ] Loading/error/empty states
- [ ] RTL/i18n
- [ ] Responsive UI

## Phase 7 - Verification
- [ ] Backend tests
- [ ] Frontend build
- [ ] API smoke tests
- [ ] Authentication flow
- [ ] Order lifecycle
- [ ] Payment lifecycle

## Phase 8 - Deployment
- [ ] Production environment variables
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Database configuration
- [ ] Webhook production configuration
