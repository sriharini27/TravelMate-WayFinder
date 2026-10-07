import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaHotel, FaPlaneArrival, FaBox } from 'react-icons/fa'
import { formatCurrency } from '../../utils/motionVariants.js'

export default function BookingSummary({ trip, pkg, travelDate, travellers, offer = null }) {
  const originalAmount = trip.budget.total
  const discountAmount = offer ? Math.round((originalAmount * offer.discountPercent) / 100) : 0
  const finalAmount = originalAmount - discountAmount

  return (
    <div className="rounded-2xl border border-ink/10 divide-y divide-ink/5">
      <Row icon={<FaMapMarkerAlt />} label="Destination" value={trip.destination} />
      {pkg && <Row icon={<FaBox />} label="Package" value={pkg.name} />}
      <Row
        icon={<FaCalendarAlt />}
        label="Travel Date"
        value={travelDate ? new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}
      />
      <Row icon={<FaUsers />} label="Travellers" value={`${travellers} traveller${travellers > 1 ? 's' : ''}`} />
      <Row icon={<FaHotel />} label="Hotel" value={trip.hotel.name} />
      <Row
        icon={<FaPlaneArrival />}
        label="Arrival Strategy"
        value={trip.arrivalStrategy ? trip.arrivalStrategy.label : 'Standard Check-in'}
      />
      {trip.budget.earlyCheckinFee > 0 && (
        <Row label="Early Check-in Fee" value={formatCurrency(trip.budget.earlyCheckinFee)} />
      )}
      {offer && (
        <>
          <Row label="Original Amount" value={formatCurrency(originalAmount)} />
          <Row
            label={`Offer Applied (${offer.code})`}
            value={`− ${formatCurrency(discountAmount)} (${offer.discountPercent}% off)`}
          />
        </>
      )}
      <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5">
        <span className="font-bold text-sm">{offer ? 'Final Amount' : 'Total Amount'}</span>
        <span className="font-extrabold text-primary text-lg">{formatCurrency(offer ? finalAmount : originalAmount)}</span>
      </div>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="flex items-center gap-2 text-ink/50">
        {icon} {label}
      </span>
      <span className="font-semibold text-ink text-right">{value}</span>
    </div>
  )
}
