import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import authService from '../services/authService.js'
import { setAccessToken, setOnAuthExpired, apiErrorMessage } from '../services/api.js'

const AuthContext = createContext(null)

/**
 * Real backend-backed authentication (JWT access token in memory + an
 * httpOnly refresh-token cookie, rotated by the server). Replaces the old
 * localStorage-only mock — see services/authService.js and the server's
 * /api/auth routes. No password or token is ever written to localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setUser(null)
  }, [])

  // On first load, silently try to turn the httpOnly refresh cookie (if any)
  // into a fresh access token, so a page refresh keeps the user logged in
  // without ever having stored the token itself in localStorage.
  useEffect(() => {
    setOnAuthExpired(clearSession)
    ;(async () => {
      try {
        const { accessToken, user: me } = await authService.refresh()
        setAccessToken(accessToken)
        setUser(me)
      } catch {
        // No valid session — that's fine, the person just isn't logged in.
      } finally {
        setReady(true)
      }
    })()
  }, [clearSession])

  const register = async ({ name, email, password, preferences = null }) => {
    try {
      const { accessToken, user: created } = await authService.register({ name, email, password, preferences })
      setAccessToken(accessToken)
      setUser(created)
      return { success: true }
    } catch (err) {
      return { success: false, error: apiErrorMessage(err, 'Could not register — please try again.') }
    }
  }

  const login = async ({ email, password }) => {
    try {
      const { accessToken, user: loggedIn } = await authService.login({ email, password })
      setAccessToken(accessToken)
      setUser(loggedIn)
      return { success: true, user: loggedIn }
    } catch (err) {
      return { success: false, error: apiErrorMessage(err, 'Invalid email or password.') }
    }
  }

  // Used by /oauth/callback after a successful Google sign-in redirect.
  const loginWithAccessToken = async (accessToken) => {
    try {
      setAccessToken(accessToken)
      const { user: me } = await authService.me()
      setUser(me)
      return { success: true, user: me }
    } catch (err) {
      clearSession()
      return { success: false, error: apiErrorMessage(err, 'Google sign-in failed.') }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // ignore — we clear client state regardless
    }
    clearSession()
  }

  const updatePreferences = async (preferences) => {
    try {
      const { user: updated } = await authService.updateProfile({ preferences })
      setUser(updated)
      return { success: true }
    } catch (err) {
      return { success: false, error: apiErrorMessage(err) }
    }
  }

  const googleLoginUrl = authService.googleLoginUrl()

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, logout, loginWithAccessToken, updatePreferences, googleLoginUrl }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
