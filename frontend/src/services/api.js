import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // send the httpOnly refresh-token cookie
})

// The access token lives in memory only (never localStorage), set by AuthContext
// right after login/register/refresh/Google OAuth.
let accessToken = null
export function setAccessToken(token) {
  accessToken = token
}
export function getAccessToken() {
  return accessToken
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// A callback AuthContext registers so a failed silent refresh can log the user out cleanly.
let onAuthExpired = () => {}
export function setOnAuthExpired(fn) {
  onAuthExpired = fn
}

let refreshPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error
    if (response?.status === 401 && !config._retried && !config.url?.includes('/auth/')) {
      config._retried = true
      try {
        // Only one refresh call in flight at a time, even if several requests 401 together.
        refreshPromise = refreshPromise || axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
        const { data } = await refreshPromise
        refreshPromise = null
        setAccessToken(data.accessToken)
        config.headers.Authorization = `Bearer ${data.accessToken}`
        return api(config)
      } catch (refreshErr) {
        refreshPromise = null
        setAccessToken(null)
        onAuthExpired()
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  }
)

export function apiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || err?.message || fallback
}

export default api
