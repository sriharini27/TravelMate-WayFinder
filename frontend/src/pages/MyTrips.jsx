import { useMemo, useState } from 'react'
import { FaSuitcaseRolling, FaExclamationTriangle, FaHourglassHalf, FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Modal from '../components/common/Modal.jsx'
import Button from '../components/common/Button.jsx'
import Loader from '../components/common/Loader.jsx'
import TripCard from '../components/trips/TripCard.jsx'
import EmptyTrips from '../components/trips/EmptyTrips.jsx'
import { useBookings } from '../context/BookingsContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { apiErrorMessage } from '../services/api.js'
import useScrollToTop from '../hooks/useScrollToTop.js'

// Canonical English values — these match booking.bookingStatus from the API
// and must never be translated; only their displayed label is localized
// (see tabLabel() below).
const tabs = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']
const TAB_LABEL_KEYS = {
  Upcoming: 'tab_upcoming',
  Ongoing: 'tab_ongoing',
  Completed: 'tab_completed',
  Cancelled: 'tab_cancelled',
}

export default function MyTrips() {
  useScrollToTop()
  const { t } = useTranslation()
  const { user } = useAuth()
  const {
    bookings,
    loading,
    error,
    cancelBooking,
    confirmArrival,
    checkInDay,
    pendingPayment,
    clearPendingPayment,
  } = useBookings()
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [actionError, setActionError] = useState('')

  const categorized = useMemo(() => {
    const groups = { Upcoming: [], Ongoing: [], Completed: [], Cancelled: [] }
    bookings.forEach((b) => {
      groups[b.bookingStatus]?.push(b)
    })
    return groups
  }, [bookings])

  const visibleTrips = categorized[activeTab]

  const runAction = async (action, ...args) => {
    setActionError('')
    try {
      await action(...args)
    } catch (err) {
      setActionError(apiErrorMessage(err, 'That action could not be completed — please try again.'))
    }
  }

  const handleConfirmCancel = () => {
    const target = cancelTarget
    setCancelTarget(null)
    if (target) runAction(cancelBooking, target)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32">
          <h1 className="text-2xl font-bold mb-3">Please log in to see your trips</h1>
          <p className="text-ink/50">My Trips is only available to signed-in travellers.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="gradient-hero pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white text-xs font-semibold mb-4">
            <FaSuitcaseRolling className="text-secondary" /> {t('my_trips_title')}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {user ? `${user.name.split(' ')[0]}'s Trips` : 'Your Trips'}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">{t('my_trips_subtitle')}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-10 pb-20">
        {pendingPayment && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 p-4 mb-6">
            <FaHourglassHalf className="mt-0.5 shrink-0" />
            <p className="text-sm flex-1">
              An earlier demo payment for <strong>{pendingPayment.destination}</strong> was left incomplete (no
              booking was created). You can safely start that booking again from the planner or package page.
            </p>
            <button
              onClick={clearPendingPayment}
              aria-label="Dismiss"
              className="shrink-0 text-amber-500 hover:text-amber-700"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {actionError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{actionError}</div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl shadow-card p-16 flex items-center justify-center">
            <Loader label="Loading your trips…" size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyTrips />
        ) : (
          <>
            <div className="flex gap-2 mb-6 bg-white rounded-full p-1.5 shadow-card w-fit mx-auto sm:mx-0 flex-wrap justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === tab ? 'gradient-primary text-white' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  {t(TAB_LABEL_KEYS[tab])} ({categorized[tab].length})
                </button>
              ))}
            </div>

            {visibleTrips.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-card p-12 text-center text-ink/50">
                No {activeTab.toLowerCase()} trips.
              </div>
            ) : (
              <div className="space-y-6">
                {visibleTrips.map((booking, i) => (
                  <TripCard
                    key={booking.id}
                    booking={booking}
                    onCancel={setCancelTarget}
                    onConfirmArrival={(id) => runAction(confirmArrival, id)}
                    onCheckInDay={(id, day) => runAction(checkInDay, id, day)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Booking?" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 grid place-items-center text-2xl mx-auto mb-4">
            <FaExclamationTriangle />
          </div>
          <p className="text-sm text-ink/60 mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setCancelTarget(null)}>
              Keep Booking
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleConfirmCancel}>
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
