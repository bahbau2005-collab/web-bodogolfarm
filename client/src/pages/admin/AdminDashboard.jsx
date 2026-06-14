import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiFetch } from '../../utils/api'

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className="text-4xl opacity-70">{icon}</div>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    apiFetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang di Bodogol Farm Admin Panel</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat data...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Total Booking"
                value={stats?.totalBookings || 0}
                sub="Semua waktu"
                icon="📋"
                color="border-blue-500"
              />
              <StatCard
                label="Booking Aktif"
                value={stats?.activeBookings || 0}
                sub="Pending & Confirmed"
                icon="⏳"
                color="border-yellow-500"
              />
              <StatCard
                label="Pendapatan Bulan Ini"
                value={fmt(stats?.monthlyRevenue)}
                sub={`${stats?.monthlyBookings || 0} booking`}
                icon="💰"
                color="border-green-500"
              />
              <StatCard
                label="Total Pendapatan"
                value={fmt(stats?.totalRevenue)}
                sub={`${stats?.paidBookings || 0} transaksi`}
                icon="📈"
                color="border-purple-500"
              />
            </div>

            {/* Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tren Booking (6 Bulan Terakhir)</h2>
              {stats?.trend?.length > 0 ? (
                <div className="flex items-end gap-3 h-40">
                  {stats.trend.map((t, i) => {
                    const max = Math.max(...stats.trend.map((x) => x.count))
                    const height = max > 0 ? (t.count / max) * 100 : 0
                    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xs text-gray-500">{t.count}</span>
                        <div
                          className="w-full bg-green-500 rounded-t-lg transition-all"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <span className="text-xs text-gray-400">{months[t._id.month - 1]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">Belum ada data booking</p>
              )}
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Info Cepat</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Program Aktif</span>
                    <span className="font-semibold">{stats?.activePrograms || 0} program</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Bulan Lalu</span>
                    <span className="font-semibold">{stats?.lastMonthBookings || 0} booking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Bulan Ini</span>
                    <span className="font-semibold">{stats?.monthlyBookings || 0} booking</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking Berbayar</span>
                    <span className="font-semibold text-green-600">{stats?.paidBookings || 0} booking</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-2">Bodogol Farm</h2>
                <p className="text-sm text-green-100 mb-4">
                  Panel admin untuk mengelola booking, layanan, konten, dan laporan.
                </p>
                <div className="text-xs text-green-200 space-y-1">
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
