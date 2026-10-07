import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle, FaGoogle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/common/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToTop from '../hooks/useScrollToTop.js'

const styleOptions = ['Adventure', 'Beach', 'Nature', 'Luxury', 'History', 'Food', 'Shopping', 'Nightlife']
const budgetRanges = [
  { id: 'Budget', label: 'Budget', hint: 'Under ₹25,000' },
  { id: 'Mid', label: 'Mid-range', hint: '₹25,000 – ₹75,000' },
  { id: 'Premium', label: 'Premium', hint: 'Above ₹75,000' },
]

export default function Register() {
  useScrollToTop()
  const { t } = useTranslation()
  const { register, googleLoginUrl } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [styles, setStyles] = useState([])
  const [budgetRange, setBudgetRange] = useState('Mid')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const toggleStyle = (style) => {
    setStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const result = await register({ ...form, preferences: { styles, budgetRange } })
    setLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <AuthLayout
      title={t('register_title')}
      subtitle={t('register_subtitle')}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
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

        <Field label="Full Name" icon={<FaUser />}>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Priya Sharma"
            className="auth-input"
            autoComplete="name"
          />
        </Field>

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
              placeholder="At least 6 characters"
              className="auth-input pr-10"
              autoComplete="new-password"
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

        <Field label="Confirm Password" icon={<FaLock />}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            placeholder="Re-enter your password"
            className="auth-input"
            autoComplete="new-password"
          />
        </Field>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 block">
            Travel Styles You Enjoy <span className="text-ink/30 normal-case font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  styles.includes(style)
                    ? 'gradient-primary text-white border-transparent'
                    : 'border-ink/10 text-ink/60 hover:border-primary/40'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 block">
            Usual Trip Budget
          </label>
          <div className="grid grid-cols-3 gap-2">
            {budgetRanges.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudgetRange(b.id)}
                className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  budgetRange === b.id ? 'border-primary bg-primary/5 text-primary' : 'border-ink/10 text-ink/60'
                }`}
              >
                <span className="font-semibold">{b.label}</span>
                <span className="text-[10px] text-ink/40">{b.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink/40">
          We'll use these to highlight destinations picked for you on the homepage — you can always browse
          everything too.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? t('creating_account') : t('btn_register')}
        </button>

        <p className="text-xs text-ink/40 text-center pt-1">
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>

        <div className="flex items-center gap-3 text-xs text-ink/30">
          <span className="flex-1 h-px bg-ink/10" /> OR <span className="flex-1 h-px bg-ink/10" />
        </div>

        <a
          href={googleLoginUrl}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold border border-ink/15 text-ink hover:border-primary/40 hover:text-primary transition-colors"
        >
          <FaGoogle /> Continue with Google
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
