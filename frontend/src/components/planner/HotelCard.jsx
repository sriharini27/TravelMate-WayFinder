import { Link } from 'react-router-dom'
import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { formatCurrency } from '../../utils/motionVariants.js'

/**
 * Two modes:
 * - Display mode (default): shows the recommended hotel inside the AI result summary.
 * - Selectable mode: shows a hotel option with a "Select Hotel" button, used in the
 *   planner's hotel-picker list.
 */
export default function HotelCard({ hotel, selectable = false, selected = false, onSelect }) {
  if (selectable) {
    return (
      <div
        className={`rounded-2xl overflow-hidden border transition-colors ${
          selected ? 'border-primary shadow-card' : 'border-ink/10'
        }`}
      >
        <img src={hotel.image} alt={hotel.name} className="w-full h-36 object-cover" />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-sm">{hotel.name}</h4>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0">
              <FaStar /> {hotel.rating}
            </span>
          </div>
          <p className="text-xs text-ink/40 flex items-center gap-1 mb-2">
            <FaMapMarkerAlt /> {hotel.distanceFromCenter}
          </p>
          <p className="text-xs text-ink/50 flex items-center gap-1 mb-2">
            <FaClock /> Check-in {hotel.standardCheckIn} · Check-out {hotel.standardCheckOut}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.map((a) => (
              <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80">
                {a}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-sm">
              {formatCurrency(hotel.pricePerNight)}
              <span className="text-ink/40 text-xs font-normal"> /night</span>
            </span>
            <button
              onClick={() => onSelect?.(hotel)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selected ? 'bg-accent text-white' : 'gradient-primary text-white hover:shadow-card'
              }`}
            >
              {selected ? 'Selected ✓' : 'Select Hotel'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-ink/10 flex flex-col sm:flex-row">
      <img src={hotel.image} alt={hotel.name} className="w-full sm:w-40 h-40 sm:h-auto object-cover" />
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-ink/40 font-semibold uppercase tracking-wide">Recommended Hotel</p>
            <Link to={`/hotels/${hotel.id}`} className="font-bold hover:text-primary transition-colors">
              {hotel.name}
            </Link>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0">
            <FaStar /> {hotel.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 my-2">
          {hotel.amenities.map((a) => (
            <span key={a} className="flex items-center gap-1 text-xs text-ink/50">
              <FaCheckCircle className="text-accent" /> {a}
            </span>
          ))}
        </div>
        <p className="text-sm">
          <span className="text-primary font-bold">{formatCurrency(hotel.pricePerNight)}</span>
          <span className="text-ink/40 text-xs"> /night × {hotel.nights} nights = </span>
          <span className="font-semibold">{formatCurrency(hotel.totalHotelCost)}</span>
        </p>
      </div>
    </div>
  )
}
