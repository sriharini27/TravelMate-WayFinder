import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import bookingService from '../services/bookingService.js'
import paymentService from '../services/paymentService.js'
import { apiErrorMessage } from '../services/api.js'

const BookingsContext = createContext(null)

// Only a transient "a demo payment was left mid-flight" marker lives in
// localStorage, purely so a page refresh degrades gracefully (see Feature 9
// in the project brief). Bookings and payments themselves are never read
// from or written to localStorage — MongoDB (via the API) is the only
// source of truth for them now.
const PENDING_PAYMENT_KEY = 'travelmate_pending_payment'

function getPendingPayment() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_PAYMENT_KEY)) || null
  } catch {
    return null
  }
}
function savePendingPayment(pending) {
  if (pending) localStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(pending))
  else localStorage.removeItem(PENDING_PAYMENT_KEY)
}

export function BookingsProvider({ children }) {
  const { user, ready: authReady } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingPayment, setPendingPayment] = useState(() => getPendingPayment())

  const refreshBookings = useCallback(async () => {
    if (!user) {
      setBookings([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const items = await bookingService.myBookings()
      setBookings(items)
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't load your trips — please try again."))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authReady) return
    refreshBookings()
  }, [authReady, refreshBookings])

  const startPendingPayment = (draft) => {
    const record = { ...draft, startedAt: new Date().toISOString() }
    savePendingPayment(record)
    setPendingPayment(record)
    return record
  }
  const updatePendingPayment = (patch) => {
    setPendingPayment((prev) => {
      const next = prev ? { ...prev, ...patch } : null
      savePendingPayment(next)
      return next
    })
  }
  const clearPendingPayment = () => {
    savePendingPayment(null)
    setPendingPayment(null)
  }

  /**
   * Runs the demo payment simulation against the backend. A booking is only
   * ever created server-side when outcome === 'success' — see
   * POST /api/payments/simulate. Mirrors the old synchronous
   * BookingsContext.createBooking, just backend-backed now.
   */
  const simulatePayment = async ({ amount, paymentMethod, outcome, bookingDraft, offer = null }) => {
    const { payment, booking } = await paymentService.simulate({ amount, paymentMethod, outcome, bookingDraft, offer })
    if (booking) {
      setBookings((prev) => [booking, ...prev])
      clearPendingPayment()
    }
    return { payment, booking }
  }

  const cancelBooking = async (id) => {
    const updated = await bookingService.cancel(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  const confirmArrival = async (id) => {
    const updated = await bookingService.confirmArrival(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  const checkInDay = async (id, day) => {
    const updated = await bookingService.checkInDay(id, day)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  // Looks in the already-loaded list first (instant for My Trips / booking
  // cards); falls back to a direct API call for a fresh page load on
  // /booking/:id. Returns a promise either way — callers should treat this
  // as async (see pages/BookingConfirmation.jsx).
  const getBooking = async (id) => {
    const local = bookings.find((b) => b.id === id || b.bookingId === id)
    if (local) return local
    try {
      return await bookingService.getBooking(id)
    } catch {
      return null
    }
  }

  const activeCount = bookings.filter((b) => b.bookingStatus === 'Upcoming' || b.bookingStatus === 'Ongoing').length

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        loading,
        error,
        refreshBookings,
        simulatePayment,
        cancelBooking,
        confirmArrival,
        checkInDay,
        getBooking,
        activeCount,
        pendingPayment,
        startPendingPayment,
        updatePendingPayment,
        clearPendingPayment,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingsContext)
  if (!ctx) throw new Error('useBookings must be used within a BookingsProvider')
  return ctx
}
