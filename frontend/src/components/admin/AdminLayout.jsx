import { useRef, useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  FaChartPie,
  FaUsers,
  FaMapMarkedAlt,
  FaHotel,
  FaBoxOpen,
  FaTags,
  FaReceipt,
  FaPaperPlane,
  FaChevronDown,
  FaUserShield,
  FaSignOutAlt,
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext.jsx'

const links = [
  { to: '/admin', label: 'Dashboard', icon: FaChartPie, end: true },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
  { to: '/admin/bookings', label: 'Bookings', icon: FaReceipt },
  { to: '/admin/destinations', label: 'Destinations', icon: FaMapMarkedAlt },
  { to: '/admin/hotels', label: 'Hotels', icon: FaHotel },
  { to: '/admin/packages', label: 'Packages', icon: FaBoxOpen },
  { to: '/admin/offers', label: 'Offers', icon: FaTags },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    // Admins have no normal-UI landing page — send them to login, not "/".
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-64 bg-white border-r border-ink/5 hidden md:flex flex-col shrink-0">
        <Link to="/admin" className="flex items-center gap-2 font-extrabold text-lg px-6 py-5 border-b border-ink/5">
          <span className="w-8 h-8 rounded-lg grid place-items-center gradient-primary text-white">
            <FaPaperPlane className="text-xs -rotate-45" />
          </span>
          TravelMate <span className="text-xs font-semibold text-primary">Admin</span>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'gradient-primary text-white' : 'text-ink/60 hover:bg-ink/5'
                }`
              }
            >
              <l.icon /> {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-ink/5 px-6 py-4 md:px-10 flex items-center justify-between">
          <h1 className="text-xl font-extrabold">{title}</h1>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-ink hover:text-primary transition-colors"
            >
              <span className="w-8 h-8 rounded-full gradient-primary text-white grid place-items-center text-xs font-bold">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </span>
              {user?.name || 'Admin'}
              <FaChevronDown className="text-[10px]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft border border-ink/5 overflow-hidden z-10">
                <div className="px-4 py-3 border-b border-ink/5">
                  <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
                  <p className="text-xs text-ink/40 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-ink/70 hover:bg-ink/5 transition-colors"
                >
                  <FaUserShield /> Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  )
}
