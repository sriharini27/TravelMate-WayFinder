import { Link } from 'react-router-dom'
import { FaSuitcaseRolling } from 'react-icons/fa'

export default function EmptyTrips() {
  return (
    <div className="bg-white rounded-3xl shadow-card p-12 text-center">
      <div className="w-20 h-20 rounded-full gradient-primary grid place-items-center text-4xl text-white mb-6 mx-auto">
        <FaSuitcaseRolling />
      </div>
      <h3 className="text-xl font-bold mb-2">No trips booked yet</h3>
      <p className="text-ink/50 max-w-sm mx-auto mb-8">
        Generate a trip with the AI planner and book it — it'll show up here with your booking ID and status.
      </p>
      <Link
        to="/planner"
        className="inline-block px-7 py-3 rounded-full font-semibold text-white gradient-primary shadow-card hover:-translate-y-0.5 transition-all"
      >
        Plan Your First Trip
      </Link>
    </div>
  )
}
