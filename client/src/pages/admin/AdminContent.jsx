import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const TABS = ['Visual', 'Harga Layanan', 'Slot Waktu', 'Ketersediaan']

// Mock content data (in real app, fetched from server)
const mockBanners = [
  { id: 1, title: 'Hero Banner Utama', status: 'published', image: 'hero.jpg' },
  { id: 2, title: 'Banner Promosi Program', status: 'draft', image: 'promo.jpg' },
]

const mockPricing = [
  { id: 1, name: 'Wisata Edukasi PAUD', price: 150000, unit: '/orang' },
  { id: 2, name: 'Edukasi Sekolah SD/SMP', price: 200000, unit: '/orang' },
  { id: 3, name: 'Paket Outing Days', price: 350000, unit: '/orang' },
  { id: 4, name: 'Program Magang', price: 5000000, unit: '/3 hari' },
]

const mockSlots = [
  { id: 1, time: '08:00 - 11:00', days: 'Senin - Jumat', capacity: 30, available: true },
  { id: 2, time: '09:00 - 13:00', days: 'Sabtu', capacity: 50, available: true },
  { id: 3, time: '10:00 - 16:00', days: 'Minggu', capacity: 50, available: false },
]

const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des']
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
    setBlocked((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola konten visual, harga, slot, dan ketersediaan</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Visual */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Banner & Gambar</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">+ Upload</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBanners.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-24 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-2xl">🖼️</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{b.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-gray-500 hover:text-green-600">Edit</button>
                    <button className="text-sm text-gray-500 hover:text-red-500">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Harga */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Harga Layanan</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Nama Layanan</th>
                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Harga</th>
                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Satuan</th>
                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPricing.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-5 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-5 py-3 text-green-600 font-semibold">Rp {item.price.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3 text-gray-500">{item.unit}</td>
                      <td className="px-5 py-3">
                        <button className="text-green-600 hover:text-green-800 text-xs font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Slot Waktu */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Slot Waktu</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">+ Tambah Slot</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSlots.map((slot) => (
                <div key={slot.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{slot.time}</p>
                      <p className="text-sm text-gray-500">{slot.days}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${slot.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {slot.available ? 'Buka' : 'Tutup'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Kapasitas: <strong>{slot.capacity} orang</strong></p>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm hover:border-green-500">Edit</button>
                    <button className={`flex-1 py-1.5 rounded-lg text-sm ${slot.available ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {slot.available ? 'Tutup' : 'Buka'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Ketersediaan Kalender */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Kalender Ketersediaan</h2>
            <p className="text-sm text-gray-500">Klik tanggal untuk memblokir/membuka ketersediaan</p>
            <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1) }} className="p-1 hover:bg-gray-100 rounded-lg">◀</button>
                <p className="font-semibold">{months[calMonth]} {calYear}</p>
                <button onClick={() => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1) }} className="p-1 hover:bg-gray-100 rounded-lg">▶</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d) => <div key={d}>{d}</div>)}
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
                      className={`h-9 w-full rounded-lg text-sm font-medium transition ${
                        !day ? 'invisible' :
                        isBlocked ? 'bg-red-400 text-white' :
                        isToday ? 'bg-green-600 text-white' :
                        'hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-600 rounded-full inline-block" /> Hari ini</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full inline-block" /> Diblokir</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
