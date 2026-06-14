import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiFetch } from '../../utils/api'

const emptyForm = { title: '', description: '', duration: '1 hari', price: '', capacity: '', isActive: true }

export default function AdminServices() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')

  const fetch = () => {
    setLoading(true)
    apiFetch('/api/admin/programs', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPrograms(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add'); setError('') }
  const openEdit = (p) => { setForm({ ...p, price: p.price, capacity: p.capacity }); setModal('edit'); setError('') }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) }
      if (modal === 'add') {
        await apiFetch('/api/admin/programs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
      } else {
        await apiFetch(`/api/admin/programs/${form._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
      }
      fetch()
      setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus program ini?')) return
    await apiFetch(`/api/admin/programs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetch()
  }

  const fmtCurrency = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Layanan & Kuota</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola program edukasi dan kapasitas</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            + Tambah Program
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Memuat...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {programs.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><span>Durasi</span><span className="font-medium">{p.duration}</span></div>
                  <div className="flex justify-between"><span>Harga</span><span className="font-medium text-green-600">{fmtCurrency(p.price)}</span></div>
                  <div className="flex justify-between"><span>Kapasitas</span><span className="font-medium">{p.capacity} orang</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 py-1.5 rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="flex-1 border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-500 py-1.5 rounded-lg text-sm">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">{modal === 'add' ? 'Tambah Program' : 'Edit Program'}</h2>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                    <select
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>1 hari</option>
                      <option>2 hari</option>
                      <option>3 hari</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Program Aktif</label>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm">Batal</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
