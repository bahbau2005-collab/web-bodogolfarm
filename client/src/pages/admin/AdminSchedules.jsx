import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip, Input } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatTanggal } from '../../utils/format'

const emptyForm = { program: '', date: '', startTime: '09:00', endTime: '11:30', quota: 20, status: 'open' }

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const load = () => {
    setLoading(true)
    Promise.all([
      apiFetch('/api/schedules'),
      apiFetch('/api/programs'),
    ])
      .then(([s, p]) => {
        setSchedules(s.data || [])
        setPrograms(p.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...emptyForm, program: programs[0]?._id || '' }); setModal('add'); setError('') }
  const openEdit = (s) => {
    setForm({
      _id: s._id,
      program: s.program?._id || s.program,
      date: s.date ? new Date(s.date).toISOString().split('T')[0] : '',
      startTime: s.startTime, endTime: s.endTime || '', quota: s.quota, status: s.status,
    })
    setModal('edit'); setError('')
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, quota: Number(form.quota) }
      if (modal === 'add') {
        await apiFetch('/api/schedules', { method: 'POST', ...auth, body: JSON.stringify(payload) })
      } else {
        await apiFetch(`/api/schedules/${form._id}`, { method: 'PUT', ...auth, body: JSON.stringify(payload) })
      }
      load(); setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus jadwal ini?')) return
    await apiFetch(`/api/schedules/${id}`, { method: 'DELETE', ...auth })
    load()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <AdminLayout title="Jadwal & Kuota">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Jadwal & Kuota Sesi</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Atur sesi pelaksanaan beserta kapasitasnya.</p>
          </div>
          <button onClick={openAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container">
            + Sesi Baru
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : schedules.length === 0 ? (
          <Card className="text-center text-on-surface-variant">Belum ada jadwal. Tambahkan sesi baru.</Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3">Program</th>
                    <th className="px-5 py-3">Tanggal & Jam</th>
                    <th className="px-5 py-3">Kuota</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => {
                    const remaining = s.remaining ?? s.quota - s.booked
                    const pct = s.quota ? Math.round((s.booked / s.quota) * 100) : 0
                    return (
                      <tr key={s._id} className="border-b border-outline-variant/40 last:border-0">
                        <td className="px-5 py-3 font-medium text-on-surface">{s.program?.title || '-'}</td>
                        <td className="px-5 py-3 text-on-surface-variant">
                          {formatTanggal(s.date)}<br />
                          <span className="text-xs">{s.startTime}{s.endTime ? `–${s.endTime}` : ''}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-on-surface">{s.booked}/{s.quota}</span>
                          <span className="ml-2 text-xs text-on-surface-variant">(sisa {remaining})</span>
                          <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-surface-high">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Chip tone={s.status === 'open' ? 'success' : 'neutral'}>{s.status === 'open' ? 'Buka' : 'Tutup'}</Chip>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(s)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                            <button onClick={() => handleDelete(s._id)} className="rounded-lg border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:border-danger hover:text-danger">Hapus</button>
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
            <div className="w-full max-w-lg rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">{modal === 'add' ? 'Sesi Baru' : 'Edit Sesi'}</h2>
                <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              {error && <p className="mb-3 rounded-lg bg-danger-container p-3 text-sm text-on-danger-container">{error}</p>}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Program</label>
                  <select value={form.program} onChange={set('program')} className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {programs.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <Input label="Tanggal" type="date" value={form.date} onChange={set('date')} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Jam Mulai" type="time" value={form.startTime} onChange={set('startTime')} />
                  <Input label="Jam Selesai" type="time" value={form.endTime} onChange={set('endTime')} />
                  <Input label="Kuota" type="number" value={form.quota} onChange={set('quota')} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Status</label>
                  <select value={form.status} onChange={set('status')} className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="open">Buka</option>
                    <option value="closed">Tutup</option>
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
