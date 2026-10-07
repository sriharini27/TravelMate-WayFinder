import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Loader from '../../components/common/Loader.jsx'
import adminService from '../../services/adminService.js'
import { apiErrorMessage } from '../../services/api.js'
import { formatCurrency } from '../../utils/motionVariants.js'
import { FaUsers, FaReceipt, FaCheckCircle, FaTimesCircle, FaFlagCheckered, FaRupeeSign } from 'react-icons/fa'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService
      .getStats()
      .then(setStats)
      .catch((err) => setError(apiErrorMessage(err, 'Could not load dashboard statistics.')))
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>}
      {!stats && !error && (
        <div className="flex justify-center py-20">
          <Loader label="Loading statistics…" size="lg" />
        </div>
      )}
      {stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            <StatCard icon={FaUsers} label="Total Users" value={stats.totalUsers} color="#2563EB" />
            <StatCard icon={FaReceipt} label="Total Bookings" value={stats.totalBookings} color="#F97316" />
            <StatCard icon={FaCheckCircle} label="Confirmed Bookings" value={stats.confirmedBookings} color="#14B8A6" />
            <StatCard icon={FaTimesCircle} label="Cancelled Bookings" value={stats.cancelledBookings} color="#EF4444" />
            <StatCard icon={FaFlagCheckered} label="Completed Trips" value={stats.completedTrips} color="#6366F1" />
            <StatCard icon={FaRupeeSign} label="Payments Collected" value={formatCurrency(stats.paymentTotal)} color="#0EA5E9" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-bold mb-4">Popular Destinations</h3>
              {stats.popularDestinations.length === 0 ? (
                <p className="text-sm text-ink/40">No bookings yet.</p>
              ) : (
                <ul className="space-y-2">
                  {stats.popularDestinations.map((p) => (
                    <li key={p.destination} className="flex items-center justify-between text-sm">
                      <span>{p.destination}</span>
                      <span className="font-semibold text-primary">{p.bookings} bookings</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-bold mb-4">Recently Created Users</h3>
              <ul className="space-y-3">
                {stats.recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-ink/40">{u.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/5 text-primary font-semibold">{u.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-card p-6 lg:col-span-2">
              <h3 className="font-bold mb-4">Recently Created Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/40 text-xs uppercase">
                      <th className="py-2 pr-4">Booking ID</th>
                      <th className="py-2 pr-4">User</th>
                      <th className="py-2 pr-4">Destination</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((b) => (
                      <tr key={b.id} className="border-t border-ink/5">
                        <td className="py-2.5 pr-4 font-mono text-xs">{b.bookingId}</td>
                        <td className="py-2.5 pr-4">{b.user?.name || '—'}</td>
                        <td className="py-2.5 pr-4">{b.destination}</td>
                        <td className="py-2.5 pr-4">{b.bookingStatus}</td>
                        <td className="py-2.5">{formatCurrency(b.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl grid place-items-center text-xl shrink-0" style={{ backgroundColor: `${color}1A`, color }}>
        <Icon />
      </div>
      <div>
        <p className="text-xs text-ink/40 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold">{value}</p>
      </div>
    </div>
  )
}
