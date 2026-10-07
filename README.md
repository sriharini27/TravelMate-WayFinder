# TravelMate — MERN Edition

TravelMate is an AI-assisted trip planner with arrival-aware scheduling, day-by-day
exploration tracking and a demo payment flow. This version integrates the original
React/Vite frontend with a full MongoDB + Express + Node backend — **the existing
frontend was preserved and extended, not rebuilt.**

> This is an **integration**, not a rewrite: the original UI, design, AI trip
> generator, arrival-aware planning logic and demo payment simulation all work
> exactly as before. They are now backed by MongoDB and real authentication
> instead of localStorage.

---

## 1. What was already present (before this integration)

- React + Vite + Tailwind frontend, fully designed and working
- AI trip planner (`generateTrip.js`) producing a day-wise itinerary from budget/interests/dates
- Arrival-aware planning (standard/early/flexible check-in, previous-night booking, luggage storage, nearby activity)
- Destination / hotel / package browsing pages
- A demo payment simulation (Pending → Processing → Successful/Failed)
- Day-by-day exploration tracking (Confirm Arrival → mark days explored → Trip Completed)
- All data (destinations, hotels, packages, itineraries, weather) and all bookings lived only in `localStorage`
- No backend, no real authentication, no database

## 2. What was added in this integration

- A complete Node/Express/MongoDB backend (`backend/`) with a proper
  `config / controllers / middleware / models / routes / services / seeds` structure
- Real authentication: email+password (bcrypt) **and** Google OAuth, with JWT
  access tokens (in-memory on the client) + httpOnly refresh-token cookies, rotated on use
- Role-based authorization (`user` / `admin`) enforced on the backend and mirrored on the frontend
- MongoDB collections replacing every frontend data file as the source of truth
  (destinations, hotels, rooms, packages, offers, itineraries now come from the API)
- A documented seed script creating realistic data **and** 5 test users + 1 admin
- The booking flow rebuilt on top of REST APIs (Trip Planner → Booking → Payment →
  Booking Confirmation → My Trips), persisted in MongoDB, still using the same
  three-status model (`paymentStatus`, `bookingConfirmationStatus`, `bookingStatus`)
- The demo payment simulation kept exactly as a simulation, but every attempt is now
  recorded as a `Payment` document, and a `Booking` is only ever created after a
  **successful** simulated payment (enforced atomically in the payment controller)
- A full Admin Dashboard: stats, and CRUD for destinations/hotels/packages/offers,
  user role management, and booking oversight
- "Recently Accessed" tracking for destinations/hotels/packages, backed by MongoDB
- A Wishlist feature (heart-icon toggle on every detail page + a `/wishlist` page)
- Reviews connected to MongoDB, shown on destination pages and as homepage testimonials
- A rule-based "TravelMate Assistant" chatbot (floating widget, bottom-right) — a
  keyword-matched knowledge base, **not** a generative AI, and never claims to be one
- Multilingual UI (English / Tamil / Hindi) via i18next, with a language switcher in the navbar
- A frontend API service layer (`frontend/src/services/*.js`) replacing scattered fetch calls
- Centralized error handling on both sides, with no stack traces ever sent to the client

## 3. Project structure

```
TravelMate-SmartJourney/
├── frontend/                      # React + Vite frontend (the original app, extended)
│   └── src/
│       ├── components/          # UI components (admin/, chatbot/, reviews/, common/, booking/, home/, trips/)
│       ├── context/              # AuthContext, BookingsContext, CatalogContext
│       ├── data/                 # Mutable data-store modules, populated from the API at startup
│       ├── hooks/
│       ├── i18n/                 # en / ta / hi translations
│       ├── pages/                 # incl. pages/admin/*
│       ├── services/              # one file per API resource
│       └── utils/
├── backend/                      # Node + Express + MongoDB backend
│   ├── config/                  # db.js, passport.js
│   ├── controllers/
│   ├── middleware/               # auth.js, errorHandler.js
│   ├── models/                  # 13 Mongoose models
│   ├── routes/
│   ├── seeds/                   # seed.js + seeds/data/*
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example                 # see backend/.env.example — copy to backend/.env
└── README.md
```

## 4. Files modified (existing frontend files changed to call the backend)

- `src/context/AuthContext.jsx` — rewritten to call the backend auth API (JWT + refresh), no localStorage auth
- `src/context/BookingsContext.jsx` — rewritten to call the booking/payment API instead of localStorage
- `src/data/{destinations,hotels,packages,itinerary,weather}.js` — converted into mutable
  stores populated from the API at startup (so `generateTrip.js`, `destinationHelpers.js`
  and `proximity.js` kept working unchanged)
- `src/components/booking/BookingModal.jsx` — now calls the async `simulatePayment` API
- `src/pages/BookingConfirmation.jsx`, `src/pages/MyTrips.jsx` — async, API-backed, with loading/error states
- `src/pages/Login.jsx`, `src/pages/Register.jsx` — async submit + "Continue with Google" + i18n
- `src/pages/{PackageDetails,DestinationDetails,HotelDetails}.jsx` — added WishlistButton,
  recently-accessed recording, and (on DestinationDetails) the ReviewsSection
- `src/pages/Home.jsx` — homepage testimonials now come from `GET /api/reviews/featured`
  instead of the old `data/testimonials.js`; added the "Recently Viewed" section
- `src/components/common/Navbar.jsx` — added language switcher, Wishlist link, Admin
  Dashboard link (admins only), full i18n translation
- `src/main.jsx` — initializes i18next
- `src/App.jsx` — wraps the app in `CatalogProvider`, adds `/oauth/callback`, `/wishlist`
  (protected), `/my-trips` (protected) and all `/admin/*` routes (admin-only), mounts the chatbot widget

## 5. Files created

**Backend** — `backend/` in full: `config/db.js`, `config/passport.js`,
`utils/{tokens,generateIds,toJSONPlugin}.js`, `middleware/{auth,errorHandler}.js`,
13 models in `models/`, controllers + routes for every resource below, `seeds/seed.js`
and `seeds/data/*`, `app.js`, `server.js`, `package.json`, `.env.example`.

**Frontend** — `src/services/*.js` (API layer), `src/context/CatalogContext.jsx`,
`src/components/common/{ProtectedRoute,WishlistButton}.jsx`,
`src/components/admin/AdminLayout.jsx`, `src/pages/admin/*.jsx` (Dashboard, Users,
Bookings, Destinations, Hotels, Packages, Offers, ResourceCrud),
`src/pages/{OAuthCallback,Wishlist}.jsx`, `src/components/reviews/ReviewsSection.jsx`,
`src/components/chatbot/ChatbotWidget.jsx`, `src/components/home/RecentlyAccessedSection.jsx`,
`src/hooks/useRecordAccess.js`, `src/i18n/index.js`.

## 6. MongoDB collections

`User`, `Destination`, `Hotel`, `Room`, `Package`, `Offer`, `Itinerary`, `Booking`,
`Payment`, `Review`, `Wishlist`, `RecentlyAccessed`, `ChatHistory`.

## 7. API endpoints

All routes are mounted under `/api`. 🔒 = requires a valid JWT (`Authorization: Bearer <token>`). 👑 = also requires `role: admin`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | — | Create an account (bcrypt-hashed password) |
| POST | `/auth/login` | — | Email+password login |
| POST | `/auth/refresh` | cookie | Rotate the refresh-token cookie for a new access token |
| POST | `/auth/logout` | — | Revoke the current refresh token |
| GET | `/auth/me` | 🔒 | Current user profile |
| GET | `/auth/google` | — | Start Google OAuth |
| GET | `/auth/google/callback` | — | Google OAuth callback → redirects with a JWT |
| PUT | `/users/me` | 🔒 | Update name / profile picture / preferences |
| GET | `/destinations` | — | List destinations (search/filter/pagination) |
| GET | `/destinations/by-name/:name` | — | Lookup by name |
| GET/POST/PUT/DELETE | `/destinations/:id` | 👑 for write | CRUD |
| GET/POST/PUT/DELETE | `/hotels`, `/hotels/:id` | 👑 for write | CRUD |
| GET/POST/PUT/DELETE | `/rooms`, `/rooms/:id` | 👑 for write | CRUD |
| GET/POST/PUT/DELETE | `/packages`, `/packages/:id` | 👑 for write | CRUD |
| GET/POST/PUT/DELETE | `/offers`, `/offers/:id` | 👑 for write | CRUD |
| GET | `/itineraries`, `/itineraries/by-destination/:name` | — | Attractions/tips/activities bank |
| POST | `/bookings` *(via `/payments/simulate`, see below)* | 🔒 | A booking is only ever created after a successful simulated payment |
| GET | `/bookings/my` | 🔒 | The signed-in user's bookings |
| GET | `/bookings` | 👑 | All bookings (admin) |
| GET | `/bookings/:id` | 🔒 | One booking (owner or admin) |
| PUT | `/bookings/:id/cancel` | 🔒 | Cancel a booking |
| PUT | `/bookings/:id/confirm-arrival` | 🔒 | Begin day-by-day exploration tracking |
| PUT | `/bookings/:id/check-in-day` | 🔒 | Mark a day explored |
| DELETE | `/bookings/:id` | 👑 | Remove a booking |
| POST | `/payments/simulate` | 🔒 | Run the demo payment simulation; records a `Payment`, and on `success` atomically creates the `Booking` |
| GET | `/payments/my` | 🔒 | The signed-in user's payments |
| GET | `/payments` | 👑 | All payments (admin) |
| GET | `/recently-accessed` | 🔒 | Last 10 viewed destinations/hotels/packages |
| POST | `/recently-accessed` | 🔒 | Record a view |
| GET | `/reviews` | — | Reviews, optionally filtered by `?destination=` |
| GET | `/reviews/featured` | — | Top-rated reviews for the homepage |
| POST | `/reviews` | 🔒 | Submit a review |
| DELETE | `/reviews/:id` | 🔒 | Delete own review (or any, as admin) |
| GET | `/wishlist` | 🔒 | The signed-in user's wishlist |
| POST | `/wishlist` | 🔒 | Add/update a wishlist item |
| DELETE | `/wishlist/:id` | 🔒 | Remove a wishlist item |
| POST | `/chatbot` | optional | Ask the rule-based TravelMate Assistant |
| GET | `/admin/stats` | 👑 | Dashboard stats |
| GET | `/admin/users` | 👑 | List users |
| PUT | `/admin/users/:id/role` | 👑 | Promote/demote a user |
| DELETE | `/admin/users/:id` | 👑 | Delete a user |
| GET | `/health` | — | Health check |

## 8. Authentication implementation

- Passwords hashed with **bcrypt** (`User` model pre-save hook); never returned in any API response
- **JWT access tokens** (15 min) issued on login/register/refresh/Google OAuth, kept
  **in memory only** on the client (never localStorage) — see `frontend/src/services/api.js`
- **Refresh tokens** (7 days) stored as an **httpOnly, sameSite** cookie scoped to
  `/api/auth`, hashed server-side, and rotated on every use; a silent refresh on app
  load keeps the user logged in across page refreshes without ever persisting a token client-side
- An axios response interceptor transparently retries a request once after a
  successful silent refresh on a `401`, and logs the user out cleanly if the refresh itself fails
- **Google OAuth** via Passport (`passport-google-oauth20`): `GET /api/auth/google` →
  Google consent → `GET /api/auth/google/callback` → a JWT session is issued and the
  browser is redirected to `${CLIENT_URL}/oauth/callback?accessToken=...`, which
  `OAuthCallback.jsx` picks up
- **Role-based authorization**: `protect` middleware validates the JWT; `adminOnly`
  additionally requires `role: 'admin'`. The same check is mirrored on the frontend
  via `AdminRoute` so non-admins never even see the admin UI, but the real
  enforcement is always on the backend.

## 9. Admin functionality

Visit `/admin` while signed in as an admin account (see credentials below). Includes:

- **Dashboard** — total users, total/confirmed/cancelled bookings, completed trips,
  total payments collected, most popular destinations, recently created users and bookings
- **Users** — list all users, promote/demote role, delete a user
- **Bookings** — view all bookings across all users
- **Destinations / Hotels / Packages / Offers** — full create/edit/delete via a shared
  generic CRUD UI (`AdminResourceCrud.jsx`) backed by the matching REST endpoints

## 10. Environment variables

Copy `backend/.env.example` to `backend/.env` and fill in real values — **never commit
the real `.env` file or real secrets.**

| Variable | Purpose |
|---|---|
| `PORT` | Backend port (default 5000) |
| `MONGODB_URI` | Your MongoDB connection string (local or Atlas) |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random strings — generate your own |
| `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES` | Token lifetimes (defaults: `15m` / `7d`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | From Google Cloud Console (optional — email/password login works without these) |
| `CLIENT_URL` | Frontend origin, for CORS + OAuth redirect (default `http://localhost:5173`) |
| `SEED_PASSWORD` | Password assigned to the 5 seeded test accounts + admin (never shown in the frontend) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `MAIL_FROM` | Email ticket delivery (Nodemailer). Leave blank to disable email — ticket download and everything else keeps working |
| `GOOGLE_PLACES_API_KEY` | Optional — if set, attractions can additionally be validated against Google Places. If blank, the app uses its own curated/verified attraction database and works exactly the same |

The frontend reads `VITE_API_URL` (default `http://localhost:5000`) — create a
`frontend/.env` with `VITE_API_URL=http://localhost:5000` if your backend runs elsewhere.

## 11. How to run

### Backend

```bash
cd server
cp .env.example .env     # then fill in MONGODB_URI at minimum
npm install
npm run seed              # populates MongoDB with realistic data + test accounts
npm run dev                # starts the API on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev                # starts the app on http://localhost:5173
```

Open `http://localhost:5173`. Email/password login and registration work immediately;
Google sign-in works once you've filled in the Google OAuth variables above.

### Seeding MongoDB

```bash
cd server
npm run seed            # creates destinations, hotels, rooms, packages, itineraries, offers, reviews, and the accounts below
npm run seed:destroy    # wipes the seeded data (useful before re-seeding)
```

## 12. Test credentials (seeded into MongoDB only — never shown in the frontend)

These exist solely to satisfy the "at least 5 real user accounts" course requirement.
There is no login picker, quick-login button or credential hint anywhere in the UI —
the login page requires real authentication, and anyone can also just Register.
Password for every account below: **`TravelMate@123`** (or whatever you set `SEED_PASSWORD` to in `backend/.env`).

| Role | Email |
|---|---|
| User | `user1@travelmate.demo` |
| User | `user2@travelmate.demo` |
| User | `user3@travelmate.demo` |
| User | `user4@travelmate.demo` |
| User | `user5@travelmate.demo` |
| **Admin** | `admin@travelmate.demo` |

## 13. Known limitation — please verify locally

This project was built and syntax-checked in a sandboxed environment with **no
outbound access to download a real MongoDB binary**, so the API, the seed script and
the full auth/booking/payment flow could not be exercised end-to-end here — only
`node --check` on every server file and a `require()` smoke test of `app.js` were
possible. Everything above is implemented and should work as documented, but please
run `npm run seed` and `npm run dev` yourself against a real MongoDB instance (local
or a free MongoDB Atlas cluster) to confirm before grading/demoing. Google OAuth
likewise needs real credentials from the Google Cloud Console, which only you can provision.

## 14. Mentor enhancement round — dynamic itineraries, email ticket, no default users

Three later additions on top of everything above (folder renamed to
`TravelMate-SmartJourney` in this round):

**Destination-specific dynamic itineraries.** A new `Attraction` MongoDB collection
(`backend/models/Attraction.js`, seeded from `backend/seeds/data/attractions.js`) holds
only real, verified tourist attractions — 108 of them across all 18 destinations,
each tagged with a category (History, Nature, Beach, Adventure, Food, Shopping,
Culture, Religious, Landmark, Family, Nightlife). The itinerary generator
(`frontend/src/utils/generateTrip.js`) now selects only from this verified pool —
never an invented place — using a controlled, seeded shuffle
(`frontend/src/utils/seededRandom.js`) keyed on `userId + destination + interests +
days + travellers + budget + arrivalTime + transport + generationCount`. Two users
requesting the same destination get different, interest-matched, valid itineraries;
the same user's plan stays stable until they explicitly click "Generate AI Trip"
again (selecting a hotel or arrival strategy recalculates cost/timing with the same
seed, so the plan on screen never reshuffles underneath them). Arrival-aware
planning (standard/early/flexible check-in, previous-night booking, luggage
storage, budget math) is untouched. A `GOOGLE_PLACES_API_KEY` env var is wired in
for future live validation but is optional — without it, the curated database is
the source of truth, as it is today.

**Email ticket delivery.** The "Download Ticket" button on the booking confirmation
page now does two real things instead of `window.print()`: `GET
/api/bookings/:id/ticket` streams a genuine backend-generated PDF (via PDFKit —
`backend/utils/generateTicketPdf.js`) for download, and `POST
/api/bookings/:id/send-ticket` emails that same PDF (via Nodemailer —
`backend/services/emailService.js`) to the user's **registered MongoDB email**,
never a frontend-supplied one. The UI shows "✓ Ticket downloaded successfully" and
"✓ Ticket sent to your registered email: s\*\*\*\*@gmail.com" (masked), or a
"downloaded, but email failed — Retry" message if SMTP isn't configured or sending
fails — email failure never invalidates the booking. The button disables itself
and shows "Sending ticket…" while in flight to avoid duplicate sends.

**No default users in the frontend.** The login and register pages never contained
quick-login buttons or visible credentials — verified again in this round. The 5
test accounts the course requires still exist (see section 12), created only by
`backend/seeds/seed.js`, documented only here and in the seed script's console
output, never in any React source file.

## 15. Admin/normal-user separation + destination+category offer matching

A third enhancement round, on top of section 14, covering three requests: a fully
separate admin interface, an itinerary-category-aware offer system, and an
offers-before-payment booking step. No existing feature listed in sections 1–14 was
rebuilt, redesigned, or removed — these are additive changes only.

### 15.1 Admin interface is now fully separate from the normal user experience

- **Login/OAuth redirect by role.** `AuthContext.login()` / `loginWithAccessToken()`
  now also return the resolved `user` object. `pages/Login.jsx` and
  `pages/OAuthCallback.jsx` use it to send an admin straight to `/admin` on success —
  never the normal homepage — while normal users continue to the normal experience
  exactly as before.
- **Admin can no longer reach normal-user routes.** A new `UserOnlyRoute` guard
  (`components/common/ProtectedRoute.jsx`) redirects a logged-in admin to `/admin`
  if they land on `/`, `/planner`, `/my-trips`, `/wishlist`,
  `/destinations/:id`, `/packages/:id`, `/hotels/:id` or `/booking/:id` (via
  `App.jsx`) — including by typing the URL directly. Normal users and logged-out
  visitors are unaffected.
- **Normal Navbar never renders for an admin.** `components/common/Navbar.jsx` now
  returns `null` immediately when `user.role === 'admin'` — on top of the existing
  design, where admin pages already only ever render `AdminLayout`, never `Navbar`.
- **Admin profile menu replaced.** `components/admin/AdminLayout.jsx` previously had
  no logout control at all (admins logged out via the normal Navbar, reached through
  a "← Back to TravelMate" link). That link and the logo's link to `/` have been
  removed; a new header dropdown now shows the admin's name/email plus exactly two
  items — **Admin Dashboard** and **Logout** — matching the required format, with no
  path back into the normal UI short of logging out.
- **Backend already enforced this correctly.** `backend/routes/adminRoutes.js` applies
  `protect` + `adminOnly` to every `/api/admin/*` route, and `offerRoutes.js` /
  other resource routes already gate mutations the same way — confirmed, not
  changed, since frontend routing alone was never relied on for security.

### 15.2 Offers now match destination AND itinerary/activity category

- **`Offer` model extended** (`backend/models/Offer.js`) with `applicableCategories`
  (reuses the exact `Attraction.category` enum — History/Culture/Nature/Beach/
  Adventure/Food/Shopping/Family/Nightlife/Religious/Landmark), `minimumAmount`, and
  `validFrom`. An empty `applicableCategories` array behaves like the existing
  `destination: ''` convention — "no restriction" — so older offers keep working;
  tagging an offer with categories is what makes it category-scoped.
- **`GET /api/offers/applicable`** (new `getApplicable` handler in
  `backend/controllers/offerController.js`, added to the existing `crudFactory`
  export exactly like `attractionController.js`'s `getByDestination`) takes
  `destination`, `categories` (comma-separated) and `totalAmount`, and returns only
  offers that are active, within their validity window, destination-matching (or
  global), category-overlapping (or unrestricted), and amount-eligible. Route
  registered in `offerRoutes.js` before `/:id` to avoid an Express path collision.
- **Trip → categories.** `frontend/src/utils/generateTrip.js` now carries the
  planner's selected `interests` through on the returned trip object, and exports
  `interestsToCategories()` to translate them into the same category vocabulary —
  reusing the existing `INTEREST_TO_CATEGORY` map rather than building a second
  tagging system.
- **Admin Offers page extended** (`pages/admin/AdminOffers.jsx`) with fields for
  Applicable Categories (comma-separated), Minimum Amount, Valid From and an
  Active/inactive checkbox — the generic `AdminResourceCrud` component gained
  checkbox-field support to render it, reused as-is by every other resource screen.
- **Seed data**: `backend/seeds/data/offers.js` now includes a `Rishikesh Adventure
  Offer` (Adventure/Nature) and a `Paris Shopping Offer` (Shopping) as concrete,
  testable examples of correct category matching, plus categories added to the
  pre-existing offers.

### 15.3 Offers are shown and applied before payment, and the discount is real

- **New flow:** Trip Planner/Package → *Book Ticket* → **Check Applicable
  Offers** → user applies one or continues without → Booking Summary (now
  showing Original/Discount/Final when an offer is applied) → Payment → Booking
  Confirmation. Implemented as a new `'offers'` step in
  `components/booking/BookingModal.jsx` (before the existing `'summary'`/`'payment'`
  steps) and a new `components/booking/OfferSelection.jsx` card, built from the
  existing Button/card styling — no new design system.
- Booking is **never blocked**: "No offers are currently available for this trip."
  with a "Continue to Booking" action covers the empty case; "Continue Without
  Offer" is always available even when offers exist.
- **Discount is verified server-side, not trusted from the client.** `POST
  /api/payments/simulate` (`backend/controllers/paymentController.js`) now takes an
  optional `offer: { offerId }`, re-fetches that `Offer` from MongoDB, re-checks it's
  still active/in-window/above its minimum amount, and computes
  `discountAmount`/`finalAmount` itself. The amount actually charged (`Payment.amount`,
  used for the admin dashboard's "Payments Collected" stat) and the amount stored on
  the booking (`Booking.totalAmount`/`amountPaid`) are **always this server-verified
  final amount** — never the original, pre-discount trip total — whenever an offer
  was applied.
- **`Booking` model extended** with `offerId`, `offerCode`, `discountPercent`,
  `discountAmount`, `originalAmount`, `finalAmount`, all persisted by
  `simulatePayment` on a successful booking.
- **Booking Confirmation, My Trips and the Admin dashboard all reflect this**:
  `BookingConfirmation.jsx` shows Original Amount / Offer Applied / Discount / Final
  Amount Paid when an offer was used; `components/trips/TripCard.jsx` shows the same
  summary on each trip card in My Trips (still normal-user-only, still unreachable by
  an admin account — see 15.1); `adminController.getStats`'s `paymentTotal` needed no
  code change since it already sums `Payment.amount`, which now holds the discounted
  figure automatically.

### 15.4 What to verify when testing this round

- Log in as `admin@travelmate.demo` → should land on `/admin` directly; typing
  `/planner`, `/my-trips`, `/`, etc. in the address bar should bounce back to
  `/admin`; the only header menu items should be Admin Dashboard + Logout.
- Log in as a normal test user → unaffected: full Home/Destinations/Packages/
  Planner/About/Contact/My Trips/Wishlist navigation and dropdown as before.
- Plan a Rishikesh trip with "Adventure" selected as an interest, click Book Ticket
  → the Rishikesh Adventure Offer (and any global/unrestricted offers) should
  appear; a Paris-only or Shopping-only offer should not. Apply the offer and
  confirm the displayed Original/Discount/Final amounts match
  `original − (original × discountPercent / 100)`, and that the same final amount
  appears in Payment, Booking Confirmation, My Trips and (as an admin) the Payments
  Collected dashboard stat.
