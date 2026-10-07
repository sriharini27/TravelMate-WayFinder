import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Loader from '../../components/common/Loader.jsx'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import adminService from '../../services/adminService.js'
import { apiErrorMessage } from '../../services/api.js'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

/**
 * One generic admin CRUD screen reused for Destinations, Hotels, Packages
 * and Offers — simple reference-data tables that all follow the same
 * list/create/update/delete shape (see server/controllers/crudFactory.js).
 *
 * `fields`: [{ key, label, type: 'text'|'number'|'date', required? }]
 * List array/object fields (styles, amenities, etc.) are edited as
 * comma-separated text for simplicity.
 */
export default function AdminResourceCrud({ resource, title, fields, listFields = [] }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...item} = edit
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = () => {
    adminService
      .list(resource)
      .then(setItems)
      .catch((err) => setError(apiErrorMessage(err, `Could not load ${title.toLowerCase()}.`)))
  }

  useEffect(load, [resource])

  const openCreate = () => {
    const blank = {}
    fields.forEach((f) => (blank[f.key] = f.type === 'checkbox' ? f.default ?? false : ''))
    setForm(blank)
    setEditing({})
  }

  const openEdit = (item) => {
    const next = { ...item }
    listFields.forEach((key) => {
      if (Array.isArray(next[key])) next[key] = next[key].join(', ')
    })
    setForm(next)
    setEditing(item)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form }
      listFields.forEach((key) => {
        payload[key] = (payload[key] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      })
      fields
        .filter((f) => f.type === 'number')
        .forEach((f) => {
          payload[f.key] = Number(payload[f.key]) || 0
        })
      fields
        .filter((f) => f.type === 'checkbox')
        .forEach((f) => {
          payload[f.key] = !!payload[f.key]
        })

      if (editing?.id) {
        await adminService.update(resource, editing.id, payload)
      } else {
        await adminService.create(resource, payload)
      }
      setEditing(null)
      load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save — please check the fields and try again.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return
    try {
      await adminService.remove(resource, id)
      load()
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <AdminLayout title={title}>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-6">{error}</div>}

      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openCreate}>
          <FaPlus /> Add {title.replace(/s$/, '')}
        </Button>
      </div>

      {!items ? (
        <div className="flex justify-center py-20">
          <Loader label={`Loading ${title.toLowerCase()}…`} size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg/60">
              <tr className="text-left text-ink/40 text-xs uppercase">
                {fields.slice(0, 4).map((f) => (
                  <th key={f.key} className="py-3 px-5">
                    {f.label}
                  </th>
                ))}
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-ink/5">
                  {fields.slice(0, 4).map((f) => (
                    <td key={f.key} className="py-3 px-5 max-w-[220px] truncate">
                      {f.type === 'checkbox'
                  ? item[f.key]
                    ? 'Yes'
                    : 'No'
                  : Array.isArray(item[f.key])
                  ? item[f.key].join(', ')
                  : String(item[f.key] ?? '')}
                    </td>
                  ))}
                  <td className="py-3 px-5 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-primary mr-3" aria-label="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500" aria-label="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 1} className="py-8 text-center text-ink/40">
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${title}` : `Add ${title}`}>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1.5 block">
                {f.label}
                {listFields.includes(f.key) && <span className="normal-case font-normal text-ink/30"> (comma-separated)</span>}
              </label>
              {f.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                  className="accent-blue-600 w-5 h-5"
                />
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="input-field"
                />
              )}
            </div>
          ))}
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
