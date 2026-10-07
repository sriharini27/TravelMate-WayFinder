// Parses "HH:MM" (24h, from <input type="time">) or "H:MM AM/PM" into minutes since midnight.
export function parseTimeToMinutes(str) {
  if (!str) return null
  const trimmed = str.trim()

  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (ampm) {
    let h = parseInt(ampm[1], 10)
    const m = parseInt(ampm[2], 10)
    const suffix = ampm[3].toUpperCase()
    if (suffix === 'PM' && h !== 12) h += 12
    if (suffix === 'AM' && h === 12) h = 0
    return h * 60 + m
  }

  const h24 = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (h24) {
    return parseInt(h24[1], 10) * 60 + parseInt(h24[2], 10)
  }

  return null
}

export function minutesToLabel(mins) {
  const normalized = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/**
 * Core of "Arrival-Aware Trip Optimization": compares the traveller's
 * arrival time against the selected hotel's standard check-in time and
 * builds a set of intelligent options when the traveller lands early.
 */
export function getArrivalOptions(arrivalTime, hotel) {
  if (!arrivalTime || !hotel) return null

  const arrivalMin = parseTimeToMinutes(arrivalTime)
  const standardMin = parseTimeToMinutes(hotel.standardCheckIn)
  if (arrivalMin == null || standardMin == null) return null

  if (arrivalMin >= standardMin) {
    return { isEarly: false, standardCheckIn: hotel.standardCheckIn, options: [] }
  }

  const options = []

  if (hotel.earlyCheckinAvailable) {
    const earlyTime = arrivalMin + 30
    options.push({
      id: 'early',
      label: 'Early Check-in',
      time: minutesToLabel(earlyTime),
      fee: hotel.earlyCheckinFee,
      description: `Your room will be ready shortly after you land, by ${minutesToLabel(earlyTime)}.`,
    })
  }

  const flexTime = Math.min(arrivalMin + 180, standardMin)
  options.push({
    id: 'flexible',
    label: 'Flexible Check-in',
    time: minutesToLabel(flexTime),
    fee: 0,
    description: 'Check in a little later than standard time, at no extra cost.',
  })

  options.push({
    id: 'previous_night',
    label: 'Previous-Night Booking',
    time: 'Room ready on arrival',
    fee: hotel.pricePerNight,
    description: 'Book the night before so your room is guaranteed the moment you land.',
  })

  options.push({
    id: 'luggage',
    label: 'Luggage Storage + Nearby Activity',
    time: hotel.standardCheckIn,
    fee: 0,
    description: 'Store your luggage at the hotel and start sightseeing before standard check-in.',
  })

  return { isEarly: true, standardCheckIn: hotel.standardCheckIn, options }
}
