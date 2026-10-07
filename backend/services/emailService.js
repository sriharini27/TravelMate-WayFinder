const nodemailer = require('nodemailer')

/** True only when real SMTP credentials are configured via env vars. */
function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
}

let transporter = null
function getTransporter() {
  if (!isEmailConfigured()) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  }
  return transporter
}

function formatINR(amount) {
  return 'Rs. ' + Math.round(Number(amount) || 0).toLocaleString('en-IN')
}

/**
 * Sends the booking-confirmation email with the generated PDF ticket
 * attached. Throws if SMTP isn't configured or sending fails — callers are
 * expected to catch this and record it as a non-fatal email failure; it
 * must never be allowed to invalidate an already-confirmed booking.
 */
async function sendTicketEmail({ booking, user, pdfBuffer }) {
  const client = getTransporter()
  if (!client) {
    throw new Error('Email is not configured on this server (SMTP_HOST/SMTP_USER/SMTP_PASSWORD missing).')
  }

  const itinerarySummary = (booking.trip?.itinerary || [])
    .slice(0, 7)
    .map((d) => `Day ${d.day} — ${d.title}: ${(d.activities || []).join('; ')}`)
    .join('\n')

  const text = `Hello ${user.name},

Your TravelMate trip has been successfully confirmed.

Destination: ${booking.destination}
Hotel: ${booking.hotel?.name || '—'}
Travel Dates: ${booking.checkInDate || 'Flexible'} to ${booking.checkOutDate || 'Flexible'}
Travellers: ${booking.travellers}
Arrival Time: ${booking.arrivalTime || 'Not specified'}
Arrival Strategy: ${booking.arrivalStrategy || 'Standard Check-in'}
Payment Status: ${booking.paymentStatus}
Total Amount: ${formatINR(booking.totalAmount)}
Booking ID: ${booking.bookingId}

Itinerary Summary:
${itinerarySummary || 'See attached ticket for details.'}

Your ticket is attached to this email.

Thank you for choosing TravelMate.`

  await client.sendMail({
    from: process.env.MAIL_FROM || 'TravelMate <no-reply@travelmate.app>',
    to: user.email,
    subject: `TravelMate – Booking Confirmation [${booking.bookingId}]`,
    text,
    attachments: [
      {
        filename: `TravelMate-Ticket-${booking.bookingId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
}

module.exports = { isEmailConfigured, sendTicketEmail }
