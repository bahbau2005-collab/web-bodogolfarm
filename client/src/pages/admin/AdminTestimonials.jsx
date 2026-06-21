import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip, Input } from '../../components/ui'
import { apiFetch } from '../../utils/api'

const emptyForm = { name: '', role: '', text: '', rating: 5, image: '', isPublished: true }

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const load = () => {
    setLoading(true)
    apiFetch('/api/testimonials?all=true')
      .then((res) => setItems(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add'); setError('') }
  const openEdit = (t) => { setForm({ ...emptyForm, ...t }); setModal('edit'); setError('') }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, rating: Number(form.rating) || 5 }
      if (modal === 'add') {
        await apiFetch('/api/testimonials', { method: 'POST', ...auth, body: JSON.stringify(payload) })
      } else {
        await apiFetch(`/api/testimonials/${form._id}`, { method: 'PUT', ...auth, body: JSON.stringify(payload) })
      }
      load(); setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus testimoni ini?')) return
    await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE', ...auth })
    load()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AdminLayout title="Testimoni">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Testimoni Peserta</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Tampil di Beranda web. Kelola di sini.</p>
          </div>
          <button onClick={openAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container">
            + Tambah Testimoni
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : items.length === 0 ? (
          <Card className="text-center text-on-surface-variant">Belum ada testimoni.</Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <Card key={t._id} className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-sm text-amber-500">{'★'.repeat(t.rating || 5)}</div>
                  <Chip tone={t.isPublished ? 'success' : 'neutral'}>{t.isPublished ? 'Tayang' : 'Draf'}</Chip>
                </div>
                <p className="mt-2 flex-1 text-sm text-on-surface">“{t.text}”</p>
                <div className="mt-3 flex items-center gap-3">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                    <p className="text-xs text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(t)} className="flex-1 rounded-lg border border-outline-variant py-1.5 text-sm text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                  <button onClick={() => handleDelete(t._id)} className="flex-1 rounded-lg border border-outline-variant py-1.5 text-sm text-on-surface-variant hover:border-danger hover:text-danger">Hapus</button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">{modal === 'add' ? 'Tambah Testimoni' : 'Edit Testimoni'}</h2>
                <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              {error && <p className="mb-3 rounded-lg bg-danger-container p-3 text-sm text-on-danger-container">{error}</p>}
              <div className="space-y-4">
                <Input label="Nama" value={form.name} onChange={set('name')} />
                <Input label="Peran / Jabatan" value={form.role} onChange={set('role')} placeholder="mis. Guru SD, Peternak Pemula" />
                <Input as="textarea" label="Isi Testimoni" value={form.text} onChange={set('text')} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Rating</label>
                    <select value={form.rating} onChange={set('rating')} className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                  </div>
                </div>
                <Input label="URL Foto (opsional)" value={form.image} onChange={set('image')} placeholder="/images/testimonials/...webp atau https://…" />
                <label className="flex items-center gap-2 text-sm text-on-surface">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
                  Tayangkan di Beranda
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
