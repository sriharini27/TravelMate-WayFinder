import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Loader from '../../components/common/Loader.jsx'
import adminService from '../../services/adminService.js'
import { apiErrorMessage } from '../../services/api.js'
import { FaTrash } from 'react-icons/fa'

export default function AdminUsers() {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    adminService
      .listUsers()
      .then(setUsers)
      .catch((err) => setError(apiErrorMessage(err, 'Could not load users.')))
  }

  useEffect(load, [])

  const changeRole = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role)
      load()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  const removeUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await adminService.deleteUser(id)
      load()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <AdminLayout title="Users">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>}
      {!users ? (
        <div className="flex justify-center py-20">
          <Loader label="Loading users…" size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/60">
              <tr className="text-left text-ink/40 text-xs uppercase">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Joined</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink/5">
                  <td className="py-3 px-5 font-medium">{u.name}</td>
                  <td className="py-3 px-5 text-ink/60">{u.email}</td>
                  <td className="py-3 px-5">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="input-field py-1.5 text-xs w-28"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-5 text-ink/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => removeUser(u.id)} className="text-red-500 hover:text-red-600" aria-label="Delete user">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
