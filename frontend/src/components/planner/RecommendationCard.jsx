import { FaMapPin, FaLightbulb } from 'react-icons/fa'

export default function RecommendationCard({ attractions, tips }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="rounded-2xl border border-ink/10 p-5">
        <p className="font-bold mb-3 flex items-center gap-2">
          <FaMapPin className="text-secondary" /> Nearby Attractions
        </p>
        <ul className="space-y-2">
          {attractions.map((a) => (
            <li key={a} className="text-sm text-ink/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> {a}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-ink/10 p-5">
        <p className="font-bold mb-3 flex items-center gap-2">
          <FaLightbulb className="text-accent" /> Travel Tips
        </p>
        <ul className="space-y-2">
          {tips.map((t) => (
            <li key={t} className="text-sm text-ink/60 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
