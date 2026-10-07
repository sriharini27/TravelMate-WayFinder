import { FaTags, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import Button from '../common/Button.jsx'
import Loader from '../common/Loader.jsx'
import { formatCurrency } from '../../utils/motionVariants.js'

/**
 * Shown right after "Book Ticket", before the booking summary/payment —
 * lists only the offers that matched this trip's destination AND at least
 * one of its itinerary/activity categories (see GET /api/offers/applicable).
 * Booking is never blocked here: a person can always continue without
 * applying an offer, even when none are available.
 */
export default function OfferSelection({ loading, offers, originalAmount, selectedOffer, onApply, onContinue }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Offers for your trip</p>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader label="Checking applicable offers…" size="md" />
        </div>
      )}

      {!loading && offers.length === 0 && (
        <div className="rounded-2xl border border-ink/10 px-4 py-6 text-center text-sm text-ink/50">
          No offers are currently available for this trip.
        </div>
      )}

      {!loading &&
        offers.map((offer) => {
          const discountAmount = Math.round((originalAmount * offer.discountPercent) / 100)
          const active = selectedOffer?.id === offer.id
          return (
            <div
              key={offer.id}
              className={`rounded-2xl border p-4 space-y-2.5 transition-colors ${
                active ? 'border-primary bg-primary/5' : 'border-ink/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <FaTags className="text-primary" /> {offer.title}
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">{offer.description}</p>
                </div>
                <span className="shrink-0 text-xs font-extrabold text-primary">{offer.discountPercent}% OFF</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <FaCheckCircle /> Applicable to your itinerary
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono px-2 py-1 rounded-lg bg-ink/5 text-ink/70">{offer.code}</span>
                <span className="text-ink/50">You save {formatCurrency(discountAmount)}</span>
              </div>

              <Button
                variant={active ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => onApply(active ? null : offer)}
              >
                {active ? 'Offer Applied' : 'Apply Offer'}
              </Button>
            </div>
          )
        })}

      <Button onClick={onContinue} className="w-full" size="lg">
        {selectedOffer ? 'Continue to Booking' : 'Continue Without Offer'} <FaArrowRight />
      </Button>
    </div>
  )
}
