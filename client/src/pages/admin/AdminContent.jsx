import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip, Input } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatTanggal } from '../../utils/format'

const emptyForm = {
  title: '', category: 'Panduan', excerpt: '', content: '',
  readTime: '5 menit', image: '', isPublished: true,
}

export default function AdminContent() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const load = () => {
    setLoading(true)
    apiFetch('/api/articles?all=true')
      .then((res) => setArticles(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add'); setError('') }
  const openEdit = (a) => { setForm({ ...emptyForm, ...a }); setModal('edit'); setError('') }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (modal === 'add') {
        await apiFetch('/api/articles', { method: 'POST', ...auth, body: JSON.stringify(form) })
      } else {
        await apiFetch(`/api/articles/${form._id}`, { method: 'PUT', ...auth, body: JSON.stringify(form) })
      }
      load(); setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus artikel ini?')) return
    await apiFetch(`/api/articles/${id}`, { method: 'DELETE', ...auth })
    load()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AdminLayout title="Konten">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Artikel Edukasi</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Kelola artikel yang tampil di halaman Edukasi.</p>
          </div>
          <button onClick={openAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container">
            + Artikel Baru
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : articles.length === 0 ? (
          <Card className="text-center text-on-surface-variant">Belum ada artikel. Tambahkan yang baru.</Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3">Artikel</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3">Dibuat</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a._id} className="border-b border-outline-variant/40 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {a.image
                            ? <img src={a.image} alt="" className="h-10 w-14 rounded object-cover" />
                            : <div className="flex h-10 w-14 items-center justify-center rounded bg-surface-high">📄</div>}
                          <span className="font-medium text-on-surface">{a.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Chip tone="info">{a.category}</Chip></td>
                      <td className="px-5 py-3 text-on-surface-variant">{formatTanggal(a.createdAt)}</td>
                      <td className="px-5 py-3"><Chip tone={a.isPublished ? 'success' : 'neutral'}>{a.isPublished ? 'Tayang' : 'Draf'}</Chip></td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(a)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                          <button onClick={() => handleDelete(a._id)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-danger hover:text-danger">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">{modal === 'add' ? 'Artikel Baru' : 'Edit Artikel'}</h2>
                <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              {error && <p className="mb-3 rounded-lg bg-danger-container p-3 text-sm text-on-danger-container">{error}</p>}
              <div className="space-y-4">
                <Input label="Judul" value={form.title} onChange={set('title')} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Kategori" value={form.category} onChange={set('category')} />
                  <Input label="Waktu Baca" value={form.readTime} onChange={set('readTime')} />
                </div>
                <Input label="URL Gambar" value={form.image} onChange={set('image')} placeholder="/images/edukasi/contoh.png atau https://…" />
                <Input as="textarea" label="Ringkasan" value={form.excerpt} onChange={set('excerpt')} />
                <Input as="textarea" label="Isi Artikel" value={form.content} onChange={set('content')} />
                <label className="flex items-center gap-2 text-sm text-on-surface">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />
                  Tayangkan artikel
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
