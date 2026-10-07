import AdminResourceCrud from './AdminResourceCrud.jsx'

const fields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'destination', label: 'Destination', type: 'text' },
  { key: 'pricePerNight', label: 'Price / Night', type: 'number' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'standardCheckIn', label: 'Standard Check-in', type: 'text' },
  { key: 'standardCheckOut', label: 'Standard Check-out', type: 'text' },
  { key: 'earlyCheckinFee', label: 'Early Check-in Fee', type: 'number' },
  { key: 'image', label: 'Image URL', type: 'text' },
  { key: 'distanceFromCenter', label: 'Distance From Center', type: 'text' },
  { key: 'amenities', label: 'Amenities', type: 'text' },
]

export default function AdminHotels() {
  return <AdminResourceCrud resource="hotels" title="Hotels" fields={fields} listFields={['amenities']} />
}
