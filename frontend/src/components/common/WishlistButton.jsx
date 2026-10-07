import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import wishlistService from '../../services/wishlistService.js'

/**
 * Heart-icon toggle button, backed by the MongoDB wishlist API. Requires
 * login — a logged-out click sends the person to /login rather than silently
 * failing. `resourceType` is 'destination' | 'hotel' | 'package'.
 */
export default function WishlistButton({ resourceType, resourceId, resourceName, resourceImage = '', className = '' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState(null) // null = not loaded yet
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!user) {
      setItems([])
      return
    }
    wishlistService
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

  const existing = (items || []).find((i) => i.resourceType === resourceType && i.resourceId === String(resourceId))
  const saved = !!existing

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    setBusy(true)
    try {
      if (saved) {
        await wishlistService.remove(existing.id)
        setItems((prev) => prev.filter((i) => i.id !== existing.id))
      } else {
        const item = await wishlistService.add({
          resourceType,
          resourceId: String(resourceId),
          resourceName,
          resourceImage,
        })
        setItems((prev) => [item, ...(prev || [])])
      }
    } catch {
      // best-effort — the button just stays in its previous state
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      className={`w-10 h-10 rounded-full grid place-items-center transition-colors shrink-0 ${
        saved ? 'bg-red-50 text-red-500' : 'bg-white/90 text-ink/40 hover:text-red-400'
      } shadow-card disabled:opacity-60 ${className}`}
    >
      <FaHeart className={saved ? '' : 'opacity-60'} />
    </button>
  )
}
