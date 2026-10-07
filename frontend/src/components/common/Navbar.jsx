import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import {
  FaPaperPlane,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
  FaSuitcaseRolling,
  FaHeart,
  FaUserShield,
  FaGlobe,
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBookings } from '../../context/BookingsContext.jsx'
import { changeLanguage } from '../../i18n/index.js'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { activeCount } = useBookings()
  const { t, i18n } = useTranslation()
  const [langOpen, setLangOpen] = useState(false)

  const navLinks = [
    { label: t('nav_home'), href: '/#home' },
    { label: t('nav_destinations'), href: '/#destinations' },
    { label: t('nav_packages'), href: '/#packages' },
    { label: t('nav_planner'), href: '/planner' },
    { label: t('nav_about'), href: '/#about' },
    { label: t('nav_contact'), href: '/#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Admins never see the normal site navigation — they live entirely inside
  // the Admin Dashboard (AdminLayout) until they log out.
  if (user?.role === 'admin') return null

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isPlanner = location.pathname === '/planner'
  const solid = scrolled || isPlanner || isAuthPage

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'glass shadow-soft py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span
            className={`w-9 h-9 rounded-xl grid place-items-center gradient-primary text-white`}
          >
            <FaPaperPlane className="text-sm -rotate-45" />
          </span>
          <span className={solid ? 'text-ink' : 'text-white'}>TravelMate</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                solid ? 'text-ink/80' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/my-trips"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              solid ? 'text-ink/80' : 'text-white/90'
            }`}
          >
            {t('nav_my_trips')}{activeCount > 0 ? ` (${activeCount})` : ''}
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label={t('language')}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                solid ? 'text-ink/70 hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              <FaGlobe /> {LANGUAGES.find((l) => l.code === i18n.language)?.label || 'EN'}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-soft border border-ink/5 overflow-hidden z-10"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code)
                        setLangOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-ink/5 ${
                        i18n.language === l.code ? 'text-primary font-semibold' : 'text-ink/70'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                  solid ? 'text-ink hover:text-primary' : 'text-white hover:text-white/80'
                }`}
              >
                <span className="w-8 h-8 rounded-full gradient-primary text-white grid place-items-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name.split(' ')[0]}
                <FaChevronDown className="text-[10px]" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft border border-ink/5 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-ink/5">
                      <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                      <p className="text-xs text-ink/40 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-trips"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-ink/70 hover:bg-ink/5 transition-colors"
                    >
                      <FaUserCircle /> {t('nav_my_trips')}{activeCount > 0 ? ` (${activeCount})` : ''}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-ink/70 hover:bg-ink/5 transition-colors"
                    >
                      <FaHeart /> {t('nav_wishlist')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary/5 transition-colors"
                      >
                        <FaUserShield /> {t('nav_admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt /> {t('btn_logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  solid ? 'text-ink hover:text-primary' : 'text-white hover:text-white/80'
                }`}
              >
                {t('btn_login')}
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full text-sm font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {t('btn_register')}
              </Link>
            </>
          )}
        </div>

        <button
          className={`lg:hidden text-2xl ${solid ? 'text-ink' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass overflow-hidden mt-3"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-ink font-medium border-b border-ink/5 last:border-none"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/my-trips"
                onClick={() => setOpen(false)}
                className="py-2 text-ink font-medium border-b border-ink/5 flex items-center gap-2"
              >
                <FaSuitcaseRolling className="text-primary text-sm" /> {t('nav_my_trips')}
                {activeCount > 0 ? ` (${activeCount})` : ''}
              </Link>
              {user ? (
                <div className="pt-4 border-t border-ink/5 mt-2">
                  <div className="flex items-center gap-3 py-2">
                    <span className="w-9 h-9 rounded-full gradient-primary text-white grid place-items-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-ink/40">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false)
                      handleLogout()
                    }}
                    className="w-full mt-2 px-4 py-2 rounded-full text-sm font-semibold border border-red-200 text-red-500"
                  >
                    {t('btn_logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold border border-ink/10"
                  >
                    {t('btn_login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold text-white gradient-primary"
                  >
                    {t('btn_register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
