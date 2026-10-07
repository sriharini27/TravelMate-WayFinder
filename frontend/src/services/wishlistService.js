import api from './api.js'

export const wishlistService = {
  list: () => api.get('/wishlist').then((r) => r.data.items),
  add: (payload) => api.post('/wishlist', payload).then((r) => r.data.item),
  remove: (id) => api.delete(`/wishlist/${id}`).then((r) => r.data),
}

export default wishlistService
