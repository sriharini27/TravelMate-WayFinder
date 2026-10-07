import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loader from '../components/common/Loader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Landed on after a successful /api/auth/google/callback redirect from the
// backend, which appends ?accessToken=... — this page exchanges that for a
// logged-in session and sends the person on their way.
export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const { loginWithAccessToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('accessToken')
    if (!token) {
      setError('Google sign-in did not return a token. Please try again.')
      return
    }
    loginWithAccessToken(token).then((result) => {
      if (result.success) {
        navigate(result.user?.role === 'admin' ? '/admin' : '/', { replace: true })
      } else {
        setError(result.error || 'Google sign-in failed. Please try again.')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      {error ? (
        <div className="text-center max-w-sm">
          <p className="text-red-500 font-semibold mb-2">Sign-in failed</p>
          <p className="text-ink/50 text-sm mb-6">{error}</p>
          <a href="/login" className="px-6 py-3 rounded-full font-semibold text-white gradient-primary shadow-card">
            Back to Login
          </a>
        </div>
      ) : (
        <Loader label="Signing you in with Google…" size="lg" />
      )}
    </div>
  )
}
