function generateBookingId() {
  const rand = Math.floor(10000000 + Math.random() * 90000000)
  return `TM-BOOK-${rand}`
}

function generatePaymentId() {
  const rand = Math.floor(10000000 + Math.random() * 90000000)
  return `TM-PAY-${rand}`
}

module.exports = { generateBookingId, generatePaymentId }
