import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiFetch } from '../../utils/api'

export default function AdminReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState({ from: '', to: '' })

  const token = localStorage.getItem('adminToken')

  const fetchReports = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (range.from) params.set('from', range.from)
    if (range.to) params.set('to', range.to)

    apiFetch(`/api/admin/reports?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [])

  const fmtCurrency = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']

  const statusColors = {
    pending: 'bg-yellow-400',
    paid: 'bg-green-500',
    failed: 'bg-red-400',
    cancelled: 'bg-gray-400'
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-500 text-sm mt-1">Analisis pendapatan dan booking</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={fetchReports}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Generate Laporan
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Memuat data...</div>
        ) : (
          <div className="space-y-5">
            {/* Revenue trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tren Pendapatan Bulanan</h2>
              {data?.monthlyTrend?.length > 0 ? (
                <div className="flex items-end gap-2 h-48">
                  {data.monthlyTrend.map((t, i) => {
                    const max = Math.max(...data.monthlyTrend.map((x) => x.revenue))
                    const height = max > 0 ? (t.revenue / max) * 100 : 0
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xs text-gray-500">{fmtCurrency(t.revenue).replace('Rp ', '')}</span>
                        <div className="w-full bg-green-500 rounded-t-lg" style={{ height: `${height}%`, minHeight: '4px' }} />
                        <span className="text-xs text-gray-400">{months[(t._id.month || 1) - 1]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">Tidak ada data</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Revenue by program */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pendapatan per Program</h2>
                {data?.revenueByProgram?.length > 0 ? (
                  <div className="space-y-3">
                    {data.revenueByProgram.map((r, i) => {
                      const maxRev = Math.max(...data.revenueByProgram.map((x) => x.totalRevenue))
                      const pct = maxRev > 0 ? (r.totalRevenue / maxRev) * 100 : 0
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 truncate">{r.name}</span>
                            <span className="font-medium text-green-600 ml-2">{fmtCurrency(r.totalRevenue)}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{r.count} booking</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Belum ada data</p>
                )}
              </div>

              {/* Booking by status */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Status Booking</h2>
                {data?.bookingsByStatus?.length > 0 ? (
                  <div className="space-y-3">
                    {data.bookingsByStatus.map((s, i) => {
                      const total = data.bookingsByStatus.reduce((a, b) => a + b.count, 0)
                      const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : 0
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColors[s._id] || 'bg-gray-400'}`} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize text-gray-700">{s._id}</span>
                              <span className="font-medium">{s.count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full mt-1">
                              <div className={`h-1.5 rounded-full ${statusColors[s._id] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Belum ada data</p>
                )}
              </div>
            </div>

            {/* Top customers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Pelanggan</h2>
              {data?.topCustomers?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="pb-2">#</th>
                        <th className="pb-2">Nama</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Booking</th>
                        <th className="pb-2">Total Spending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topCustomers.map((c, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="py-2 text-gray-400">{i + 1}</td>
                          <td className="py-2 font-medium text-gray-900">{c.name}</td>
                          <td className="py-2 text-gray-500">{c._id}</td>
                          <td className="py-2">{c.bookings}x</td>
                          <td className="py-2 font-semibold text-green-600">{fmtCurrency(c.totalSpent)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Belum ada data</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
