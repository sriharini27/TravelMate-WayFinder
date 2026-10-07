import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaMapMarkerAlt, FaClock, FaCheckCircle, FaMagic } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import WishlistButton from '../components/common/WishlistButton.jsx'
import hotels from '../data/hotels.js'
import { formatCurrency, fadeUp } from '../utils/motionVariants.js'
import useScrollToTop from '../hooks/useScrollToTop.js'
import useRecordAccess from '../hooks/useRecordAccess.js'

export default function HotelDetails() {
  useScrollToTop()
  const { id } = useParams()
  const navigate = useNavigate()

  const hotel = hotels.find((h) => String(h.id) === String(id))
  useRecordAccess({
    resourceType: 'hotel',
    resourceId: hotel?.id,
    resourceName: hotel?.name,
    resourceImage: hotel?.image,
  })

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32">
          <h1 className="text-2xl font-bold mb-3">Hotel not found</h1>
          <p className="text-ink/50 mb-6">We couldn't find the hotel you're looking for.</p>
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
        <img src={hotel.image} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute top-28 right-6">
          <WishlistButton
            resourceType="hotel"
            resourceId={hotel.id}
            resourceName={hotel.name}
            resourceImage={hotel.image}
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt /> {hotel.distanceFromCenter}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" /> {hotel.rating} rating
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-5 mb-10">
            <div className="rounded-2xl border border-ink/10 p-5">
              <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold flex items-center gap-1 mb-1">
                <FaClock /> Standard Check-in
              </p>
              <p className="font-bold text-lg">{hotel.standardCheckIn}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 p-5">
              <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold flex items-center gap-1 mb-1">
                <FaClock /> Standard Check-out
              </p>
              <p className="font-bold text-lg">{hotel.standardCheckOut}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl border border-ink/10 p-5 mb-10">
            <p className="font-bold mb-2">Early Check-in</p>
            {hotel.earlyCheckinAvailable ? (
              <p className="text-sm text-ink/60">
                Available for an additional <strong>{formatCurrency(hotel.earlyCheckinFee)}</strong>. Our AI
                planner will offer this automatically if your arrival time is earlier than standard check-in.
              </p>
            ) : (
              <p className="text-sm text-ink/60">
                Early check-in isn't available at this property. The planner will suggest flexible check-in or
                luggage storage instead if you arrive early.
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-accent" /> Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-fit lg:sticky lg:top-28"
        >
          <div className="bg-white rounded-3xl shadow-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Price per night</p>
            <p className="text-3xl font-extrabold text-primary mb-6">{formatCurrency(hotel.pricePerNight)}</p>

            <button
              onClick={() => navigate('/planner', { state: { prefill: { destination: hotel.destination } } })}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all mb-3"
            >
              <FaMagic /> Plan a Trip With This Hotel
            </button>
            <p className="text-xs text-ink/40 text-center">
              You'll be able to select this hotel directly inside the AI planner.
            </p>
          </div>
        </motion.aside>
      </section>

      <Footer />
    </div>
  )
}
