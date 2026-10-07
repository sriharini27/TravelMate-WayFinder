import { motion } from 'framer-motion'
import { FaPlane, FaBed, FaHiking, FaUtensils, FaEllipsisH, FaClock } from 'react-icons/fa'
import { formatCurrency } from '../../utils/motionVariants.js'

const rows = [
  { key: 'flights', label: 'Transportation', icon: FaPlane },
  { key: 'hotel', label: 'Hotel', icon: FaBed },
  { key: 'activities', label: 'Activities', icon: FaHiking },
  { key: 'food', label: 'Food', icon: FaUtensils },
  { key: 'earlyCheckinFee', label: 'Early Check-in Fee', icon: FaClock },
  { key: 'misc', label: 'Other Expenses', icon: FaEllipsisH },
]

export default function BudgetCard({ budget }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold">Budget Breakdown</p>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            budget.withinBudget ? 'bg-accent/10 text-accent' : 'bg-orange-100 text-secondary'
          }`}
        >
          {budget.withinBudget ? 'Within Budget' : 'Slightly Over Budget'}
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const pct = Math.round((budget[row.key] / budget.total) * 100)
          const Icon = row.icon
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-ink/60">
                  <Icon className="text-primary text-xs" /> {row.label}
                </span>
                <span className="font-semibold">{formatCurrency(budget[row.key])}</span>
              </div>
              <div className="h-1.5 rounded-full bg-ink/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full gradient-primary"
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink/10">
        <div>
          <span className="font-bold block">Estimated Total</span>
          {budget.travellers > 1 && (
            <span className="text-xs text-ink/40">
              ≈ {formatCurrency(budget.perTraveller)} per person × {budget.travellers} travellers
            </span>
          )}
        </div>
        <span className="text-xl font-extrabold text-primary">{formatCurrency(budget.total)}</span>
      </div>
    </div>
  )
}
