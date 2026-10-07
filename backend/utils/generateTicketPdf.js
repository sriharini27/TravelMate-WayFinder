const PDFDocument = require('pdfkit')

/**
 * Renders a one-page PDF ticket/booking-confirmation for a booking, entirely
 * on the backend (not browser printing). Returns a Buffer so callers can
 * either stream it straight to an HTTP response or attach it to an email.
 *
 * Currency is written as "Rs. 1,23,456" rather than the ₹ symbol — PDFKit's
 * built-in Helvetica font has no glyph for ₹ and renders it as a broken
 * character, confirmed by generating and visually inspecting a test PDF.
 */
function formatINR(amount) {
  const n = Math.round(Number(amount) || 0)
  return 'Rs. ' + n.toLocaleString('en-IN')
}

function generateTicketPdf(booking, user) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks = []
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fillColor('#2563EB').fontSize(22).font('Helvetica-Bold').text('TravelMate', { align: 'left' })
      doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text('Plan Smarter. Travel Better.')
      doc.moveDown(0.5)
      doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke()
      doc.moveDown(1)

      doc.fontSize(16).font('Helvetica-Bold').fillColor('#1E293B').text('Booking Ticket & Confirmation')
      doc.moveDown(0.3)
      doc.fontSize(11).font('Helvetica').fillColor('#64748B')
      doc.text(`Booking ID: ${booking.bookingId}`)
      if (booking.paymentId) doc.text(`Payment ID: ${booking.paymentId}`)
      doc.moveDown(1)

      const section = (title) => {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#2563EB').text(title)
        doc.moveDown(0.3)
        doc.fontSize(10.5).font('Helvetica').fillColor('#1E293B')
      }
      const row = (label, value) => {
        doc.text(`${label}: `, { continued: true }).font('Helvetica-Bold').text(String(value ?? '—')).font('Helvetica')
      }

      section('Traveller Details')
      row('Name', user.name)
      row('Registered Email', user.email)
      row('Number of Travellers', booking.travellers)
      doc.moveDown(0.8)

      section('Trip Details')
      row('Destination', booking.destination)
      row('Hotel', booking.hotel?.name || '—')
      row('Check-in', booking.checkInDate || 'Flexible')
      row('Check-out', booking.checkOutDate || 'Flexible')
      row('Arrival Time', booking.arrivalTime || 'Not specified')
      row('Arrival Strategy', booking.arrivalStrategy || 'Standard Check-in')
      if (booking.earlyCheckinFee > 0) row('Early Check-in Fee', formatINR(booking.earlyCheckinFee))
      doc.moveDown(0.8)

      section('Payment Summary')
      row('Payment Method', booking.paymentMethod)
      row('Payment Status', booking.paymentStatus)
      row('Booking Status', booking.bookingConfirmationStatus)
      row('Total Amount', formatINR(booking.totalAmount))
      doc.moveDown(0.8)

      const itinerary = Array.isArray(booking.trip?.itinerary) ? booking.trip.itinerary : []
      if (itinerary.length > 0) {
        section('Itinerary Summary')
        itinerary.slice(0, 7).forEach((d) => {
          doc.font('Helvetica-Bold').text(`Day ${d.day} — ${d.title}`)
          doc.font('Helvetica').fillColor('#475569')
          ;(d.activities || []).slice(0, 4).forEach((a) => doc.text(`   • ${a}`))
          doc.fillColor('#1E293B')
          doc.moveDown(0.2)
        })
        doc.moveDown(0.6)
      }

      section('Important Travel Information')
      doc.fillColor('#475569')
      ;(booking.trip?.tips || []).slice(0, 4).forEach((t) => doc.text(`• ${t}`))
      doc.text('• Carry a valid photo ID that matches your booking details.')
      doc.text('• Arrive at the airport/station well ahead of your scheduled time.')

      doc.moveDown(1.5)
      doc.fontSize(9).fillColor('#94A3B8').text('This is a system-generated ticket from TravelMate. Thank you for choosing TravelMate.', {
        align: 'center',
      })

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = generateTicketPdf
