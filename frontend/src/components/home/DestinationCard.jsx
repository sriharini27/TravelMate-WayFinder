import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaArrowRight } from 'react-icons/fa'
import { fadeUp, formatCurrency } from '../../utils/motionVariants.js'

export default function DestinationCard({ destination, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-shadow cursor-pointer"
      onClick={() => navigate(`/destinations/${destination.id}`)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full gradient-secondary text-white text-xs font-semibold">
          {destination.tag}
        </span>
        <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold">
          <FaStar className="text-amber-400" /> {destination.rating}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{destination.name}</h3>
          <span className="text-xs text-ink/40">{destination.country}</span>
        </div>
        <p className="text-sm text-ink/60 leading-relaxed mb-4 line-clamp-2">{destination.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary font-bold">{formatCurrency(destination.price)}</span>
            <span className="text-ink/40 text-xs"> /person</span>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
            Explore <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
