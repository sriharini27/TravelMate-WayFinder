import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaTrash,
  FaChevronDown,
  FaHotel,
  FaPlaneArrival,
  FaReceipt,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaRegCircle,
  FaMoneyCheckAlt,
} from 'react-icons/fa'
import ItineraryCard from '../planner/ItineraryCard.jsx'
import BudgetCard from '../planner/BudgetCard.jsx'
import destinationsData from '../../data/destinations.js'
import { formatCurrency } from '../../utils/motionVariants.js'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

function getDestinationImage(name) {
  return destinationsData.find((d) => d.name === name)?.image || FALLBACK_IMAGE
}

const statusStyles = {
  Upcoming: 'bg-primary/10 text-primary',
  Ongoing: 'bg-secondary/10 text-secondary',
  Completed: 'bg-accent/10 text-accent',
  Cancelled: 'bg-red-100 text-red-500',
}

export default function TripCard({ booking, onCancel, onConfirmArrival, onCheckInDay, index = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const isCancelled = booking.bookingStatus === 'Cancelled'
  const isCompleted = booking.bookingStatus === 'Completed'
  const showTracker = !isCancelled && !isCompleted

  const nextCheckinDay = booking.dailyCheckins?.find((d) => !d.checkedIn)?.day
  const totalDays = booking.dailyCheckins?.length || 0
  const exploredDays = booking.dailyCheckins?.filter((d) => d.checkedIn).length || 0
  const progressPct = totalDays > 0 ? Math.round((exploredDays / totalDays) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-56 h-44 sm:h-auto shrink-0 relative">
          <img
            src={getDestinationImage(booking.destination)}
            alt={booking.destination}
            className={`w-full h-full object-cover ${isCancelled ? 'grayscale opacity-60' : ''}`}
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[booking.bookingStatus]}`}>
                  {booking.bookingStatus}
                </span>
                <span className="text-xs text-ink/40 flex items-center gap-1">
                  <FaReceipt /> {booking.bookingId}
                </span>
              </div>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary text-base" /> {booking.destination}
              </h3>
            </div>
            <span className="px-4 py-2 rounded-full bg-primary/5 text-primary font-bold whitespace-nowrap">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ink/60 mb-4">
            {booking.sourceCity && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkedAlt className="text-primary/60" /> {booking.sourceCity} → {booking.destination}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-primary/60" />
              {booking.checkInDate
                ? new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Date flexible'}
            </span>
            <span className="flex items-center gap-1.5">
              <FaUsers className="text-primary/60" /> {booking.travellers} traveller{booking.travellers > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <FaHotel className="text-primary/60" /> {booking.hotel.name}
            </span>
            <span className="flex items-center gap-1.5">
              <FaPlaneArrival className="text-primary/60" />
              {booking.arrivalStrategy}
              {booking.earlyCheckinFee > 0 && ` (+${formatCurrency(booking.earlyCheckinFee)})`}
            </span>
            {booking.paymentMethod && (
              <span className="flex items-center gap-1.5">
                <FaMoneyCheckAlt className="text-primary/60" />
                {booking.paymentMethod} · {booking.paymentStatus || 'Successful'}
                {typeof booking.amountPaid === 'number' && ` · Paid ${formatCurrency(booking.amountPaid)}`}
              </span>
            )}
          </div>

          {booking.offerCode && (
            <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
              <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                Offer Applied: {booking.offerCode} ({booking.discountPercent}% off)
              </span>
              <span className="text-ink/40">
                {formatCurrency(booking.originalAmount)} → Discount {formatCurrency(booking.discountAmount)} → Final{' '}
                {formatCurrency(booking.finalAmount)}
              </span>
            </div>
          )}

          {/* Trip completion celebration */}
          {isCompleted && (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 mb-4 text-center">
              <p className="font-bold text-accent">🎉 Trip Completed!</p>
              <p className="text-xs text-ink/50 mt-1">
                All {totalDays} day{totalDays > 1 ? 's' : ''} explored — hope {booking.destination} was unforgettable.
              </p>
            </div>
          )}

          {/* Trip tracker: arrival confirmation + daily check-ins */}
          {showTracker && (
            <div className="rounded-2xl border border-ink/10 bg-bg/60 p-4 mb-4">
              {!booking.arrivalConfirmed ? (
                <button
                  onClick={() => onConfirmArrival(booking.id)}
                  className="flex items-center gap-2 text-sm font-semibold text-white gradient-primary px-4 py-2 rounded-full hover:shadow-card transition-shadow"
                >
                  <FaPlaneArrival /> Confirm I've Reached {booking.destination}
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                      Exploration Progress
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {exploredDays} / {totalDays} Days Explored
                    </p>
                  </div>
                  <div
                    className="w-full h-2 rounded-full bg-ink/10 overflow-hidden mb-4"
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${exploredDays} of ${totalDays} days explored`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {booking.dailyCheckins.map((d) => {
                      const isNext = d.day === nextCheckinDay
                      return (
                        <button
                          key={d.day}
                          disabled={d.checkedIn || !isNext}
                          onClick={() => onCheckInDay(booking.id, d.day)}
                          aria-label={d.checkedIn ? `Day ${d.day} explored` : `Mark Day ${d.day} as explored`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            d.checkedIn
                              ? 'bg-accent/10 border-accent/20 text-accent'
                              : isNext
                              ? 'border-primary text-primary hover:bg-primary/5'
                              : 'border-ink/10 text-ink/30 cursor-not-allowed'
                          }`}
                        >
                          {d.checkedIn ? <FaCheckCircle /> : <FaRegCircle />}
                          {d.checkedIn ? `Day ${d.day} Explored` : `Mark Day ${d.day} as Explored`}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-ink/40 mt-2">
                    Trip marks itself Completed once every day is explored.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {expanded ? 'Hide trip' : 'View Trip'}
              <FaChevronDown className={`text-xs transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <Link to={`/booking/${booking.id}`} className="text-sm font-semibold text-ink/60 hover:text-primary">
              View Booking
            </Link>
            {!isCancelled && !isCompleted && (
              <button
                onClick={() => onCancel(booking.id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-500 ml-auto"
              >
                <FaTrash className="text-xs" /> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/5"
          >
            <div className="p-6 space-y-8 bg-bg/50">
              <BudgetCard budget={booking.trip.budget} />
              <ItineraryCard itinerary={booking.trip.itinerary} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
