import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHistory } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext.jsx'
import recentlyAccessedService from '../../services/recentlyAccessedService.js'
import { fadeUp } from '../../utils/motionVariants.js'

const ROUTE_BY_TYPE = {
  destination: '/destinations',
  hotel: '/hotels',
  package: '/packages',
}

/**
 * Shows the signed-in user's last few viewed destinations/hotels/packages,
 * backed by MongoDB (never hardcoded) — hidden entirely for logged-out
 * visitors or once there's nothing to show yet.
 */
export default function RecentlyAccessedSection() {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    let cancelled = false
    recentlyAccessedService
      .list()
      .then((list) => {
        if (!cancelled) setItems(list)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user || items.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-6 pt-4 pb-4">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h3 className="text-sm font-bold text-ink/50 uppercase tracking-wide flex items-center gap-2 mb-4">
          <FaHistory className="text-primary" /> Recently Viewed
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {items.slice(0, 10).map((item) => (
            <Link
              key={item.id}
              to={`${ROUTE_BY_TYPE[item.resourceType] || '/'}/${item.resourceId}`}
              className="shrink-0 w-44 rounded-2xl border border-ink/10 overflow-hidden bg-white hover:shadow-card transition-shadow"
            >
              {item.resourceImage ? (
                <img src={item.resourceImage} alt={item.resourceName} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 bg-ink/5" />
              )}
              <div className="p-3">
                <p className="text-xs font-semibold truncate">{item.resourceName}</p>
                <p className="text-[10px] text-ink/40 capitalize">{item.resourceType}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
