# ✈ TravelMate — AI-Powered Smart Trip Planner & Booking Platform

TravelMate is a fully front-end React application that simulates a real-world travel
platform: AI-generated itineraries, arrival-aware hotel check-in optimization, package
and hotel detail pages, and a complete booking flow — all running on local dummy data
and `localStorage`, with no backend, API keys, or external services.

## Features

- **Expanded destination catalog** — 18 cities across domestic and international routes.
  Any destination without hand-authored hotel/itinerary/weather data automatically gets
  plausible fallback data generated from `src/utils/destinationHelpers.js`, so adding a
  new city to `data/destinations.js` is enough to make it fully bookable.
- **Source → destination budgeting** — the planner and homepage search both capture a
  departure city. Transport cost is estimated from the actual source/destination pair
  (`src/utils/transportCost.js`) — same-region domestic trips cost less than cross-country
  ones, and international cost scales with a distance tier — instead of a flat guess.
- **Login-based personalization** — registration collects travel style and budget-range
  preferences; the homepage destinations section highlights matching cities first for
  logged-in users, with a toggle to see everything.
- **AI Smart Trip Planner** — generates a day-wise itinerary, budget breakdown, weather
  forecast, hotel recommendation and travel tips from your preferences (deterministic
  local logic, no external AI API).
- **Arrival-Aware Trip Optimization** (TravelMate's core differentiator) — compares your
  expected arrival time against the selected hotel's standard check-in time and offers
  intelligent options: Early Check-in, Flexible Check-in, Previous-Night Booking, or
  Luggage Storage + Nearby Activity. Your choice updates Day 1 of the itinerary and the
  total budget in real time.
- **Hotel selection** — pick from 3 hotels per destination, each with ratings, amenities,
  check-in/out times and early check-in availability; selecting one updates the whole plan.
- **Destination, Package and Hotel detail pages** — full pages (not modals) with
  descriptions, attractions, day-wise package breakdowns, included/excluded services and
  transportation details.
- **Full booking flow** — "Book Entire Trip" / "Continue to Booking" opens a checkout
  modal with a summary and dummy payment method selection (UPI / Card / Net Banking).
  Confirming generates a unique booking ID (`TM-YYYY-XXXXX`) and a dedicated confirmation
  page with a "Download Confirmation" print action.
- **My Trips** — booked trips persist in `localStorage`, grouped into Upcoming, Ongoing,
  Completed and Cancelled tabs, each expandable to show the full itinerary and budget.
  Bookings can be cancelled with a confirmation modal. The navbar shows a live
  "My Trips (N)" count (Upcoming + Ongoing).
- **Trip tracking** — once a trip's dates arrive, the traveller confirms they've reached
  the destination ("Confirm I've Reached [City]"), which moves the booking to "Ongoing".
  From there, each day of the itinerary has its own check-in button (unlocked one at a
  time, in order) to monitor the traveller daily; once every day is checked in, the trip
  automatically moves to "Completed". This is a manual, traveller-driven monitoring flow
  (there's no backend to poll dates automatically), which keeps it honest about what a
  pure front-end app can actually do.
- **Mock authentication** — register/login with `localStorage`-backed accounts; bookings
  are scoped per user.
- **Custom 404 page** for unknown routes.

## Tech Stack

- **React 19** + **Vite** — fast dev server and build
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — utility-first styling
- **React Router DOM** — client-side routing
- **Framer Motion** — page/section animations and micro-interactions
- **React Icons** — icon set (Font Awesome / Hi)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Available Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/planner` | AI Smart Trip Planner (arrival-aware) |
| `/my-trips` | My Trips (Upcoming / Completed / Cancelled) |
| `/destinations/:id` | Destination details |
| `/packages/:id` | Package details |
| `/hotels/:id` | Hotel details |
| `/booking/:id` | Booking confirmation |
| `/login`, `/register` | Mock authentication |
| `*` | 404 page |

## Project Structure

```
src/
  assets/            static images/icons
  components/
    common/          Navbar, Footer, Button, Modal, Loader, AuthLayout
    home/            Hero, SearchCard, DestinationCard, FeatureCard,
                      PackageCard, TestimonialCard
    planner/         PlannerForm, ArrivalCheckInCard, AIRecommendation,
                      WeatherCard, HotelCard, BudgetCard, ItineraryCard,
                      RecommendationCard
    booking/         BookingSummary, BookingModal, BookingConfirmation
    trips/           TripCard, EmptyTrips
  context/
    AuthContext.jsx      mock login/register/session, localStorage-backed
    BookingsContext.jsx  booking lifecycle (create/cancel/get), localStorage-backed
  data/              destinations, packages, hotels, testimonials, weather,
                      itinerary/itineraries (activity bank)
  hooks/             useScrollToTop
  utils/             generateTrip (AI simulation), arrivalLogic
                      (check-in optimization), bookingUtils (ID generation),
                      motionVariants
  pages/
    Home.jsx, TripPlanner.jsx, MyTrips.jsx, DestinationDetails.jsx,
    PackageDetails.jsx, HotelDetails.jsx, BookingConfirmation.jsx,
    Login.jsx, Register.jsx, NotFound.jsx
  App.jsx, main.jsx, styles/index.css
```

## How the "AI" works

There is no external AI API call. `src/utils/generateTrip.js` deterministically builds a
realistic trip plan (itinerary, budget split, hotel pick, weather, attractions, tips) from
the dummy data in `src/data/`, based on the destination, budget, day count, interests,
arrival time and selected hotel/check-in strategy. Swapping this for a real LLM/API call
later only requires replacing the body of `generateTrip()`.

## How Arrival-Aware Trip Optimization works

1. The planner compares the traveller's arrival time (`src/utils/arrivalLogic.js`) against
   the selected hotel's standard check-in time.
2. If arrival is earlier, up to four options are shown: **Early Check-in** (if the hotel
   supports it, for a fee), **Flexible Check-in** (later, free), **Previous-Night Booking**
   (guarantees the room, costs one extra night), and **Luggage Storage + Nearby Activity**
   (free, keeps standard check-in time but lets you start sightseeing immediately).
3. Selecting an option regenerates the trip: Day 1's timeline shifts to reflect the chosen
   check-in time, and the budget's "Early Check-in Fee" line updates accordingly.

## How localStorage is used

- `travelmate_users` / `travelmate_session` — mock accounts and the active session (`AuthContext.jsx`).
- `travelmate_bookings` — all bookings across all users, each tagged with an `ownerId` so
  a user only sees their own trips; a shared `"guest"` bucket is used when logged out
  (`BookingsContext.jsx`).

## Future backend integration suggestions

- Replace `generateTrip()` with a call to a real LLM or itinerary API, keeping the same
  return shape so no UI changes are required.
- Replace `AuthContext` and `BookingsContext`'s localStorage calls with real API/database
  calls (e.g. REST or GraphQL), keeping the same context API surface (`login`, `register`,
  `createBooking`, `cancelBooking`, etc.).
- Replace static hotel/destination/package data with live inventory from a travel API.
- Replace the dummy payment method selector with a real payment gateway integration.

## Notes

- All images are royalty-free Unsplash URLs.
- All data is static/dummy — no network requests are made besides loading images and the
  Google Font.
