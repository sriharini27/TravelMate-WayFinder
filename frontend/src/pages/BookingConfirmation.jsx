import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Loader from '../components/common/Loader.jsx'
import BookingConfirmationCard from '../components/booking/BookingConfirmation.jsx'
import { useBookings } from '../context/BookingsContext.jsx'
import useScrollToTop from '../hooks/useScrollToTop.js'

export default function BookingConfirmationPage() {
  useScrollToTop()
  const { id } = useParams()
  const { getBooking } = useBookings()
  const [booking, setBooking] = useState(undefined) // undefined = loading, null = not found

  useEffect(() => {
    let cancelled = false
    setBooking(undefined)
    getBooking(id).then((result) => {
      if (!cancelled) setBooking(result)
    })
    return () => {
      cancelled = true
    }
  }, [id, getBooking])

  if (booking === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32">
          <Loader label="Loading booking…" size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32">
          <h1 className="text-2xl font-bold mb-3">Booking not found</h1>
          <p className="text-ink/50 mb-6">We couldn't find a booking with that ID.</p>
          <Link to="/my-trips" className="px-6 py-3 rounded-full font-semibold text-white gradient-primary shadow-card">
            View My Trips
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <section className="gradient-hero pt-32 pb-24 px-6">
        <BookingConfirmationCard booking={booking} />
      </section>
      <Footer />
    </div>
  )
}
