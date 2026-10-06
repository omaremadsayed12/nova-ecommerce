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
- [ ] Checkout
- [ ] Stripe payment creation
- [ ] Stripe webhook
- [ ] Payment status transitions
- [ ] Failed payment handling
- [ ] Successful payment handling
- [ ] Prevent duplicate payment processing

## Phase 4 - User experience
- [ ] Order history
- [ ] Admin product management
- [ ] Admin dashboard

## Phase 5 - Reviews and validation
- [ ] Review updates
- [ ] Product partial updates
- [ ] User partial updates

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
