import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card } from '../../components/ui'
import { apiFetch } from '../../utils/api'
import { formatRupiah } from '../../utils/format'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']

function StatCard({ label, value, sub, icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">{label}</p>
          <p className="mt-1 font-heading text-3xl font-bold text-on-surface">{value}</p>
          {sub && <p className="mt-1 text-xs text-on-surface-variant">{sub}</p>}
        </div>
        <span className="text-3xl opacity-70">{icon}</span>
      </div>
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    apiFetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Ringkasan</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Selamat datang di Bodogol Farm Admin Panel.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-on-surface-variant">Memuat data…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Booking" value={stats?.totalBookings || 0} sub="Semua waktu" icon="🎫" />
              <StatCard label="Booking Aktif" value={stats?.activeBookings || 0} sub="Pending & Confirmed" icon="⏳" />
              <StatCard label="Pendapatan Bulan Ini" value={formatRupiah(stats?.monthlyRevenue)} sub={`${stats?.monthlyBookings || 0} booking`} icon="💰" />
              <StatCard label="Total Pendapatan" value={formatRupiah(stats?.totalRevenue)} sub={`${stats?.paidBookings || 0} transaksi`} icon="📈" />
            </div>

            <Card>
              <h3 className="font-heading text-lg font-semibold text-on-surface">
                Tren Booking (6 Bulan Terakhir)
              </h3>
              {stats?.trend?.length > 0 ? (
                <div className="mt-6 flex h-40 items-end gap-3">
                  {stats.trend.map((t, i) => {
                    const max = Math.max(...stats.trend.map((x) => x.count))
                    const height = max > 0 ? (t.count / max) * 100 : 0
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-xs text-on-surface-variant">{t.count}</span>
                        <div
                          className="w-full rounded-t-lg bg-primary transition-all"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <span className="text-xs text-on-surface-variant">{MONTHS[t._id.month - 1]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-10 text-center text-on-surface-variant">Belum ada data booking.</p>
              )}
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <h3 className="font-heading text-lg font-semibold text-on-surface">Info Cepat</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ['Program Aktif', `${stats?.activePrograms || 0} program`],
                    ['Booking Bulan Lalu', `${stats?.lastMonthBookings || 0} booking`],
                    ['Booking Bulan Ini', `${stats?.monthlyBookings || 0} booking`],
                    ['Booking Berbayar', `${stats?.paidBookings || 0} booking`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-on-surface-variant">{k}</dt>
                      <dd className="font-semibold text-on-surface">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <div className="rounded-xl bg-primary p-6 text-on-primary shadow-soft">
                <h3 className="font-heading text-lg font-semibold">Bodogol Farm</h3>
                <p className="mt-2 text-sm text-on-primary/80">
                  Panel admin untuk mengelola booking, layanan, jadwal, konten, dan laporan.
                </p>
                <div className="mt-4 space-y-1 text-xs text-on-primary/70">
                  <p>📍 Desa Purwasari, Cicurug, Sukabumi</p>
                  <p>📞 0857-5961-6910</p>
                  <p>✉️ contact@bodogolfarm.com</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
