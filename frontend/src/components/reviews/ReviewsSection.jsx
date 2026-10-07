import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaRegStar, FaCommentDots } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext.jsx'
import reviewService from '../../services/reviewService.js'
import { apiErrorMessage } from '../../services/api.js'

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1 text-amber-400 text-lg">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= value ? (
          <FaStar key={n} className="cursor-pointer" onClick={() => onChange(n)} />
        ) : (
          <FaRegStar key={n} className="cursor-pointer" onClick={() => onChange(n)} />
        )
      )}
    </div>
  )
}

/** Real, MongoDB-backed reviews for a destination — list + a submission form for signed-in users. */
export default function ReviewsSection({ destinationName }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    reviewService
      .list(destinationName)
      .then((list) => {
        if (!cancelled) setReviews(list)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [destinationName])

  const submit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const item = await reviewService.create({ destination: destinationName, rating, comment: comment.trim() })
      setReviews((prev) => [{ ...item, user: { name: user.name, profileImage: user.profileImage } }, ...prev])
      setComment('')
      setRating(5)
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't submit your review."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
        <FaCommentDots className="text-primary" /> Traveller Reviews
      </h3>

      {user ? (
        <form onSubmit={submit} className="rounded-2xl border border-ink/10 p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Your rating</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={`Share what you loved (or didn't) about ${destinationName}…`}
            className="input-field mt-3 resize-none"
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="mt-3 px-5 py-2.5 rounded-full font-semibold text-sm text-white gradient-primary shadow-card disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post Review'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-ink/50 mb-6">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>{' '}
          to leave a review of {destinationName}.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-ink/40">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink/40">No reviews yet — be the first to share your experience.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-ink/10 p-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-semibold text-sm">{r.user?.name || 'Traveller'}</p>
                <div className="flex gap-0.5 text-amber-400 text-xs">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-ink/60 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
