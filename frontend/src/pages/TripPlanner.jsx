import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRoute, FaHotel, FaPlaneArrival } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Loader from '../components/common/Loader.jsx'
import Button from '../components/common/Button.jsx'
import PlannerForm from '../components/planner/PlannerForm.jsx'
import WeatherCard from '../components/planner/WeatherCard.jsx'
import HotelCard from '../components/planner/HotelCard.jsx'
import BudgetCard from '../components/planner/BudgetCard.jsx'
import ItineraryCard from '../components/planner/ItineraryCard.jsx'
import RecommendationCard from '../components/planner/RecommendationCard.jsx'
import AIRecommendation from '../components/planner/AIRecommendation.jsx'
import ArrivalCheckInCard from '../components/planner/ArrivalCheckInCard.jsx'
import BookingModal from '../components/booking/BookingModal.jsx'
import generateTrip from '../utils/generateTrip.js'
import destinationsData from '../data/destinations.js'
import citiesData from '../data/cities.js'
import { getHotelsForDestination } from '../utils/destinationHelpers.js'
import { formatCurrency } from '../utils/motionVariants.js'
import useScrollToTop from '../hooks/useScrollToTop.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function TripPlanner() {
  useScrollToTop()
  const location = useLocation()
  const prefill = location.state?.prefill || {}
  const { user } = useAuth()
  const userId = user?.id || 'guest'

  const [form, setForm] = useState({
    sourceCity: citiesData.some((c) => c.name === prefill.sourceCity) ? prefill.sourceCity : citiesData[0].name,
    destination: destinationsData.some((d) => d.name === prefill.destination) ? prefill.destination : 'Bali',
    budget: prefill.budget || 60000,
    days: 4,
    travellers: prefill.travellers || 2,
    travelDate: prefill.travelDate || '',
    arrivalTime: '',
    departureTime: '',
    hotelRating: 4,
    transport: 'Flight',
    needs: ['Need Hotel', 'Need Food'],
    interests: prefill.travelStyle ? [prefill.travelStyle] : ['Adventure', 'Beach'],
  })

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [arrivalOption, setArrivalOption] = useState(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  // Only bumped by an explicit "Generate AI Trip" click — part of the seed
  // that personalizes/shuffles the itinerary. Selecting a hotel or arrival
  // strategy calls regenerate() with the SAME count, so the plan already on
  // screen never reshuffles underneath the user — only cost/timing updates.
  const [generationCount, setGenerationCount] = useState(0)

  const handleGenerate = () => {
    setLoading(true)
    setSelectedHotel(null)
    setArrivalOption(null)
    const nextCount = generationCount + 1
    setTimeout(() => {
      const result = generateTrip({ ...form, userId, generationCount: nextCount })
      setGenerationCount(nextCount)
      setTrip(result)
      setLoading(false)
      setTimeout(() => {
        document.getElementById('trip-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }, 1200)
  }

  const regenerate = (overrides = {}) => {
    const nextHotel = 'hotel' in overrides ? overrides.hotel : selectedHotel
    const nextOption = 'arrivalOption' in overrides ? overrides.arrivalOption : arrivalOption
    const result = generateTrip({ ...form, selectedHotel: nextHotel, arrivalOption: nextOption, userId, generationCount })
    setTrip(result)
  }

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel)
    regenerate({ hotel })
  }

  const handleSelectArrivalOption = (option) => {
    setArrivalOption(option)
    regenerate({ arrivalOption: option })
  }

  const destinationHotels = getHotelsForDestination(form.destination)

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="gradient-hero pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white text-xs font-semibold mb-4">
            <FaRoute className="text-secondary" /> AI Smart Trip Planner
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Design Your Dream Trip</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Tell us your preferences — including your arrival time — and our AI will build a complete
            arrival-aware itinerary, budget and hotel recommendation.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10 pb-20">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          <PlannerForm form={form} setForm={setForm} onGenerate={handleGenerate} loading={loading} />

          <div id="trip-result">
            <AnimatePresence mode="wait">
              {!trip && !loading && <EmptyState key="empty" />}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl shadow-card p-10 min-h-[500px] flex items-center justify-center"
                >
                  <Loader label="Crafting your arrival-aware itinerary…" size="lg" />
                </motion.div>
              )}
              {trip && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <AIRecommendation trip={trip} travelStyle={form.interests[0]} />

                  <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
                    <div className="grid sm:grid-cols-2 gap-5 mb-6">
                      <WeatherCard weather={trip.weather} />
                      <HotelCard hotel={trip.hotel} />
                    </div>
                    <BudgetCard budget={trip.budget} />
                  </div>

                  {/* Arrival-aware check-in */}
                  <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
                    <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                      <FaPlaneArrival className="text-primary" /> Arrival-Aware Check-in
                    </h3>
                    <ArrivalCheckInCard
                      arrivalTime={form.arrivalTime}
                      hotel={trip.hotel}
                      selectedOptionId={arrivalOption?.id}
                      onSelect={handleSelectArrivalOption}
                    />
                  </div>

                  {/* Hotel picker */}
                  {destinationHotels.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
                      <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                        <FaHotel className="text-primary" /> Choose Your Hotel
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {destinationHotels.map((h) => (
                          <HotelCard
                            key={h.id}
                            hotel={h}
                            selectable
                            selected={trip.hotel.id === h.id}
                            onSelect={handleSelectHotel}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Itinerary */}
                  <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
                    <ItineraryCard itinerary={trip.itinerary} />
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
                    <RecommendationCard attractions={trip.attractions} tips={trip.tips} />
                  </div>

                  {/* Bottom summary + book */}
                  <div className="rounded-3xl gradient-primary p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Total Trip Budget</p>
                      <p className="text-3xl font-extrabold">{formatCurrency(trip.budget.total)}</p>
                      <p className="text-white/70 text-sm mt-1">
                        Recommended stay: {trip.hotel.name} · {trip.hotel.nights} nights
                      </p>
                    </div>
                    <Button variant="secondary" size="lg" onClick={() => setBookingModalOpen(true)}>
                      Book Entire Trip
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {trip && (
        <BookingModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          trip={trip}
          travelDate={form.travelDate}
          travellers={Number(form.travellers) || 1}
        />
      )}

      <Footer />
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full min-h-[500px] bg-white rounded-3xl shadow-card p-10 flex flex-col items-center justify-center text-center"
    >
      <div className="w-20 h-20 rounded-full gradient-primary grid place-items-center text-4xl text-white mb-6">
        ✈
      </div>
      <h3 className="text-xl font-bold mb-2">Your AI trip plan will appear here</h3>
      <p className="text-ink/50 max-w-sm">
        Fill in your travel preferences on the left — including your arrival time — and click "Generate AI Trip"
        to get a full itinerary, budget breakdown and arrival-aware hotel plan.
      </p>
    </motion.div>
  )
}
