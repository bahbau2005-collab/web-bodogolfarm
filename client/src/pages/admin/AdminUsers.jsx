import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip, Input } from '../../components/ui'
import { apiFetch } from '../../utils/api'

const emptyForm = { name: '', email: '', password: '', role: 'admin' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')
  const auth = { headers: { Authorization: `Bearer ${token}` } }
  const me = JSON.parse(localStorage.getItem('adminUser') || '{}')

  const load = () => {
    setLoading(true)
    apiFetch('/api/admin/users', auth)
      .then((res) => setUsers(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add'); setError('') }
  const openEdit = (u) => { setForm({ _id: u._id, name: u.name, email: u.email, role: u.role, password: '' }); setModal('edit'); setError('') }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (modal === 'add') {
        await apiFetch('/api/admin/users', { method: 'POST', ...auth, body: JSON.stringify(form) })
      } else {
        const body = { name: form.name, role: form.role }
        if (form.password) body.password = form.password
        await apiFetch(`/api/admin/users/${form._id}`, { method: 'PATCH', ...auth, body: JSON.stringify(body) })
      }
      load(); setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (u) => {
    try {
      await apiFetch(`/api/admin/users/${u._id}`, { method: 'PATCH', ...auth, body: JSON.stringify({ isActive: !u.isActive }) })
      load()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (u) => {
    if (!confirm(`Hapus staf "${u.name}"?`)) return
    try {
      await apiFetch(`/api/admin/users/${u._id}`, { method: 'DELETE', ...auth })
      load()
    } catch (err) { alert(err.message) }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AdminLayout title="Kelola Staf">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Kelola Staf</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Akun login untuk tim pengelola Bodogol Farm.</p>
          </div>
          <button onClick={openAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container">
            + Tambah Staf
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3">Nama</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isMe = u._id === me._id
                    return (
                      <tr key={u._id} className="border-b border-outline-variant/40 last:border-0">
                        <td className="px-5 py-3 font-medium text-on-surface">
                          {u.name} {isMe && <span className="text-xs text-on-surface-variant">(Anda)</span>}
                        </td>
                        <td className="px-5 py-3 text-on-surface-variant">{u.email}</td>
                        <td className="px-5 py-3"><Chip tone={u.role === 'admin' ? 'info' : 'neutral'}>{u.role === 'admin' ? 'Admin' : 'Officer'}</Chip></td>
                        <td className="px-5 py-3"><Chip tone={u.isActive ? 'success' : 'neutral'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</Chip></td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(u)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                            {!isMe && (
                              <>
                                <button onClick={() => toggleActive(u)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-secondary hover:text-secondary">
                                  {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                                <button onClick={() => handleDelete(u)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-danger hover:text-danger">Hapus</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
            <div className="w-full max-w-md rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">{modal === 'add' ? 'Tambah Staf' : 'Edit Staf'}</h2>
                <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              {error && <p className="mb-3 rounded-lg bg-danger-container p-3 text-sm text-on-danger-container">{error}</p>}
              <div className="space-y-4">
                <Input label="Nama" value={form.name} onChange={set('name')} />
                <Input label="Email" type="email" value={form.email} onChange={set('email')} disabled={modal === 'edit'} />
                <Input
                  label={modal === 'add' ? 'Password' : 'Password Baru (kosongkan jika tidak diubah)'}
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder={modal === 'edit' ? '••••••' : 'min. 6 karakter'}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Role</label>
                  <select value={form.role} onChange={set('role')} className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="admin">Admin (akses penuh)</option>
                    <option value="officer">Officer</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 rounded-lg border border-outline-variant py-2 text-sm text-on-surface-variant">Batal</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-on-primary disabled:opacity-50">{saving ? 'Menyimpan…' : 'Simpan'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
