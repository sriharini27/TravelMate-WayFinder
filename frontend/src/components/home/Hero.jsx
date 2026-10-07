import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaCompass } from 'react-icons/fa'
import SearchCard from './SearchCard.jsx'

export default function Hero({ onApplyFilters }) {
  const navigate = useNavigate()

  return (
    <section id="home" className="relative gradient-hero pt-36 pb-56 md:pb-64 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=60")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white text-xs font-semibold mb-6">
            <FaCompass className="text-secondary" /> Powered by AI Trip Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Discover Your <span className="text-gradient bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">Perfect Journey</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-lg mb-8">
            AI-powered travel planning with personalized itineraries, hotel recommendations,
            smart budget estimation and seamless booking.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/planner')}
              className="px-7 py-3.5 rounded-full font-semibold text-white gradient-secondary shadow-soft hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              Plan My Trip
            </button>
            <a
              href="#destinations"
              className="px-7 py-3.5 rounded-full font-semibold text-white border border-white/30 glass hover:bg-white/20 transition-all"
            >
              Explore Destinations
            </a>
          </div>

          <div className="flex gap-8 mt-12">
            {[
              ['250K+', 'Happy Travellers'],
              ['180+', 'Destinations'],
              ['4.9/5', 'Average Rating'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{num}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80"
            alt="Traveller looking at scenic mountain view"
            className="rounded-[2rem] shadow-2xl w-full h-[420px] object-cover border-4 border-white/20"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 -left-8 glass rounded-2xl p-4 shadow-soft flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-full gradient-primary grid place-items-center text-white text-lg">✈</span>
            <div>
              <p className="text-white text-sm font-semibold">Trip to Bali</p>
              <p className="text-white/60 text-xs">Generated in 8 seconds</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute -bottom-24 left-0 right-0 px-6 z-10">
        <SearchCard onApplyFilters={onApplyFilters} />
      </div>
    </section>
  )
}
