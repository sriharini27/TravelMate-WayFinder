import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaQrcode,
  FaRedo,
  FaArrowLeft,
  FaSuitcaseRolling,
} from 'react-icons/fa'
import Button from '../common/Button.jsx'
import Loader from '../common/Loader.jsx'
import { formatCurrency } from '../../utils/motionVariants.js'

const DEMO_UPI_ID = 'travelmate@demo'

/**
 * Frontend-only simulated payment step. This NEVER talks to a real payment
 * gateway or UPI/bank network — it only simulates the three outcomes a real
 * payment could have, so the rest of the booking flow can be exercised end
 * to end. Nothing here should ever be mistaken for real payment verification.
 *
 * status: 'method' | 'processing' | 'success' | 'failed' | 'pending'
 */
export default function PaymentPanel({
  status,
  amount,
  paymentMethod,
  onSimulateSuccess,
  onSimulateFailure,
  onSimulatePending,
  onRetry,
  onBackToPayment,
  onViewMyTrip,
  paymentId,
  bookingId,
}) {
  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {status === 'method' && (
          <motion.div key="method" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wide mb-3">
                Demo Payment — No real money is charged
              </span>
              <FaQrcode className="text-4xl text-primary mx-auto mb-3" />
              <p className="text-sm text-ink/60 mb-1">
                Pay via <span className="font-semibold text-ink">{paymentMethod}</span>
              </p>
              {paymentMethod === 'UPI' && (
                <p className="text-xs text-ink/40 mb-1">
                  Demo UPI ID: <span className="font-mono font-semibold text-ink/70">{DEMO_UPI_ID}</span>
                </p>
              )}
              <p className="text-2xl font-extrabold text-primary mt-2">{formatCurrency(amount)}</p>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 text-center">
              Simulate the payment outcome
            </p>
            <div className="grid gap-2.5">
              <Button onClick={onSimulateSuccess} className="w-full" size="lg">
                <FaCheckCircle /> Simulate Successful Payment
              </Button>
              <Button onClick={onSimulatePending} variant="outline" className="w-full" size="md">
                <FaHourglassHalf /> Simulate Payment Pending
              </Button>
              <Button onClick={onSimulateFailure} variant="danger" className="w-full" size="md">
                <FaTimesCircle /> Simulate Payment Failure
              </Button>
            </div>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
            <Loader label="Processing your demo payment…" size="lg" />
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-accent/10 grid place-items-center text-3xl text-accent mx-auto mb-4"
            >
              <FaCheckCircle />
            </motion.div>
            <h4 className="text-xl font-extrabold mb-1">Payment Successful!</h4>
            <p className="text-ink/50 text-sm mb-5">Your booking has been confirmed.</p>
            <div className="rounded-2xl border border-ink/10 divide-y divide-ink/5 text-left mb-6">
              <Row label="Payment ID" value={paymentId} mono />
              <Row label="Booking ID" value={bookingId} mono />
              <Row label="Amount Paid" value={formatCurrency(amount)} />
              <Row label="Booking Status" value="Confirmed" accent />
            </div>
            <Button onClick={onViewMyTrip} className="w-full" size="lg">
              <FaSuitcaseRolling /> View My Trip
            </Button>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div key="failed" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 grid place-items-center text-3xl text-red-500 mx-auto mb-4">
              <FaTimesCircle />
            </div>
            <h4 className="text-xl font-extrabold mb-1">Payment Failed</h4>
            <p className="text-ink/50 text-sm mb-6">
              Your simulated payment didn't go through, and no booking was created. Nothing was charged — you can try again.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBackToPayment}>
                <FaArrowLeft /> Change Method
              </Button>
              <Button className="flex-1" onClick={onRetry}>
                <FaRedo /> Retry Payment
              </Button>
            </div>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div key="pending" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 grid place-items-center text-3xl text-amber-500 mx-auto mb-4">
              <FaHourglassHalf />
            </div>
            <h4 className="text-xl font-extrabold mb-1">Payment Pending</h4>
            <p className="text-ink/50 text-sm mb-6">
              Your simulated payment is still awaiting confirmation. No booking has been created yet — you can wait
              and retry, or return to payment options.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBackToPayment}>
                <FaArrowLeft /> Payment Options
              </Button>
              <Button className="flex-1" onClick={onRetry}>
                <FaRedo /> Retry Payment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value, mono = false, accent = false }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className={`font-semibold text-right ${mono ? 'font-mono text-xs' : ''} ${accent ? 'text-accent' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}
