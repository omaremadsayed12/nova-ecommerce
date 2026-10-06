# Nova — Project Instructions

## Project

Nova is a MERN ecommerce application.

Root:
- server/
- client/

Backend:
- Node.js
- Express
- MongoDB
- Mongoose

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- i18next
- Framer Motion

## Architecture

Backend follows:

routes
→ controllers
→ services
→ models

Validation is handled at the HTTP/service boundary using the existing validators.

Errors use the existing AppError subclasses and centralized error handling.

Frontend follows:

pages
→ components
→ services
→ API

Do not introduce a new architecture unless the existing architecture cannot reasonably support the requirement.

## API conventions

Successful response:

{
  "success": true,
  "message": "...",
  "data": {},
  "error": null,
  "meta": null
}

Errors:

{
  "success": false,
  "message": "...",
  "data": null,
  "error": {
    "code": "...",
    "message": "...",
    "details": null
  },
  "meta": null
}

## Important rules

- Do not rewrite working features unnecessarily.
- Prefer the smallest correct change.
- Do not add dependencies without justification.
- Do not modify unrelated files.
- Preserve existing API contracts unless there is a clear bug.
- Inspect existing code before implementing.
- Run available checks after changes.
- Never claim something was tested if it was not actually tested.
- Report limitations explicitly.
- Do not move logic between layers without a reason.
- Do not create global React Context for server data unless there is a demonstrated need.
- URL query parameters are the source of truth for Shop filters.
- Product filtering, sorting and pagination belong on the backend.
- Product ratings are derived from Reviews.
- Order status and paymentStatus are separate concepts.
- Never trust prices, tax, shipping, totals, roles, or payment status supplied by the client.