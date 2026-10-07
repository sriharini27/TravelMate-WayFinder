import AdminResourceCrud from './AdminResourceCrud.jsx'

const fields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'region', label: 'Region', type: 'text' },
  { key: 'tag', label: 'Tag', type: 'text' },
  { key: 'image', label: 'Image URL', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'bestSeason', label: 'Best Season', type: 'text' },
  { key: 'budgetEstimate', label: 'Budget Estimate', type: 'text' },
  { key: 'styles', label: 'Travel Styles', type: 'text' },
]

export default function AdminDestinations() {
  return <AdminResourceCrud resource="destinations" title="Destinations" fields={fields} listFields={['styles']} />
}
