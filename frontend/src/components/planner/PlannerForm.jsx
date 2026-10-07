import { motion } from 'framer-motion'
import { FaMagic } from 'react-icons/fa'
import destinationsData from '../../data/destinations.js'
import citiesData from '../../data/cities.js'

const transportOptions = [
  { key: 'Flight', icon: '✈️' },
  { key: 'Train', icon: '🚆' },
  { key: 'Bus', icon: '🚌' },
]
const interestOptions = ['Adventure', 'Nature', 'Beach', 'Luxury', 'History', 'Food', 'Shopping', 'Nightlife']
const checkboxOptions = ['Need Hotel', 'Need Food', 'Need Guide', 'Need Transportation']

export default function PlannerForm({ form, setForm, onGenerate, loading }) {
  // Computed on every render (not once at module load) so this picks up the
  // real destinations once CatalogContext populates data/destinations.js from the API.
  const domesticDestinations = destinationsData.filter((d) => d.region !== 'International')
  const internationalDestinations = destinationsData.filter((d) => d.region === 'International')

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleCheckbox = (option) => {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(option)
        ? prev.needs.filter((i) => i !== option)
        : [...prev.needs, option],
    }))
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={(e) => {
        e.preventDefault()
        onGenerate()
      }}
      className="bg-white rounded-3xl shadow-card p-6 md:p-8 space-y-6 sticky top-28"
    >
      <div>
        <h2 className="text-xl font-bold mb-1">Plan Your Trip</h2>
        <p className="text-sm text-ink/50">Fill in your preferences and let AI build your itinerary.</p>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/10 px-3.5 py-2.5 text-xs text-primary/80">
        <strong>Arrival-Aware Trip Optimization:</strong> add your arrival time below and we'll adapt your Day 1
        check-in plan automatically.
      </div>
      <div className="rounded-xl bg-accent/5 border border-accent/10 px-3.5 py-2.5 text-xs text-accent">
        <strong>Accurate Budgeting:</strong> transport cost is estimated from your actual departure city and
        destination, not a flat guess.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Departure City (Source)">
          <select value={form.sourceCity} onChange={update('sourceCity')} className="input-field">
            {citiesData.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Destination">
          <select value={form.destination} onChange={update('destination')} className="input-field">
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
        </FormField>

        <FormField label="Budget (₹) per person">
          <input
            type="number"
            min={5000}
            step={1000}
            value={form.budget}
            onChange={update('budget')}
            className="input-field"
          />
        </FormField>

        <FormField label="Number of Days">
          <input
            type="number"
            min={1}
            max={7}
            value={form.days}
            onChange={update('days')}
            className="input-field"
          />
        </FormField>

        <FormField label="Travellers">
          <input
            type="number"
            min={1}
            value={form.travellers}
            onChange={update('travellers')}
            className="input-field"
          />
        </FormField>

        <FormField label="Travel Date">
          <input type="date" value={form.travelDate} onChange={update('travelDate')} className="input-field" />
        </FormField>

        <FormField label="Arrival Time">
          <input type="time" value={form.arrivalTime} onChange={update('arrivalTime')} className="input-field" />
        </FormField>

        <FormField label="Departure Time">
          <input type="time" value={form.departureTime} onChange={update('departureTime')} className="input-field" />
        </FormField>

        <FormField label="Hotel Rating" className="col-span-2">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={form.hotelRating}
              onChange={update('hotelRating')}
              className="flex-1"
            />
            <span className="text-sm font-semibold w-10">{form.hotelRating}★</span>
          </div>
        </FormField>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Transportation</p>
        <div className="flex gap-2">
          {transportOptions.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setForm({ ...form, transport: t.key })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.transport === t.key
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-ink/10 text-ink/60 hover:border-ink/20'
              }`}
            >
              <span className="mr-1">{t.icon}</span> {t.key}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Additional Needs</p>
        <div className="flex flex-wrap gap-2">
          {checkboxOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-colors ${
                form.needs.includes(option)
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-ink/10 text-ink/60 hover:border-ink/20'
              }`}
            >
              <input
                type="checkbox"
                checked={form.needs.includes(option)}
                onChange={() => toggleCheckbox(option)}
                className="accent-teal-500"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Interests</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              type="button"
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                form.interests.includes(interest)
                  ? 'gradient-primary text-white border-transparent'
                  : 'border-ink/10 text-ink/60 hover:border-primary/40'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white gradient-primary shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
      >
        <FaMagic className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating your trip…' : 'Generate AI Trip'}
      </button>
    </motion.form>
  )
}

function FormField({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}
