import { motion } from 'framer-motion'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { fadeUp, formatCurrency } from '../../utils/motionVariants.js'

export default function ItineraryCard({ itinerary }) {
  return (
    <div>
      <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
        <FaMapMarkedAlt className="text-primary" /> Day-Wise Itinerary
      </h3>
      <div className="relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />
        <div className="space-y-8">
          {itinerary.map((day, i) => (
            <motion.div
              key={day.day}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="relative"
            >
              <span className="absolute -left-8 top-0 w-6 h-6 rounded-full gradient-primary text-white text-[11px] font-bold grid place-items-center border-4 border-white shadow-card">
                {day.day}
              </span>
              <div className="bg-white rounded-2xl border border-ink/10 p-5 hover:shadow-card transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">
                    Day {day.day} — {day.title}
                  </p>
                  <span className="text-primary font-semibold text-sm">{formatCurrency(day.estimatedCost)}</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {day.activities.map((a) => (
                    <li key={a} className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary/80 font-medium">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
