import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiFetch } from '../../utils/api'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

const PAYMENT_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

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

    apiFetch(`/api/admin/bookings?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
        body: JSON.stringify({ status })
      })
      fetchBookings()
      setSelected(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID') : '-'
  const fmtCurrency = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking & Verifikasi</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola dan verifikasi semua booking pelanggan</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Cari nama / email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Pembayaran</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Memuat data...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Tidak ada booking ditemukan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Pelanggan</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Program</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Tanggal</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Total</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Pembayaran</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{b.customerName}</p>
                        <p className="text-gray-400 text-xs">{b.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{b.program?.title || '-'}</p>
                        <p className="text-gray-400 text-xs">{b.participants} peserta</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{fmtDate(b.bookingDate)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{fmtCurrency(b.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[b.paymentStatus] || ''}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(b)}
                          className="text-green-600 hover:text-green-800 font-medium text-xs"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900">Detail Booking</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between"><span className="text-gray-500">Nama</span><span className="font-medium">{selected.customerName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selected.customerEmail}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Telepon</span><span>{selected.customerPhone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Program</span><span className="font-medium">{selected.program?.title}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Peserta</span><span>{selected.participants} orang</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span>{fmtDate(selected.bookingDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-green-600">{fmtCurrency(selected.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pembayaran</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${PAYMENT_COLORS[selected.paymentStatus] || ''}`}>{selected.paymentStatus}</span>
                </div>
                {selected.specialRequests && (
                  <div><span className="text-gray-500">Catatan:</span><p className="mt-1 text-gray-700">{selected.specialRequests}</p></div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {selected.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'confirmed')}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    ✓ Konfirmasi
                  </button>
                )}
                {selected.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'completed')}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    ✓ Selesai
                  </button>
                )}
                {selected.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(selected._id, 'cancelled')}
                    disabled={actionLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    ✕ Batalkan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
