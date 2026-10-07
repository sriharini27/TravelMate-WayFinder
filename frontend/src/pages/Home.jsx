import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaRobot, FaHotel, FaWallet, FaCloudSun, FaClock, FaMapMarkedAlt } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import DestinationCard from '../components/home/DestinationCard.jsx'
import Hero from '../components/home/Hero.jsx'
import FeatureCard from '../components/home/FeatureCard.jsx'
import PackageCard from '../components/home/PackageCard.jsx'
import TestimonialCard from '../components/home/TestimonialCard.jsx'
import RecentlyAccessedSection from '../components/home/RecentlyAccessedSection.jsx'
import destinations from '../data/destinations.js'
import packages from '../data/packages.js'
import reviewService from '../services/reviewService.js'
import { fadeUp, scaleIn } from '../utils/motionVariants.js'
import useScrollToTop from '../hooks/useScrollToTop.js'
import { useAuth } from '../context/AuthContext.jsx'

// Maps a real, MongoDB-backed Review document to the shape TestimonialCard
// expects, so the homepage "What Our Travellers Say" section now shows
// actual stored reviews instead of the old permanent testimonials.js array.
function reviewToTestimonial(review) {
  return {
    id: review.id,
    name: review.user?.name || 'TravelMate Traveller',
    country: review.destination,
    rating: review.rating,
    review: review.comment,
    photo: review.user?.profileImage || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(review.user?.name || 'T'),
  }
}

function matchesBudgetRange(price, range) {
  if (range === 'Budget') return price < 25000
  if (range === 'Premium') return price > 75000
  return price >= 25000 && price <= 75000
}

function scoreDestination(destination, preferences) {
  const styleOverlap = (destination.styles || []).filter((s) => preferences.styles?.includes(s)).length
  const budgetMatch = preferences.budgetRange && matchesBudgetRange(destination.price, preferences.budgetRange) ? 1 : 0
  return styleOverlap * 2 + budgetMatch
}

function matchesSearchFilters(destination, filters) {
  if (filters.region && destination.region !== filters.region) return false
  if (filters.styles.length > 0 && !filters.styles.some((s) => destination.styles?.includes(s))) return false
  if (filters.budgetRange && !matchesBudgetRange(destination.price, filters.budgetRange)) return false
  if (filters.minRating > 0 && destination.rating < filters.minRating) return false
  return true
}

const features = [
  {
    icon: FaRobot,
    title: 'AI Trip Planner',
    description: 'Generate a full day-wise itinerary tailored to your budget, interests and travel dates in seconds.',
    color: '#2563EB',
  },
  {
    icon: FaClock,
    title: 'Arrival-Aware Check-in',
    description: "TravelMate adapts Day 1 of your trip around your actual arrival time, not just the standard check-in.",
    color: '#F97316',
  },
  {
    icon: FaWallet,
    title: 'Smart Budget Optimization',
    description: 'Transparent cost breakdown covering hotel, transport, food, activities and check-in fees.',
    color: '#14B8A6',
  },
  {
    icon: FaCloudSun,
    title: 'Weather-Aware Planning',
    description: 'Destination-specific weather insights help shape realistic, comfortable daily plans.',
    color: '#6366F1',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Personalized Itinerary',
    description: 'Every day is built around the interests and travel style you choose — not a generic template.',
    color: '#EC4899',
  },
  {
    icon: FaHotel,
    title: 'Smart Hotel Recommendations',
    description: 'Compare hotels by rating, price and check-in flexibility, then select the one that fits your plan.',
    color: '#0EA5E9',
  },
]

const steps = [
  { number: '1', title: 'Tell us your preferences', description: 'Destination, budget, dates, arrival time and travel style.' },
  { number: '2', title: 'TravelMate generates your trip', description: 'A full day-wise itinerary and budget, built instantly.' },
  { number: '3', title: 'Optimize hotel + arrival time', description: 'Pick your hotel and choose how to handle an early arrival.' },
  { number: '4', title: 'Book and travel', description: 'Confirm your booking and get a unique booking ID instantly.' },
]

export default function Home() {
  useScrollToTop()
  const { user } = useAuth()
  const hasPreferences = !!(user?.preferences && (user.preferences.styles?.length || user.preferences.budgetRange))
  const [showAll, setShowAll] = useState(!hasPreferences)
  const [searchFilters, setSearchFilters] = useState(null)
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    let cancelled = false
    reviewService
      .featured()
      .then((reviews) => {
        if (!cancelled) setTestimonials(reviews.map(reviewToTestimonial))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const orderedDestinations = useMemo(() => {
    if (!hasPreferences) return destinations
    return [...destinations].sort((a, b) => scoreDestination(b, user.preferences) - scoreDestination(a, user.preferences))
  }, [hasPreferences, user])

  const preferenceFiltered =
    hasPreferences && !showAll ? orderedDestinations.filter((d) => scoreDestination(d, user.preferences) > 0) : orderedDestinations

  const displayedDestinations = searchFilters
    ? orderedDestinations.filter((d) => matchesSearchFilters(d, searchFilters))
    : preferenceFiltered.length > 0
    ? preferenceFiltered
    : destinations

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero onApplyFilters={setSearchFilters} />

      {/* Spacer to offset the floating search card overlap */}
      <div className="h-24 md:h-32" />

      <RecentlyAccessedSection />

      <section id="destinations" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Popular Destinations"
            subtitle="From tropical islands to alpine peaks — explore trips curated by our travel experts."
          />
          <div className="flex items-center gap-3">
            {searchFilters && (
              <button
                onClick={() => setSearchFilters(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white shadow-card text-red-500 hover:bg-red-50 transition-colors"
              >
                Clear Filters ✕
              </button>
            )}
            {!searchFilters && hasPreferences && (
              <div className="flex gap-2 bg-white rounded-full p-1.5 shadow-card">
                <button
                  onClick={() => setShowAll(false)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    !showAll ? 'gradient-primary text-white' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  Recommended for You
                </button>
                <button
                  onClick={() => setShowAll(true)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    showAll ? 'gradient-primary text-white' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  All Destinations ({destinations.length})
                </button>
              </div>
            )}
          </div>
        </div>
        {displayedDestinations.length === 0 ? (
          <div className="mt-12 bg-white rounded-3xl shadow-card p-12 text-center">
            <p className="text-ink/50 mb-4">No destinations match your filters.</p>
            <button
              onClick={() => setSearchFilters(null)}
              className="px-6 py-2.5 rounded-full font-semibold text-white gradient-primary shadow-card"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {displayedDestinations.map((d, i) => (
              <DestinationCard key={d.id} destination={d} index={i} />
            ))}
          </div>
        )}
      </section>

      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Why TravelMate"
            title="Why Choose TravelMate"
            subtitle="Everything you need to plan, book, and enjoy your next trip — powered by intelligent recommendations."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Simple process"
          title="How It Works"
          subtitle="From preferences to a booked trip in four intelligent steps."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              variants={scaleIn}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative bg-white rounded-3xl shadow-card p-6 pt-10"
            >
              <span className="absolute -top-5 left-6 w-10 h-10 rounded-full gradient-primary text-white grid place-items-center font-bold shadow-card">
                {s.number}
              </span>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="packages" className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Best value"
          title="Featured Packages"
          subtitle="All-inclusive packages designed to take the guesswork out of your next getaway."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading
              eyebrow="Loved by travellers"
              title="What Our Travellers Say"
              subtitle="Real reviews, posted by real signed-in TravelMate travellers."
            />
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="max-w-2xl"
    >
      <span className="text-secondary font-semibold text-xs uppercase tracking-widest">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-3">{title}</h2>
      <p className="text-ink/60">{subtitle}</p>
    </motion.div>
  )
}
