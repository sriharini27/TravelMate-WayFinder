import api, { API_URL } from './api.js'

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  refresh: () => api.post('/auth/refresh').then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (payload) => api.put('/users/me', payload).then((r) => r.data),
  googleLoginUrl: () => `${API_URL}/api/auth/google`,
}

export default authService
