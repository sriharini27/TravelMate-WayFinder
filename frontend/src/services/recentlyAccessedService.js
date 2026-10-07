import api from './api.js'

export const recentlyAccessedService = {
  record: (payload) => api.post('/recently-accessed', payload).catch(() => null), // best-effort, never blocks the UI
  list: (type) => api.get('/recently-accessed', { params: type ? { type } : {} }).then((r) => r.data.items),
}

export default recentlyAccessedService
