import api from './api.js'

export const bookingService = {
  myBookings: () => api.get('/bookings/my').then((r) => r.data.items),
  getBooking: (id) => api.get(`/bookings/${id}`).then((r) => r.data.item),
  cancel: (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data.item),
  confirmArrival: (id) => api.put(`/bookings/${id}/confirm-arrival`).then((r) => r.data.item),
  checkInDay: (id, day) => api.put(`/bookings/${id}/check-in-day`, { day }).then((r) => r.data.item),
  // Triggers a real browser download of the backend-generated PDF ticket.
  downloadTicket: async (id, filename) => {
    const response = await api.get(`/bookings/${id}/ticket`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename || `TravelMate-Ticket-${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
  sendTicketEmail: (id) => api.post(`/bookings/${id}/send-ticket`).then((r) => r.data),
}

export default bookingService
