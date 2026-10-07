import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaTrash } from 'react-icons/fa'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'
import Loader from '../components/common/Loader.jsx'
import wishlistService from '../services/wishlistService.js'
import { apiErrorMessage } from '../services/api.js'
import useScrollToTop from '../hooks/useScrollToTop.js'

const ROUTE_BY_TYPE = {
  destination: '/destinations',
  hotel: '/hotels',
  package: '/packages',
}

export default function Wishlist() {
  useScrollToTop()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    wishlistService
      .list()
      .then((list) => {
        if (!cancelled) setItems(list)
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, "Couldn't load your wishlist."))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const remove = async (id) => {
    const prev = items
    setItems((cur) => cur.filter((i) => i.id !== id))
    try {
      await wishlistService.remove(id)
    } catch {
      setItems(prev) // revert on failure
    }
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="gradient-hero pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white text-xs font-semibold mb-4">
            <FaHeart className="text-secondary" /> Wishlist
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Your Saved Places</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Destinations, hotels and packages you've favorited for later.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-3xl shadow-card p-16 flex items-center justify-center">
            <Loader label="Loading your wishlist…" size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-16 text-center">
            <FaHeart className="text-4xl text-ink/15 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Nothing saved yet</h2>
            <p className="text-ink/50 text-sm mb-6">
              Tap the heart icon on any destination, hotel or package to save it here.
            </p>
            <Link to="/" className="px-6 py-3 rounded-full font-semibold text-white gradient-primary shadow-card">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
                <Link to={`${ROUTE_BY_TYPE[item.resourceType] || '/'}/${item.resourceId}`} className="block">
                  {item.resourceImage ? (
                    <img src={item.resourceImage} alt={item.resourceName} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-ink/5" />
                  )}
                </Link>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{item.resourceName}</p>
                    <p className="text-xs text-ink/40 capitalize">{item.resourceType}</p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove from wishlist"
                    className="w-9 h-9 rounded-full grid place-items-center text-red-400 hover:bg-red-50 shrink-0"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
