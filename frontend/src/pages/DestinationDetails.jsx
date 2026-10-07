import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaMapMarkerAlt, FaCloudSun, FaLightbulb, FaMagic, FaHotel, FaCalendarAlt, FaWallet } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import PackageCard from '../components/home/PackageCard.jsx'
import WishlistButton from '../components/common/WishlistButton.jsx'
import ReviewsSection from '../components/reviews/ReviewsSection.jsx'
import destinations from '../data/destinations.js'
import packagesData from '../data/packages.js'
import { getHotelsForDestination, getBankForDestination, getWeatherForDestination } from '../utils/destinationHelpers.js'
import { fadeUp, formatCurrency } from '../utils/motionVariants.js'
import useScrollToTop from '../hooks/useScrollToTop.js'
import useRecordAccess from '../hooks/useRecordAccess.js'

export default function DestinationDetails() {
  useScrollToTop()
  const { id } = useParams()
  const navigate = useNavigate()

  const destination = destinations.find((d) => String(d.id) === String(id))
  useRecordAccess({
    resourceType: 'destination',
    resourceId: destination?.id,
    resourceName: destination?.name,
    resourceImage: destination?.image,
  })
  const bank = destination ? getBankForDestination(destination.name) : null
  const weather = destination ? getWeatherForDestination(destination.name) : null
  const relatedPackages = destination ? packagesData.filter((p) => p.destination === destination.name) : []
  const destinationHotels = destination
    ? [...getHotelsForDestination(destination.name)].sort((a, b) => b.rating - a.rating)
    : []

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32">
          <h1 className="text-2xl font-bold mb-3">Destination not found</h1>
          <p className="text-ink/50 mb-6">We couldn't find the destination you're looking for.</p>
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

      {/* Hero banner */}
      <section className="relative h-[420px] md:h-[480px]">
        <img src={destination.image} alt={destination.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute top-28 right-6">
          <WishlistButton
            resourceType="destination"
            resourceId={destination.id}
            resourceName={destination.name}
            resourceImage={destination.image}
          />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 rounded-full gradient-secondary text-white text-xs font-semibold mb-4">
              {destination.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt /> {destination.country}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" /> {destination.rating} rating
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Main content */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-extrabold mb-3">About {destination.name}</h2>
            <p className="text-ink/60 leading-relaxed mb-8">{destination.description}</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-5 mb-10"
          >
            <div className="rounded-2xl border border-ink/10 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary grid place-items-center text-xl shrink-0">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold">Best Time to Visit</p>
                <p className="font-semibold text-sm">{destination.bestSeason}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/10 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent grid place-items-center text-xl shrink-0">
                <FaWallet />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold">Estimated Budget</p>
                <p className="font-semibold text-sm">{destination.budgetEstimate}</p>
              </div>
            </div>
          </motion.div>

          {weather && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl gradient-primary text-white p-5 flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center text-2xl shrink-0">
                <FaCloudSun />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">Weather</p>
                <p className="font-semibold text-sm">
                  {weather.temperature}°C · {weather.condition} · {weather.humidity}% humidity
                </p>
              </div>
            </motion.div>
          )}

          {bank && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" /> Popular Attractions
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {bank.attractions.map((a) => (
                  <div key={a} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ink/10 text-sm text-ink/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {destinationHotels.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaHotel className="text-primary" /> Recommended Hotels
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {destinationHotels.map((h) => (
                  <Link
                    key={h.id}
                    to={`/hotels/${h.id}`}
                    className="rounded-2xl border border-ink/10 overflow-hidden hover:shadow-card transition-shadow"
                  >
                    <img src={h.image} alt={h.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate">{h.name}</p>
                      <p className="text-xs text-primary font-bold">{formatCurrency(h.pricePerNight)}/night</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {bank && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaLightbulb className="text-accent" /> Travel Tips
              </h3>
              <ul className="space-y-2">
                {bank.tips.map((t) => (
                  <li key={t} className="text-sm text-ink/60 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {relatedPackages.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12">
              <h3 className="text-xl font-bold mb-5">Available Packages</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedPackages.map((p, i) => (
                  <PackageCard key={p.id} pkg={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12">
            <ReviewsSection destinationName={destination.name} />
          </motion.div>
        </div>

        {/* Sticky sidebar CTA */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-fit lg:sticky lg:top-28"
        >
          <div className="bg-white rounded-3xl shadow-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Starting from</p>
            <p className="text-3xl font-extrabold text-primary mb-1">{formatCurrency(destination.price)}</p>
            <p className="text-xs text-ink/40 mb-6">per person, all-inclusive estimate</p>

            <button
              onClick={() => navigate('/planner', { state: { prefill: { destination: destination.name } } })}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all mb-3"
            >
              <FaMagic /> Plan Trip Here
            </button>
            <p className="text-xs text-ink/40 text-center">
              Get a full AI-generated, arrival-aware itinerary for {destination.name}.
            </p>
          </div>
        </motion.aside>
      </section>

      <Footer />
    </div>
  )
}
