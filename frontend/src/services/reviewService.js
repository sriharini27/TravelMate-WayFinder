import api from './api.js'

export const reviewService = {
  list: (destination) => api.get('/reviews', { params: destination ? { destination } : {} }).then((r) => r.data.items),
  featured: () => api.get('/reviews/featured').then((r) => r.data.items),
  create: (payload) => api.post('/reviews', payload).then((r) => r.data.item),
  remove: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
}

export default reviewService
