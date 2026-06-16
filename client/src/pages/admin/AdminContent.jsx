import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Chip } from '../../components/ui'
import { formatRupiah } from '../../utils/format'

const TABS = ['Visual', 'Harga Layanan', 'Slot Waktu', 'Ketersediaan']

const mockBanners = [
  { id: 1, title: 'Hero Banner Utama', status: 'published' },
  { id: 2, title: 'Banner Promosi Program', status: 'draft' },
]
const mockPricing = [
  { id: 1, name: 'Wisata Edukasi PAUD', price: 150000, unit: '/orang' },
  { id: 2, name: 'Edukasi Sekolah SD/SMP', price: 200000, unit: '/orang' },
  { id: 3, name: 'Paket Outing Days', price: 350000, unit: '/orang' },
  { id: 4, name: 'Program Magang', price: 5000000, unit: '/paket' },
]
const mockSlots = [
  { id: 1, time: '08:00 - 11:00', days: 'Senin - Jumat', capacity: 30, available: true },
  { id: 2, time: '09:00 - 13:00', days: 'Sabtu', capacity: 50, available: true },
  { id: 3, time: '10:00 - 16:00', days: 'Minggu', capacity: 50, available: false },
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
const today = new Date()

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return cells
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState(0)
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [blocked, setBlocked] = useState([])

  const calendar = buildCalendar(calYear, calMonth)
  const toggleDay = (day) => {
    if (!day) return
    const key = `${calYear}-${calMonth + 1}-${day}`
    setBlocked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const btnPrimary = 'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container'

  return (
    <AdminLayout title="Konten">
      <div className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Manajemen Konten</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Kelola visual, harga, slot, dan ketersediaan.</p>
        </div>

        <div className="flex w-fit flex-wrap gap-1 rounded-lg bg-surface-container p-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === i ? 'bg-surface-lowest text-on-surface shadow-soft' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Visual */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-on-surface">Banner & Gambar</h3>
              <button className={btnPrimary}>+ Upload</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {mockBanners.map((b) => (
                <Card key={b.id} className="flex items-center gap-4">
                  <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-surface-high text-2xl">🖼️</div>
                  <div className="flex-1">
                    <p className="font-medium text-on-surface">{b.title}</p>
                    <Chip tone={b.status === 'published' ? 'success' : 'warning'}>{b.status === 'published' ? 'Tayang' : 'Draf'}</Chip>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button className="text-on-surface-variant hover:text-primary">Edit</button>
                    <button className="text-on-surface-variant hover:text-danger">Hapus</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Harga */}
        {activeTab === 1 && (
          <Card padded={false} className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-outline-variant/60 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3">Nama Layanan</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Satuan</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mockPricing.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/40 last:border-0">
                    <td className="px-5 py-3 font-medium text-on-surface">{item.name}</td>
                    <td className="px-5 py-3 font-semibold text-primary">{formatRupiah(item.price)}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{item.unit}</td>
                    <td className="px-5 py-3 text-right"><button className="text-xs font-medium text-primary hover:underline">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Slot */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-on-surface">Slot Waktu</h3>
              <button className={btnPrimary}>+ Tambah Slot</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {mockSlots.map((slot) => (
                <Card key={slot.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading text-lg font-bold text-on-surface">{slot.time}</p>
                      <p className="text-sm text-on-surface-variant">{slot.days}</p>
                    </div>
                    <Chip tone={slot.available ? 'success' : 'danger'}>{slot.available ? 'Buka' : 'Tutup'}</Chip>
                  </div>
                  <p className="mt-3 text-sm text-on-surface-variant">Kapasitas: <strong className="text-on-surface">{slot.capacity} orang</strong></p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg border border-outline-variant py-1.5 text-sm text-on-surface-variant hover:border-primary hover:text-primary">Edit</button>
                    <button className="flex-1 rounded-lg bg-surface-container py-1.5 text-sm text-on-surface-variant hover:bg-surface-high">{slot.available ? 'Tutup' : 'Buka'}</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Kalender */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">Klik tanggal untuk memblokir/membuka ketersediaan.</p>
            <Card className="max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <button onClick={() => { if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11) } else setCalMonth((m) => m - 1) }} className="rounded-lg p-1 hover:bg-surface-container">◀</button>
                <p className="font-heading font-semibold text-on-surface">{MONTHS[calMonth]} {calYear}</p>
                <button onClick={() => { if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0) } else setCalMonth((m) => m + 1) }} className="rounded-lg p-1 hover:bg-surface-container">▶</button>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-on-surface-variant">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendar.map((day, idx) => {
                  const key = `${calYear}-${calMonth + 1}-${day}`
                  const isBlocked = blocked.includes(key)
                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDay(day)}
                      className={`h-9 w-full rounded-lg text-sm font-medium transition-colors ${
                        !day ? 'invisible' : isBlocked ? 'bg-danger text-white' : isToday ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-primary" /> Hari ini</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-danger" /> Diblokir</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
