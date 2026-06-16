import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatRupiah } from '../../utils/format'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']

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
    apiFetch(`/api/admin/reports?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchReports() }, [])

  const inputCls = 'rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <AdminLayout title="Laporan">
      <div className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Laporan Performa</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Analisis pendapatan dan booking.</p>
        </div>

        <Card className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-on-surface-variant">Dari Tanggal</label>
            <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-on-surface-variant">Sampai Tanggal</label>
            <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} className={inputCls} />
          </div>
          <button onClick={fetchReports} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container">
            Generate Laporan
          </button>
        </Card>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">Memuat data…</div>
        ) : (
          <div className="space-y-5">
            <Card>
              <h3 className="font-heading text-lg font-semibold text-on-surface">Tren Pendapatan Bulanan</h3>
              {data?.monthlyTrend?.length > 0 ? (
                <div className="mt-6 flex h-48 items-end gap-2">
                  {data.monthlyTrend.map((t, i) => {
                    const max = Math.max(...data.monthlyTrend.map((x) => x.revenue))
                    const height = max > 0 ? (t.revenue / max) * 100 : 0
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg bg-primary" style={{ height: `${height}%`, minHeight: '4px' }} />
                        <span className="text-xs text-on-surface-variant">{MONTHS[(t._id.month || 1) - 1]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-10 text-center text-on-surface-variant">Tidak ada data.</p>
              )}
            </Card>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Card>
                <h3 className="font-heading text-lg font-semibold text-on-surface">Pendapatan per Program</h3>
                {data?.revenueByProgram?.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {data.revenueByProgram.map((r, i) => {
                      const maxRev = Math.max(...data.revenueByProgram.map((x) => x.totalRevenue))
                      const pct = maxRev > 0 ? (r.totalRevenue / maxRev) * 100 : 0
                      return (
                        <div key={i}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="truncate text-on-surface-variant">{r.name}</span>
                            <span className="ml-2 font-medium text-primary">{formatRupiah(r.totalRevenue)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-high">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-on-surface-variant">Belum ada data.</p>
                )}
              </Card>

              <Card>
                <h3 className="font-heading text-lg font-semibold text-on-surface">Distribusi Status Booking</h3>
                {data?.bookingsByStatus?.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {data.bookingsByStatus.map((s, i) => {
                      const total = data.bookingsByStatus.reduce((a, b) => a + b.count, 0)
                      const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : 0
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm">
                            <span className="capitalize text-on-surface-variant">{s._id}</span>
                            <span className="font-medium text-on-surface">{s.count} ({pct}%)</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-surface-high">
                            <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-on-surface-variant">Belum ada data.</p>
                )}
              </Card>
            </div>

            <Card padded={false} className="overflow-hidden">
              <div className="p-6 pb-0">
                <h3 className="font-heading text-lg font-semibold text-on-surface">Top 5 Pelanggan</h3>
              </div>
              {data?.topCustomers?.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                      <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Nama</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Booking</th>
                        <th className="px-6 py-3">Total Belanja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topCustomers.map((c, i) => (
                        <tr key={i} className="border-b border-outline-variant/40 last:border-0">
                          <td className="px-6 py-3 text-on-surface-variant">{i + 1}</td>
                          <td className="px-6 py-3 font-medium text-on-surface">{c.name}</td>
                          <td className="px-6 py-3 text-on-surface-variant">{c._id}</td>
                          <td className="px-6 py-3 text-on-surface">{c.bookings}x</td>
                          <td className="px-6 py-3 font-semibold text-primary">{formatRupiah(c.totalSpent)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-6 text-sm text-on-surface-variant">Belum ada data.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
