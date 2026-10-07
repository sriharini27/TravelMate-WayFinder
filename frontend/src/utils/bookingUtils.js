/**
 * Generates a booking ID in the TM-BOOK-XXXXXXXX format.
 * (Bookings are only ever created after a simulated payment succeeds —
 * see BookingsContext.createBooking.)
 */
export function generateBookingId() {
  const rand = Math.floor(10000000 + Math.random() * 90000000)
  return `TM-BOOK-${rand}`
}

/**
 * Generates a demo payment ID in the TM-PAY-XXXXXXXX format.
 * This is a purely simulated identifier — no real payment gateway is involved.
 */
export function generatePaymentId() {
  const rand = Math.floor(10000000 + Math.random() * 90000000)
  return `TM-PAY-${rand}`
}
