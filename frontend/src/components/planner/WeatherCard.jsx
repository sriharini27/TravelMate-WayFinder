import { FaCloudSun, FaTint, FaWind } from 'react-icons/fa'

export default function WeatherCard({ weather }) {
  if (!weather) return null

  return (
    <div className="rounded-2xl p-5 gradient-primary text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center text-2xl shrink-0">
          <FaCloudSun />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">Weather Forecast</p>
          <p className="font-bold text-lg">
            {weather.temperature}°C · {weather.condition}
          </p>
        </div>
      </div>
      <div className="flex gap-5 text-xs text-white/80 mb-3">
        <span className="flex items-center gap-1.5">
          <FaTint /> {weather.humidity}% humidity
        </span>
        <span className="flex items-center gap-1.5">
          <FaWind /> {weather.wind} wind
        </span>
      </div>
      <p className="text-sm text-white/90 bg-white/10 rounded-xl px-3 py-2">{weather.recommendation}</p>
    </div>
  )
}
