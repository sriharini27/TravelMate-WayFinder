import { FaRoute, FaHeart, FaPlaneArrival, FaHotel } from 'react-icons/fa'
import { formatCurrency } from '../../utils/motionVariants.js'

export default function AIRecommendation({ trip, travelStyle }) {
  return (
    <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">AI Generated Plan</p>
          <h2 className="text-2xl font-extrabold">{trip.destination} Trip Summary</h2>
        </div>
        <span className="px-4 py-2 rounded-full bg-primary/5 text-primary font-bold">
          {formatCurrency(trip.budget.total)}
        </span>
      </div>

      <p className="text-ink/60 leading-relaxed mb-6">{trip.summary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Fact icon={<FaRoute />} label="Duration" value={`${trip.itinerary.length} Days`} />
        <Fact icon={<FaHeart />} label="Travel Style" value={travelStyle || 'Curated'} />
        <Fact icon={<FaHotel />} label="Hotel" value={trip.hotel.name} truncate />
        <Fact
          icon={<FaPlaneArrival />}
          label="Arrival Strategy"
          value={trip.arrivalStrategy ? trip.arrivalStrategy.label : 'Standard Check-in'}
          truncate
        />
      </div>
    </div>
  )
}

function Fact({ icon, label, value, truncate }) {
  return (
    <div className="rounded-2xl bg-bg p-3.5">
      <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wide mb-1">
        {icon} {label}
      </div>
      <p className={`text-sm font-bold text-ink ${truncate ? 'truncate' : ''}`}>{value}</p>
    </div>
  )
}
