import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatRupiah, formatTanggal } from '../../utils/format'

const STATUS_TONE = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'danger' }
const PAYMENT_TONE = { pending: 'warning', paid: 'success', failed: 'danger', cancelled: 'neutral' }
const STATUS_LABEL = { pending: 'Pending', confirmed: 'Dikonfirmasi', completed: 'Selesai', cancelled: 'Dibatalkan' }
const PAYMENT_LABEL = { pending: 'Belum Bayar', paid: 'Lunas', failed: 'Gagal', cancelled: 'Batal' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', paymentStatus: '', search: '' })
  const [selected, setSelected] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const token = localStorage.getItem('adminToken')

  const fetchBookings = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
    if (filters.search) params.set('search', filters.search)
    apiFetch(`/api/admin/bookings?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchBookings() }, [filters])

  const handleStatusChange = async (id, status) => {
    setActionLoading(true)
    try {
      await apiFetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      fetchBookings()
      setSelected(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const inputCls = 'rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <AdminLayout title="Booking">
      <div className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Manajemen Booking</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Kelola & verifikasi reservasi pelanggan.</p>
        </div>

        {/* Filter */}
        <Card className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Cari nama / email…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={`${inputCls} min-w-40 flex-1`}
          />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={inputCls}>
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <select value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })} className={inputCls}>
            <option value="">Semua Pembayaran</option>
            <option value="pending">Belum Bayar</option>
            <option value="paid">Lunas</option>
            <option value="failed">Gagal</option>
          </select>
        </Card>

        {/* Tabel */}
        <Card padded={false} className="overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-on-surface-variant">Memuat data…</div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">Tidak ada booking.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Bayar</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-outline-variant/40 last:border-0 hover:bg-surface-low">
                      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{b.ticketCode || '-'}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-on-surface">{b.customerName}</p>
                        <p className="text-xs text-on-surface-variant">{b.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-on-surface">{b.program?.title || '-'}</p>
                        <p className="text-xs text-on-surface-variant">{b.participants} peserta</p>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{formatTanggal(b.bookingDate)}</td>
                      <td className="px-4 py-3 font-medium text-on-surface">{formatRupiah(b.totalAmount)}</td>
                      <td className="px-4 py-3"><Chip tone={PAYMENT_TONE[b.paymentStatus]}>{PAYMENT_LABEL[b.paymentStatus] || b.paymentStatus}</Chip></td>
                      <td className="px-4 py-3"><Chip tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status] || b.status}</Chip></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(b)} className="text-xs font-medium text-primary hover:underline">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal detail */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
            <div className="w-full max-w-lg rounded-xl bg-surface-lowest p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-start justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">Detail Booking</h2>
                <button onClick={() => setSelected(null)} className="text-xl text-on-surface-variant hover:text-on-surface">✕</button>
              </div>
              <dl className="mb-6 space-y-3 text-sm">
                {[
                  ['Kode Tiket', selected.ticketCode || '-'],
                  ['Nama', selected.customerName],
                  ['Email', selected.customerEmail],
                  ['Telepon', selected.customerPhone],
                  ['Program', selected.program?.title],
                  ['Peserta', `${selected.participants} orang`],
                  ['Tanggal', formatTanggal(selected.bookingDate)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-on-surface-variant">{k}</dt>
                    <dd className="text-right font-medium text-on-surface">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between"><dt className="text-on-surface-variant">Total</dt><dd className="font-bold text-primary">{formatRupiah(selected.totalAmount)}</dd></div>
                {selected.specialRequests && (
                  <div>
                    <dt className="text-on-surface-variant">Catatan</dt>
                    <dd className="mt-1 text-on-surface">{selected.specialRequests}</dd>
                  </div>
                )}
              </dl>
              <div className="flex flex-wrap gap-2">
                {selected.status !== 'confirmed' && (
                  <button onClick={() => handleStatusChange(selected._id, 'confirmed')} disabled={actionLoading} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-on-primary disabled:opacity-50">✓ Konfirmasi</button>
                )}
                {selected.status !== 'completed' && (
                  <button onClick={() => handleStatusChange(selected._id, 'completed')} disabled={actionLoading} className="flex-1 rounded-lg bg-success py-2 text-sm font-medium text-white disabled:opacity-50">✓ Selesai</button>
                )}
                {selected.status !== 'cancelled' && (
                  <button onClick={() => handleStatusChange(selected._id, 'cancelled')} disabled={actionLoading} className="flex-1 rounded-lg bg-danger py-2 text-sm font-medium text-white disabled:opacity-50">✕ Batalkan</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
