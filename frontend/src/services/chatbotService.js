import api from './api.js'

export const chatbotService = {
  ask: (message) => api.post('/chatbot', { message }).then((r) => r.data),
}

export default chatbotService
