import AdminResourceCrud from './AdminResourceCrud.jsx'

// applicableCategories reuses the same Attraction.category vocabulary the
// itinerary generator and offer-matching endpoint both use — entered here as
// comma-separated text (e.g. "Adventure, Nature") like the other list fields.
const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'code', label: 'Code', type: 'text' },
  { key: 'discountPercent', label: 'Discount %', type: 'number' },
  { key: 'destination', label: 'Destination (blank = any)', type: 'text' },
  { key: 'applicableCategories', label: 'Applicable Categories', type: 'text' },
  { key: 'minimumAmount', label: 'Minimum Amount (0 = none)', type: 'number' },
  { key: 'validFrom', label: 'Valid From', type: 'date' },
  { key: 'validTill', label: 'Valid Till', type: 'date' },
  { key: 'active', label: 'Active', type: 'checkbox', default: true },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'image', label: 'Image URL', type: 'text' },
]

export default function AdminOffers() {
  return <AdminResourceCrud resource="offers" title="Offers" fields={fields} listFields={['applicableCategories']} />
}
