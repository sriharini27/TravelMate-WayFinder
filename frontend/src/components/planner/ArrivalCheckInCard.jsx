import { motion } from 'framer-motion'
import { FaPlaneArrival, FaClock, FaCheckCircle } from 'react-icons/fa'
import { getArrivalOptions } from '../../utils/arrivalLogic.js'
import { formatCurrency } from '../../utils/motionVariants.js'

/**
 * TravelMate's core differentiator: Arrival-Aware Trip Optimization.
 * Compares the traveller's arrival time against the selected hotel's
 * standard check-in time and surfaces intelligent options when they land early.
 */
export default function ArrivalCheckInCard({ arrivalTime, hotel, selectedOptionId, onSelect }) {
  if (!arrivalTime || !hotel) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 p-5 text-sm text-ink/40 text-center">
        Enter your expected arrival time above to see arrival-aware check-in options.
      </div>
    )
  }

  const result = getArrivalOptions(arrivalTime, hotel)
  if (!result) return null

  if (!result.isEarly) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 flex items-center gap-3">
        <FaCheckCircle className="text-accent text-xl shrink-0" />
        <p className="text-sm text-ink/70">
          Your arrival lines up with {hotel.name}'s standard check-in ({result.standardCheckIn}). No special
          arrangements needed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-secondary/10 border border-secondary/20 p-4 flex items-start gap-3">
        <FaPlaneArrival className="text-secondary text-lg mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-ink">Your arrival is earlier than standard check-in.</p>
          <p className="text-ink/60">
            Standard check-in at {hotel.name} is <strong>{result.standardCheckIn}</strong>. Choose how you'd like to
            handle the gap:
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {result.options.map((option, i) => {
          const isSelected = selectedOptionId === option.id
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border p-4 transition-colors ${
                isSelected ? 'border-primary bg-primary/5' : 'border-ink/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm">{option.label}</p>
                {isSelected && <FaCheckCircle className="text-primary" />}
              </div>
              <p className="text-xs text-ink/50 flex items-center gap-1 mb-2">
                <FaClock /> {option.time}
              </p>
              <p className="text-xs text-ink/50 mb-3">{option.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${option.fee > 0 ? 'text-secondary' : 'text-accent'}`}>
                  {option.fee > 0 ? `+${formatCurrency(option.fee)}` : 'No extra cost'}
                </span>
                <button
                  onClick={() => onSelect(isSelected ? null : option)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'border border-ink/15 text-ink/70 hover:border-primary/40'
                  }`}
                >
                  {isSelected ? 'Selected ✓' : 'Select Option'}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
