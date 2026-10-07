import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Loader from '../../components/common/Loader.jsx'
import adminService from '../../services/adminService.js'
import { apiErrorMessage } from '../../services/api.js'
import { formatCurrency } from '../../utils/motionVariants.js'

export default function AdminBookings() {
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService
      .listBookings()
      .then(setBookings)
      .catch((err) => setError(apiErrorMessage(err, 'Could not load bookings.')))
  }, [])

  return (
    <AdminLayout title="Bookings">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>}
      {!bookings ? (
        <div className="flex justify-center py-20">
          <Loader label="Loading bookings…" size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg/60">
              <tr className="text-left text-ink/40 text-xs uppercase">
                <th className="py-3 px-5">Booking ID</th>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Destination</th>
                <th className="py-3 px-5">Trip Status</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-ink/5">
                  <td className="py-3 px-5 font-mono text-xs">{b.bookingId}</td>
                  <td className="py-3 px-5">{b.user?.name || '—'}</td>
                  <td className="py-3 px-5">{b.destination}</td>
                  <td className="py-3 px-5">{b.bookingStatus}</td>
                  <td className="py-3 px-5">{b.paymentStatus}</td>
                  <td className="py-3 px-5">{formatCurrency(b.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
