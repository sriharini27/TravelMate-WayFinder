import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMoneyBillWave, FaCreditCard, FaUniversity, FaArrowRight } from 'react-icons/fa'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import BookingSummary from './BookingSummary.jsx'
import OfferSelection from './OfferSelection.jsx'
import PaymentPanel from './PaymentPanel.jsx'
import { useBookings } from '../../context/BookingsContext.jsx'
import { apiErrorMessage } from '../../services/api.js'
import catalogService from '../../services/catalogService.js'
import { interestsToCategories } from '../../utils/generateTrip.js'

const paymentMethods = [
  { id: 'UPI', label: 'UPI', icon: FaMoneyBillWave },
  { id: 'Card', label: 'Card', icon: FaCreditCard },
  { id: 'NetBanking', label: 'Net Banking', icon: FaUniversity },
]

// step: 'offers' -> 'summary' -> 'payment' (method | processing | success | failed | pending | error)
export default function BookingModal({ open, onClose, trip, pkg = null, travelDate = '', travellers = 1 }) {
  const { simulatePayment, startPendingPayment, updatePendingPayment, clearPendingPayment } = useBookings()
  const navigate = useNavigate()

  const [step, setStep] = useState('offers')
  const [offersLoading, setOffersLoading] = useState(false)
  const [offers, setOffers] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [paymentStep, setPaymentStep] = useState('method')
  const [paymentId, setPaymentId] = useState(null)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  // Prevents a double-click (or a re-render) from firing the simulation twice
  // for the same attempt — the backend is also idempotent per request, but
  // this avoids sending a duplicate request in the first place.
  const inFlightRef = useRef(false)

  const originalAmount = trip?.budget?.total || 0
  const discountAmount = selectedOffer ? Math.round((originalAmount * selectedOffer.discountPercent) / 100) : 0
  const amount = originalAmount - discountAmount

  // Fetch destination + itinerary-category matching offers as soon as the
  // "Book Ticket" flow opens, so the offers step never has to wait on a
  // click inside the modal itself.
  useEffect(() => {
    if (!open || !trip) return
    setOffersLoading(true)
    catalogService
      .getApplicableOffers({
        destination: trip.destination,
        categories: interestsToCategories(trip.interests || []),
        totalAmount: trip.budget.total,
      })
      .then((items) => setOffers(items || []))
      .catch(() => setOffers([]))
      .finally(() => setOffersLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trip?.destination])

  if (!trip) return null

  const resetAndClose = () => {
    setStep('offers')
    setSelectedOffer(null)
    setPaymentStep('method')
    setPaymentId(null)
    setCreatedBooking(null)
    setErrorMessage('')
    inFlightRef.current = false
    clearPendingPayment()
    onClose?.()
  }

  const handleContinueFromOffers = () => setStep('summary')

  const handleProceedToPay = () => {
    startPendingPayment({ destination: trip.destination, amount, paymentMethod, status: 'method' })
    setStep('payment')
    setPaymentStep('method')
  }

  const runSimulation = async (outcome) => {
    if (inFlightRef.current) return // guard against duplicate simulate/booking attempts
    inFlightRef.current = true
    setPaymentStep('processing')
    updatePendingPayment({ status: 'processing' })

    try {
      const { payment, booking } = await simulatePayment({
        amount,
        paymentMethod,
        outcome,
        bookingDraft: { trip, pkg, travelDate, travellers },
        offer: selectedOffer ? { offerId: selectedOffer.id } : null,
      })
      setPaymentId(payment.paymentId)
      if (outcome === 'success') {
        setCreatedBooking(booking)
        setPaymentStep('success')
      } else if (outcome === 'failed') {
        updatePendingPayment({ status: 'failed' })
        setPaymentStep('failed')
      } else {
        updatePendingPayment({ status: 'pending' })
        setPaymentStep('pending')
      }
    } catch (err) {
      // Network/server error during the demo payment — never silently lose
      // the user here, and never leave a half-created booking behind.
      setErrorMessage(apiErrorMessage(err, 'Could not reach TravelMate right now. Please try again.'))
      setPaymentStep('error')
    } finally {
      inFlightRef.current = false
    }
  }

  const handleViewMyTrip = () => {
    resetAndClose()
    navigate('/my-trips')
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={step === 'offers' ? 'Check Applicable Offers' : step === 'summary' ? 'Confirm Your Booking' : 'Complete Payment'}
      maxWidth="max-w-md"
    >
      {step === 'offers' && (
        <OfferSelection
          loading={offersLoading}
          offers={offers}
          originalAmount={originalAmount}
          selectedOffer={selectedOffer}
          onApply={setSelectedOffer}
          onContinue={handleContinueFromOffers}
        />
      )}

      {step === 'summary' && (
        <div className="space-y-5">
          <BookingSummary trip={trip} pkg={pkg} travelDate={travelDate} travellers={travellers} offer={selectedOffer} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((m) => {
                const Icon = m.icon
                const active = paymentMethod === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                      active ? 'border-primary bg-primary/5 text-primary' : 'border-ink/10 text-ink/60'
                    }`}
                  >
                    <Icon className="text-base" />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Button onClick={handleProceedToPay} className="w-full" size="lg">
            Proceed to Pay <FaArrowRight />
          </Button>
          <p className="text-xs text-ink/40 text-center -mt-2">
            This is a demo checkout — no real payment is processed.
          </p>
        </div>
      )}

      {step === 'payment' && paymentStep === 'error' && (
        <div className="text-center space-y-4">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <Button onClick={() => setPaymentStep('method')} className="w-full">
            Back to Payment Options
          </Button>
        </div>
      )}

      {step === 'payment' && paymentStep !== 'error' && (
        <PaymentPanel
          status={paymentStep}
          amount={amount}
          paymentMethod={paymentMethod}
          paymentId={paymentId}
          bookingId={createdBooking?.bookingId}
          onSimulateSuccess={() => runSimulation('success')}
          onSimulateFailure={() => runSimulation('failed')}
          onSimulatePending={() => runSimulation('pending')}
          onRetry={() => setPaymentStep('method')}
          onBackToPayment={() => setStep('summary')}
          onViewMyTrip={handleViewMyTrip}
        />
      )}
    </Modal>
  )
}
