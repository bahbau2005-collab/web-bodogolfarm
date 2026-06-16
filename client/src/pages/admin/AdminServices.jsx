import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip, Input } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatRupiah } from '../../utils/format'

const emptyForm = {
  title: '', description: '', duration: '1 hari',
  type: 'agrotourism', category: 'umum', mode: 'offline', priceUnit: 'orang',
  price: '', capacity: '', schedule: 'Sesuai jadwal', isActive: true,
}
const TYPE_LABELS = { agrotourism: 'Agrowisata', edukasi: 'Edukasi', training: 'Pelatihan' }

export default function AdminServices() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')

  const load = () => {
    setLoading(true)
    apiFetch('/api/admin/programs', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPrograms(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add'); setError('') }
  const openEdit = (p) => { setForm({ ...emptyForm, ...p }); setModal('edit'); setError('') }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) }
      const opts = { headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }
      if (modal === 'add') {
        await apiFetch('/api/admin/programs', { method: 'POST', ...opts })
      } else {
        await apiFetch(`/api/admin/programs/${form._id}`, { method: 'PUT', ...opts })
      }
      load()
      setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus program ini?')) return
    await apiFetch(`/api/admin/programs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AdminLayout title="Layanan">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Kelola Layanan</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Atur program agrowisata & edukasi.</p>
          </div>
          <button onClick={openAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container">
            + Tambah Program
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((p) => (
              <Card key={p._id}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-semibold text-on-surface">{p.title}</h3>
                  <Chip tone={p.isActive ? 'success' : 'neutral'}>{p.isActive ? 'Aktif' : 'Nonaktif'}</Chip>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Chip tone="info">{TYPE_LABELS[p.type] || p.type}</Chip>
                  <Chip tone="neutral">{p.mode === 'online' ? 'Online' : 'Offline'}</Chip>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-on-surface-variant">{p.description}</p>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><dt className="text-on-surface-variant">Durasi</dt><dd className="font-medium text-on-surface">{p.duration}</dd></div>
                  <div className="flex justify-between"><dt className="text-on-surface-variant">Harga</dt><dd className="font-medium text-primary">{formatRupiah(p.price)}/{p.priceUnit || 'orang'}</dd></div>
                  <div className="flex justify-between"><dt className="text-on-surface-variant">Kapasitas</dt><dd className="font-medium text-on-surface">{p.capacity} orang</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 rounded-lg border border-outline-variant py-1.5 text-sm text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="flex-1 rounded-lg border border-outline-variant py-1.5 text-sm text-on-surface-variant hover:border-danger hover:text-danger">Hapus</button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">{modal === 'add' ? 'Tambah Program' : 'Edit Program'}</h2>
                <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              {error && <p className="mb-3 rounded-lg bg-danger-container p-3 text-sm text-on-danger-container">{error}</p>}
              <div className="space-y-4">
                <Input label="Nama Program" value={form.title} onChange={set('title')} />
                <Input as="textarea" label="Deskripsi" value={form.description} onChange={set('description')} />
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Jenis" value={form.type} onChange={set('type')} options={[['agrotourism', 'Agrowisata'], ['edukasi', 'Edukasi'], ['training', 'Pelatihan']]} />
                  <Select label="Kategori" value={form.category} onChange={set('category')} options={[['umum', 'Umum'], ['family', 'Keluarga'], ['school', 'Sekolah'], ['university', 'Kampus']]} />
                  <Select label="Mode" value={form.mode} onChange={set('mode')} options={[['offline', 'Offline'], ['online', 'Online']]} />
                  <Select label="Satuan Harga" value={form.priceUnit} onChange={set('priceUnit')} options={[['orang', 'Per orang'], ['paket', 'Per paket'], ['course', 'Per course'], ['semester', 'Per semester']]} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Durasi" value={form.duration} onChange={set('duration')} />
                  <Input label="Harga (Rp)" type="number" value={form.price} onChange={set('price')} />
                  <Input label="Kapasitas" type="number" value={form.capacity} onChange={set('capacity')} />
                </div>
                <label className="flex items-center gap-2 text-sm text-on-surface">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
                  Program Aktif
                </label>
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

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">{label}</label>
      <select value={value} onChange={onChange} className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}
