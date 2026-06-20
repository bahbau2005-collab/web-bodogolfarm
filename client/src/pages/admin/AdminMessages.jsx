import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatTanggalJam } from '../../utils/format'

const SUBJECT_LABELS = {
  'info-program': 'Informasi Program',
  booking: 'Booking Kunjungan',
  partnership: 'Kerjasama',
  other: 'Lainnya',
}

/** Ubah nomor telepon jadi format wa.me (62...) */
function waLink(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `https://wa.me/${intl}`
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const token = localStorage.getItem('adminToken')
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const load = () => {
    setLoading(true)
    apiFetch('/api/contact?limit=100', auth)
      .then((res) => setMessages(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openDetail = async (m) => {
    setSelected(m)
    // Tandai sudah dibaca otomatis saat dibuka
    if (!m.isRead) {
      try {
        await apiFetch(`/api/contact/${m._id}/read`, { method: 'PUT', ...auth })
        setMessages((prev) => prev.map((x) => (x._id === m._id ? { ...x, isRead: true } : x)))
      } catch { /* abaikan */ }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesan ini?')) return
    await apiFetch(`/api/contact/${id}`, { method: 'DELETE', ...auth })
    setSelected(null)
    load()
  }

  const unread = messages.filter((m) => !m.isRead).length

  return (
    <AdminLayout title="Pesan Masuk">
      <div className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">
            Pesan Masuk
            {unread > 0 && <span className="ml-2 align-middle"><Chip tone="warning">{unread} belum dibaca</Chip></span>}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">Pesan dari pengunjung lewat form Kontak.</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat…</div>
        ) : messages.length === 0 ? (
          <Card className="text-center text-on-surface-variant">Belum ada pesan masuk.</Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-5 py-3">Pengirim</th>
                    <th className="px-5 py-3">Subjek</th>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m._id} className={`border-b border-outline-variant/40 last:border-0 ${!m.isRead ? 'bg-warning-container/20' : ''}`}>
                      <td className="px-5 py-3">
                        <p className={`text-on-surface ${!m.isRead ? 'font-semibold' : 'font-medium'}`}>{m.name}</p>
                        <p className="text-xs text-on-surface-variant">{m.email}</p>
                      </td>
                      <td className="px-5 py-3 text-on-surface-variant">{SUBJECT_LABELS[m.subject] || m.subject}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{formatTanggalJam(m.createdAt)}</td>
                      <td className="px-5 py-3">
                        <Chip tone={m.isRead ? 'neutral' : 'warning'}>{m.isRead ? 'Dibaca' : 'Baru'}</Chip>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openDetail(m)} className="text-xs font-medium text-primary hover:underline">Buka</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modal detail */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
            <div className="w-full max-w-lg rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-on-surface">{selected.name}</h2>
                  <p className="text-sm text-on-surface-variant">{formatTanggalJam(selected.createdAt)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-xl text-on-surface-variant hover:text-on-surface">✕</button>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-on-surface-variant">Email</dt><dd className="text-right text-on-surface">{selected.email}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-on-surface-variant">Telepon</dt><dd className="text-right text-on-surface">{selected.phone || '-'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-on-surface-variant">Subjek</dt><dd className="text-right text-on-surface">{SUBJECT_LABELS[selected.subject] || selected.subject}</dd></div>
              </dl>

              <div className="mt-4 rounded-lg bg-surface-low p-4">
                <p className="text-sm text-on-surface">{selected.message}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(SUBJECT_LABELS[selected.subject] || 'Pesan Anda')} - Bodogol Farm`}
                  className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-medium text-on-primary hover:bg-primary-container"
                >
                  Balas via Email
                </a>
                {selected.phone && (
                  <a
                    href={waLink(selected.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg border border-secondary py-2 text-center text-sm font-medium text-secondary hover:bg-secondary-container/40"
                  >
                    Balas via WhatsApp
                  </a>
                )}
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="rounded-lg border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:border-danger hover:text-danger"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
