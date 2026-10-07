import { createContext, useContext, useEffect, useState } from 'react'
import catalogService from '../services/catalogService.js'
import { setDestinations } from '../data/destinations.js'
import { setHotels } from '../data/hotels.js'
import { setPackages } from '../data/packages.js'
import { setAllItineraryBanks } from '../data/itinerary.js'
import { setWeather } from '../data/weather.js'
import { setAllAttractions } from '../data/attractions.js'
import Loader from '../components/common/Loader.jsx'

const CatalogContext = createContext(null)

/**
 * Loads the application's reference data (destinations, hotels, packages,
 * itinerary banks, offers) from the MongoDB-backed REST API exactly once at
 * startup, and populates the existing client-side data modules in place —
 * see src/data/*.js. Everything downstream (generateTrip.js, destinationHelpers.js,
 * Home/DestinationDetails/PackageDetails/HotelDetails, the planner, etc.) keeps
 * reading those same modules, so almost none of that code had to change.
 */
export function CatalogProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [offers, setOffersState] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [destinations, hotels, packages, itineraries, offersList, attractions] = await Promise.all([
          catalogService.getDestinations(),
          catalogService.getHotels(),
          catalogService.getPackages(),
          catalogService.getItineraries(),
          catalogService.getOffers(),
          catalogService.getAttractions(),
        ])
        if (cancelled) return
        setDestinations(destinations)
        setHotels(hotels)
        setPackages(packages)
        setAllItineraryBanks(itineraries)
        setWeather(destinations)
        setOffersState(offersList)
        setAllAttractions(attractions)
        setReady(true)
      } catch (err) {
        if (cancelled) return
        setError(
          "Couldn't reach the TravelMate API. Make sure the backend server is running and MONGODB_URI is configured — see the README."
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center bg-bg">
        <div className="max-w-md">
          <h1 className="text-xl font-bold mb-3">Can't connect to TravelMate's backend</h1>
          <p className="text-ink/60 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader label="Loading TravelMate…" size="lg" />
      </div>
    )
  }

  return <CatalogContext.Provider value={{ offers }}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider')
  return ctx
}
