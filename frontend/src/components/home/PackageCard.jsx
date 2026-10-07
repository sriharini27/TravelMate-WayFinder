import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaClock } from 'react-icons/fa'
import { slideLeft, formatCurrency } from '../../utils/motionVariants.js'

export default function PackageCard({ pkg, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={slideLeft}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-shadow flex flex-col"
    >
      <div className="relative h-48">
        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold">
          <FaClock className="text-primary" /> {pkg.duration}
        </span>
        {pkg.discount > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full gradient-secondary text-white text-xs font-bold">
            {pkg.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">{pkg.name}</h3>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
            <FaStar /> {pkg.rating}
          </span>
        </div>
        <ul className="text-xs text-ink/50 mb-4 space-y-1">
          {pkg.highlights.map((h) => (
            <li key={h}>• {h}</li>
          ))}
        </ul>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-primary font-bold">{formatCurrency(pkg.price)}</span>
            {pkg.originalPrice > pkg.price && (
              <span className="text-ink/30 text-xs line-through">{formatCurrency(pkg.originalPrice)}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/packages/${pkg.id}`)}
              className="flex-1 px-3 py-2 rounded-full text-xs font-semibold border border-ink/15 text-ink/70 hover:border-primary/40 hover:text-primary transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => navigate(`/packages/${pkg.id}`, { state: { autoBook: true } })}
              className="flex-1 px-3 py-2 rounded-full text-xs font-semibold text-white gradient-primary hover:shadow-card transition-shadow"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
