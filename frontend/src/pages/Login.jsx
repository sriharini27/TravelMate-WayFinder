import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle, FaGoogle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/common/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToTop from '../hooks/useScrollToTop.js'

export default function Login() {
  useScrollToTop()
  const { t } = useTranslation()
  const { login, googleLoginUrl } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from || '/'

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in both fields.')
      return
    }

    setLoading(true)
    const result = await login(form)
    setLoading(false)
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(redirectTo, { replace: true })
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <AuthLayout
      title={t('login_title')}
      subtitle={t('login_subtitle')}
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <FaExclamationCircle className="shrink-0" /> {error}
          </div>
        )}

        <Field label="Email" icon={<FaEnvelope />}>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            className="auth-input"
            autoComplete="email"
          />
        </Field>

        <Field label="Password" icon={<FaLock />}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              className="auth-input pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-ink/60">
            <input type="checkbox" className="accent-blue-600" />
            Remember me
          </label>
          <a href="#" className="text-primary font-medium hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? t('logging_in') : t('btn_login')}
        </button>

        <div className="flex items-center gap-3 text-xs text-ink/30">
          <span className="flex-1 h-px bg-ink/10" /> OR <span className="flex-1 h-px bg-ink/10" />
        </div>

        <a
          href={googleLoginUrl}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold border border-ink/15 text-ink hover:border-primary/40 hover:text-primary transition-colors"
        >
          <FaGoogle /> {t('continue_with_google')}
        </a>
      </form>
    </AuthLayout>
  )
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30 text-sm">{icon}</span>
        {children}
      </div>
    </div>
  )
}
