import api from './api.js'

// Public, read-only catalog data — backed by MongoDB, not frontend arrays.
export const catalogService = {
  getDestinations: () => api.get('/destinations', { params: { limit: 200 } }).then((r) => r.data.items),
  getHotels: () => api.get('/hotels', { params: { limit: 500 } }).then((r) => r.data.items),
  getPackages: () => api.get('/packages', { params: { limit: 200 } }).then((r) => r.data.items),
  getOffers: () => api.get('/offers', { params: { limit: 50 } }).then((r) => r.data.items),
  // Only offers that match BOTH the trip's destination AND at least one of
  // its itinerary/activity categories — used right before payment so the
  // person is never shown (or able to apply) an irrelevant offer.
  getApplicableOffers: ({ destination, categories = [], totalAmount = 0 }) =>
    api
      .get('/offers/applicable', {
        params: { destination, categories: categories.join(','), totalAmount },
      })
      .then((r) => r.data.items),
  getItineraries: () => api.get('/itineraries', { params: { limit: 200 } }).then((r) => r.data.items),
  getAttractions: () =>
    api.get('/attractions', { params: { limit: 500, verified: true, isActive: true } }).then((r) => r.data.items),
}

export default catalogService
