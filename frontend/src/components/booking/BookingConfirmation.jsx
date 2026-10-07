import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaSuitcaseRolling, FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaHotel, FaPlaneArrival, FaEnvelope, FaRedo } from 'react-icons/fa'
import { formatCurrency } from '../../utils/motionVariants.js'
import bookingService from '../../services/bookingService.js'
import { apiErrorMessage } from '../../services/api.js'

export default function BookingConfirmation({ booking }) {
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null) // { downloaded, emailStatus, maskedEmail, message }

  const handleDownloadTicket = async () => {
    setSending(true)
    setStatus(null)
    let downloaded = false
    try {
      await bookingService.downloadTicket(booking.id || booking._id, `TravelMate-Ticket-${booking.bookingId}.pdf`)
      downloaded = true
    } catch (err) {
      setStatus({ downloaded: false, message: apiErrorMessage(err, 'Could not download the ticket. Please try again.') })
      setSending(false)
      return
    }

    try {
      const result = await bookingService.sendTicketEmail(booking.id || booking._id)
      setStatus({ downloaded, emailStatus: result.emailStatus, maskedEmail: result.maskedEmail, message: result.message })
    } catch (err) {
      setStatus({ downloaded, emailStatus: 'Failed', message: 'Ticket downloaded successfully, but email delivery failed. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-accent/10 grid place-items-center text-4xl text-accent mx-auto mb-4"
        >
          <FaCheckCircle />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">🎉 Booking Confirmed!</h1>
        <p className="text-ink/50">Your trip to {booking.destination} is all set.</p>
        <p className="mt-3 inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary font-bold text-sm tracking-wide">
          {booking.bookingId}
        </p>
      </div>

      <div className="rounded-2xl border border-ink/10 divide-y divide-ink/5 mb-8">
        <Row icon={<FaMapMarkerAlt />} label="Destination" value={booking.destination} />
        <Row
          icon={<FaCalendarAlt />}
          label="Dates"
          value={
            booking.checkInDate
              ? `${new Date(booking.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(
                  booking.checkOutDate
                ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : 'Flexible dates'
          }
        />
        <Row icon={<FaUsers />} label="Travellers" value={`${booking.travellers} traveller${booking.travellers > 1 ? 's' : ''}`} />
        <Row icon={<FaHotel />} label="Hotel" value={booking.hotel.name} />
        <Row icon={<FaPlaneArrival />} label="Arrival Time" value={booking.arrivalTime || 'Not specified'} />
        <Row label="Check-in Strategy" value={booking.arrivalStrategy} />
        {booking.earlyCheckinFee > 0 && <Row label="Early Check-in Fee" value={formatCurrency(booking.earlyCheckinFee)} />}
        {booking.offerCode && (
          <>
            <Row label="Original Amount" value={formatCurrency(booking.originalAmount)} />
            <Row label="Offer Applied" value={`${booking.offerCode} (${booking.discountPercent}% off)`} />
            <Row label="Discount" value={`− ${formatCurrency(booking.discountAmount)}`} />
          </>
        )}
        <div className="flex items-center justify-between px-4 py-4 bg-primary/5">
          <span className="font-bold">{booking.offerCode ? 'Final Amount Paid' : 'Total Amount'}</span>
          <span className="font-extrabold text-primary text-xl">{formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Link
          to="/my-trips"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:-translate-y-0.5 transition-all"
        >
          <FaSuitcaseRolling /> View My Trips
        </Link>
        <button
          onClick={handleDownloadTicket}
          disabled={sending}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold border border-ink/15 text-ink/70 hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60"
        >
          <FaTicketAlt /> {sending ? 'Sending ticket…' : 'Download Ticket'}
        </button>
      </div>

      {status && (
        <div className="mt-4 space-y-1.5 text-sm text-center print:hidden">
          {status.downloaded && (
            <p className="flex items-center justify-center gap-2 text-accent font-medium">
              <FaCheckCircle /> Ticket downloaded successfully
            </p>
          )}
          {status.emailStatus === 'Sent' && (
            <p className="flex items-center justify-center gap-2 text-accent font-medium">
              <FaEnvelope /> Ticket sent to your registered email: {status.maskedEmail}
            </p>
          )}
          {status.emailStatus === 'Failed' && (
            <div className="flex items-center justify-center gap-2 text-secondary font-medium flex-wrap">
              <span>{status.message || 'Ticket downloaded successfully, but email delivery failed. Please try again.'}</span>
              <button onClick={handleDownloadTicket} className="inline-flex items-center gap-1 underline hover:no-underline">
                <FaRedo size={11} /> Retry
              </button>
            </div>
          )}
          {!status.downloaded && !status.emailStatus && (
            <p className="text-red-500 font-medium">{status.message}</p>
          )}
        </div>
      )}
    </motion.div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 text-sm">
      <span className="flex items-center gap-2 text-ink/50">
        {icon} {label}
      </span>
      <span className="font-semibold text-ink text-right">{value}</span>
    </div>
  )
}
