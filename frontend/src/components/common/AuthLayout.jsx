import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPaperPlane } from 'react-icons/fa'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="hidden lg:block relative gradient-hero overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
          alt="Scenic mountain travel view"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl">
            <span className="w-9 h-9 rounded-xl grid place-items-center gradient-primary text-white">
              <FaPaperPlane className="text-sm -rotate-45" />
            </span>
            TravelMate
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Plan Smarter.
              <br />
              Travel Better.
            </h2>
            <p className="text-white/70 max-w-sm">
              Join thousands of travellers using AI to build personalized itineraries in seconds.
            </p>
          </motion.div>
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} TravelMate. All rights reserved.</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-16 bg-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 font-extrabold text-xl mb-10">
            <span className="w-9 h-9 rounded-xl grid place-items-center gradient-primary text-white">
              <FaPaperPlane className="text-sm -rotate-45" />
            </span>
            TravelMate
          </Link>

          <h1 className="text-2xl font-extrabold mb-1">{title}</h1>
          <p className="text-ink/50 text-sm mb-8">{subtitle}</p>

          {children}

          {footer && <div className="mt-6 text-center text-sm text-ink/60">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}
