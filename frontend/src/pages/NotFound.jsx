import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCompass, FaHome } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import useScrollToTop from '../hooks/useScrollToTop.js'

export default function NotFound() {
  useScrollToTop()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="w-24 h-24 rounded-full gradient-primary grid place-items-center text-5xl text-white mb-6"
        >
          <FaCompass />
        </motion.div>
        <h1 className="text-5xl font-extrabold mb-3">404</h1>
        <h2 className="text-xl font-bold mb-2">Looks like you've wandered off the map</h2>
        <p className="text-ink/50 max-w-sm mb-8">
          The page you're looking for doesn't exist. Let's get you back on route.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:-translate-y-0.5 transition-all"
        >
          <FaHome /> Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  )
}
