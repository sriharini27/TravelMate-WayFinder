import api from './api.js'

export const paymentService = {
  // outcome: 'success' | 'failed' | 'pending'. bookingDraft only matters for 'success'.
  // offer (optional): { offerId } — the server re-verifies the discount
  // against the Offer record itself rather than trusting a client amount.
  simulate: ({ amount, paymentMethod, outcome, bookingDraft, offer = null }) =>
    api.post('/payments/simulate', { amount, paymentMethod, outcome, bookingDraft, offer }).then((r) => r.data),
}

export default paymentService
