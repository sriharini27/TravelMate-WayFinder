import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBus,
  FaHotel,
  FaCalendarAlt,
  FaUsers,
} from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Button from '../components/common/Button.jsx'
import BookingModal from '../components/booking/BookingModal.jsx'
import WishlistButton from '../components/common/WishlistButton.jsx'
import packagesData from '../data/packages.js'
import { getHotelsForDestination } from '../utils/destinationHelpers.js'
import generateTrip from '../utils/generateTrip.js'
import { formatCurrency, fadeUp } from '../utils/motionVariants.js'
import useScrollToTop from '../hooks/useScrollToTop.js'
import useRecordAccess from '../hooks/useRecordAccess.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PackageDetails() {
  useScrollToTop()
  const { id } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const pkg = packagesData.find((p) => String(p.id) === String(id))
  useRecordAccess({
    resourceType: 'package',
    resourceId: pkg?.id,
    resourceName: pkg?.name,
    resourceImage: pkg?.image,
  })
  const topHotel = pkg
    ? [...getHotelsForDestination(pkg.destination)].sort((a, b) => b.rating - a.rating)[0]
    : null

  const [travelDate, setTravelDate] = useState(pkg?.availableDates?.[0] || '')
  const [travellers, setTravellers] = useState(2)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  useEffect(() => {
    if (location.state?.autoBook) setBookingModalOpen(true)
  }, [location.state])

  const trip = useMemo(() => {
    if (!pkg) return null
    return generateTrip({
      destination: pkg.destination,
      budget: pkg.price,
      days: pkg.days,
      travellers,
      hotelRating: 4,
      interests: [],
      userId,
      generationCount: 0,
    })
  }, [pkg, travellers, userId])

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32">
          <h1 className="text-2xl font-bold mb-3">Package not found</h1>
          <p className="text-ink/50 mb-6">We couldn't find the package you're looking for.</p>
          <Link to="/" className="px-6 py-3 rounded-full font-semibold text-white gradient-primary shadow-card">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="relative h-[380px] md:h-[440px]">
        <img src={pkg.image} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute top-28 right-6">
          <WishlistButton
            resourceType="package"
            resourceId={pkg.id}
            resourceName={pkg.name}
            resourceImage={pkg.image}
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {pkg.discount > 0 && (
              <span className="inline-block px-3 py-1 rounded-full gradient-secondary text-white text-xs font-bold mb-4">
                {pkg.discount}% OFF
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{pkg.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <span>{pkg.destination}</span>
              <span className="flex items-center gap-1.5">
                <FaClock /> {pkg.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" /> {pkg.rating}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-ink/60 leading-relaxed mb-10">
            {pkg.description}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
            <h3 className="text-xl font-bold mb-5">Day-wise Itinerary</h3>
            <div className="space-y-4">
              {pkg.dayWise.map((d) => (
                <div key={d.day} className="rounded-2xl border border-ink/10 p-5">
                  <p className="font-bold mb-2">
                    Day {d.day} — {d.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {d.activities.map((a) => (
                      <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary/80 font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl border border-ink/10 p-5">
              <p className="font-bold mb-3 flex items-center gap-2 text-accent">
                <FaCheckCircle /> Included
              </p>
              <ul className="space-y-2 text-sm text-ink/60">
                {pkg.included.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink/10 p-5">
              <p className="font-bold mb-3 flex items-center gap-2 text-red-400">
                <FaTimesCircle /> Excluded
              </p>
              <ul className="space-y-2 text-sm text-ink/60">
                {pkg.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-6">
            {topHotel && (
              <div className="rounded-2xl border border-ink/10 p-5 flex items-center gap-4">
                <img src={topHotel.image} alt={topHotel.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold flex items-center gap-1">
                    <FaHotel /> Hotel
                  </p>
                  <p className="font-semibold text-sm">{topHotel.name}</p>
                  <p className="text-xs text-ink/50">{topHotel.rating}★ · Check-in {topHotel.standardCheckIn}</p>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-ink/10 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center text-xl shrink-0">
                <FaBus />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold">Transportation</p>
                <p className="font-semibold text-sm">{pkg.transportation}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sticky booking sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-fit lg:sticky lg:top-28"
        >
          <div className="bg-white rounded-3xl shadow-card p-6">
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-3xl font-extrabold text-primary">{formatCurrency(pkg.price)}</p>
              {pkg.originalPrice > pkg.price && (
                <p className="text-ink/30 text-sm line-through">{formatCurrency(pkg.originalPrice)}</p>
              )}
            </div>
            <p className="text-xs text-ink/40 mb-6">per person estimate, {pkg.duration}</p>

            <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5 block">
              <FaCalendarAlt className="inline mr-1" /> Available Date
            </label>
            <select
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="input-field mb-4"
            >
              {pkg.availableDates.map((d) => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>

            <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5 block">
              <FaUsers className="inline mr-1" /> Travellers
            </label>
            <input
              type="number"
              min={1}
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value) || 1)}
              className="input-field mb-6"
            />

            <Button className="w-full" size="lg" onClick={() => setBookingModalOpen(true)}>
              Continue to Booking
            </Button>
          </div>
        </motion.aside>
      </section>

      {trip && (
        <BookingModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          trip={trip}
          pkg={pkg}
          travelDate={travelDate}
          travellers={travellers}
        />
      )}

      <Footer />
    </div>
  )
}
