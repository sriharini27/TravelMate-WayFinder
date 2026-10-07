import api from './api.js'

export const adminService = {
  getStats: () => api.get('/admin/stats').then((r) => r.data.stats),
  listUsers: () => api.get('/admin/users').then((r) => r.data.items),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data.item),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  listBookings: () => api.get('/bookings').then((r) => r.data.items),
  listPayments: () => api.get('/payments').then((r) => r.data.items),

  // Reference-data CRUD (shared shape across destinations/hotels/packages/offers)
  list: (resource) => api.get(`/${resource}`, { params: { limit: 500 } }).then((r) => r.data.items),
  create: (resource, payload) => api.post(`/${resource}`, payload).then((r) => r.data.item),
  update: (resource, id, payload) => api.put(`/${resource}/${id}`, payload).then((r) => r.data.item),
  remove: (resource, id) => api.delete(`/${resource}/${id}`).then((r) => r.data),
}

export default adminService
