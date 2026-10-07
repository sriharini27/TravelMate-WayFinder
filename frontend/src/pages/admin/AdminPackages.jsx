import AdminResourceCrud from './AdminResourceCrud.jsx'

const fields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'destination', label: 'Destination', type: 'text' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'days', label: 'Days', type: 'number' },
  { key: 'duration', label: 'Duration', type: 'text' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'image', label: 'Image URL', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'transportation', label: 'Transportation', type: 'text' },
]

export default function AdminPackages() {
  return <AdminResourceCrud resource="packages" title="Packages" fields={fields} />
}
