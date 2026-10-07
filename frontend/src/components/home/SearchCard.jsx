import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FaPlaneDeparture,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaMagic,
  FaExclamationCircle,
  FaSlidersH,
  FaMapMarkedAlt,
} from 'react-icons/fa'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import destinationsData from '../../data/destinations.js'
import citiesData from '../../data/cities.js'
import { getClosestDestinations } from '../../utils/proximity.js'

const travelStyles = ['Adventure', 'Beach', 'Nature', 'Luxury', 'Family', 'Honeymoon', 'Heritage', 'Food']
const regionOptions = ['North', 'South', 'East', 'West', 'Central', 'International']
const budgetRanges = [
  { id: 'Budget', label: 'Budget', hint: '< ₹25,000' },
  { id: 'Mid', label: 'Mid-range', hint: '₹25,000–75,000' },
  { id: 'Premium', label: 'Premium', hint: '> ₹75,000' },
]
const ratingOptions = [
  { id: 0, label: 'Any Rating' },
  { id: 4, label: '4.0+' },
  { id: 4.5, label: '4.5+' },
]

const emptyFilters = { styles: [], region: null, budgetRange: null, minRating: 0 }

export default function SearchCard({ onApplyFilters }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    sourceCity: citiesData[0].name,
    destination: '',
    travelDate: '',
    returnDate: '',
    budget: '',
    travellers: 2,
    travelStyle: 'Adventure',
  })
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)
  const [filtersActive, setFiltersActive] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  // Computed on every render (not once at module load) so this picks up the
  // real destinations once CatalogContext populates data/destinations.js from the API.
  const domesticDestinations = destinationsData.filter((d) => d.region !== 'International')
  const internationalDestinations = destinationsData.filter((d) => d.region === 'International')

  const closestDestinations = useMemo(
    () => getClosestDestinations(form.sourceCity, destinationsData, 4),
    [form.sourceCity]
  )

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!form.destination) {
      setError('Please choose a destination to generate your AI trip.')
      return
    }
    if (!form.travelDate) {
      setError('Please select a travel date.')
      return
    }
    setError('')
    navigate('/planner', { state: { prefill: form } })
  }

  const toggleFilterStyle = (style) => {
    setFilters((prev) => ({
      ...prev,
      styles: prev.styles.includes(style) ? prev.styles.filter((s) => s !== style) : [...prev.styles, style],
    }))
  }

  const applyFilters = () => {
    const hasActive = filters.styles.length > 0 || filters.region || filters.budgetRange || filters.minRating > 0
    setFiltersActive(hasActive)
    onApplyFilters?.(hasActive ? filters : null)
    setFiltersOpen(false)
    setTimeout(() => {
      document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    setFiltersActive(false)
    onApplyFilters?.(null)
  }

  return (
    <>
      <motion.form
        onSubmit={handleGenerate}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-soft p-6 md:p-8"
      >
        <div className="grid md:grid-cols-7 gap-4 items-end">
          <Field label="From" icon={<FaPlaneDeparture className="text-primary" />}>
            <select
              value={form.sourceCity}
              onChange={update('sourceCity')}
              className="w-full outline-none text-sm font-medium bg-transparent"
            >
              {citiesData.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Destination" icon={<FaMapMarkerAlt className="text-primary" />}>
            <select
              value={form.destination}
              onChange={update('destination')}
              className="w-full outline-none text-sm font-medium bg-transparent"
            >
              <option value="">Where to?</option>
              <optgroup label="Domestic">
                {domesticDestinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="International">
                {internationalDestinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </Field>

          <Field label="Travel Date" icon={<FaCalendarAlt className="text-primary" />}>
            <input
              type="date"
              value={form.travelDate}
              onChange={update('travelDate')}
              className="w-full outline-none text-sm font-medium text-ink/70"
            />
          </Field>

          <Field label="Return Date" icon={<FaCalendarAlt className="text-primary" />}>
            <input
              type="date"
              value={form.returnDate}
              onChange={update('returnDate')}
              className="w-full outline-none text-sm font-medium text-ink/70"
            />
          </Field>

          <Field label="Budget / Person" icon={<FaWallet className="text-primary" />}>
            <input
              type="number"
              value={form.budget}
              onChange={update('budget')}
              placeholder="₹ per person"
              className="w-full outline-none text-sm font-medium placeholder:text-ink/30"
            />
          </Field>

          <Field label="Travellers" icon={<FaUsers className="text-primary" />}>
            <input
              type="number"
              min={1}
              value={form.travellers}
              onChange={update('travellers')}
              className="w-full outline-none text-sm font-medium"
            />
          </Field>

          <Field label="Travel Style">
            <select
              value={form.travelStyle}
              onChange={update('travelStyle')}
              className="w-full outline-none text-sm font-medium bg-transparent"
            >
              {travelStyles.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Closest-to-source suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-ink/40 uppercase tracking-wide">
            <FaMapMarkedAlt /> Closest to {form.sourceCity}:
          </span>
          {closestDestinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setForm({ ...form, destination: d.name })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                form.destination === d.name
                  ? 'gradient-primary text-white border-transparent'
                  : 'border-ink/10 text-ink/60 hover:border-primary/40'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {error && (
          <p className="flex items-center justify-center gap-2 text-sm text-red-500 mt-4">
            <FaExclamationCircle /> {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <FaMagic /> Generate AI Trip
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border transition-all ${
              filtersActive
                ? 'border-accent bg-accent/5 text-accent'
                : 'border-ink/15 text-ink/70 hover:border-primary/40 hover:text-primary'
            }`}
          >
            <FaSlidersH /> Filters {filtersActive && `(${filters.styles.length + (filters.region ? 1 : 0) + (filters.budgetRange ? 1 : 0) + (filters.minRating > 0 ? 1 : 0)})`}
          </button>
        </div>
      </motion.form>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filter Destinations" maxWidth="max-w-lg">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Region</p>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, region: prev.region === r ? null : r }))}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filters.region === r
                      ? 'gradient-primary text-white border-transparent'
                      : 'border-ink/10 text-ink/60 hover:border-primary/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Travel Style</p>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleFilterStyle(style)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filters.styles.includes(style)
                      ? 'gradient-primary text-white border-transparent'
                      : 'border-ink/10 text-ink/60 hover:border-primary/40'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Budget Range</p>
            <div className="grid grid-cols-3 gap-2">
              {budgetRanges.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, budgetRange: prev.budgetRange === b.id ? null : b.id }))
                  }
                  className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    filters.budgetRange === b.id ? 'border-primary bg-primary/5 text-primary' : 'border-ink/10 text-ink/60'
                  }`}
                >
                  <span className="font-semibold">{b.label}</span>
                  <span className="text-[10px] text-ink/40">{b.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Minimum Rating</p>
            <div className="flex gap-2">
              {ratingOptions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: r.id }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    filters.minRating === r.id ? 'border-primary bg-primary/5 text-primary' : 'border-ink/10 text-ink/60'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={resetFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function Field({ label, icon, children }) {
  return (
    <div className="border border-ink/10 rounded-2xl px-4 py-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink/40 mb-1">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}
