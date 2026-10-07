import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from './Loader.jsx'

/** Requires a logged-in user. Redirects to /login, remembering where to return to. */
export function ProtectedRoute({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Loading…" size="lg" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

/** Requires a logged-in ADMIN user. Normal users are sent home, never shown the admin UI. */
export function AdminRoute({ children }) {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Loading…" size="lg" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

/**
 * Keeps an ADMIN out of the normal user-facing experience. Normal users (and
 * logged-out visitors) pass straight through unchanged; an admin landing on
 * one of these routes (e.g. by typing the URL directly) is sent to /admin
 * instead, so there's no way for an admin account to end up back in the
 * normal TravelMate UI short of logging out.
 */
export function UserOnlyRoute({ children }) {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Loading…" size="lg" />
      </div>
    )
  }
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

export default ProtectedRoute
