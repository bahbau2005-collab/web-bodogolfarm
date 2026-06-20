import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  IconDashboard, IconServices, IconSchedule, IconBookings, IconMessages,
  IconContent, IconReports, IconUsers, IconSettings, IconLogout, IconBell, IconTractor,
} from '../icons'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { path: '/admin/services', label: 'Layanan', Icon: IconServices },
  { path: '/admin/schedules', label: 'Jadwal & Kuota', Icon: IconSchedule },
  { path: '/admin/bookings', label: 'Booking', Icon: IconBookings },
  { path: '/admin/messages', label: 'Pesan Masuk', Icon: IconMessages },
  { path: '/admin/content', label: 'Konten', Icon: IconContent },
  { path: '/admin/reports', label: 'Laporan', Icon: IconReports },
  { path: '/admin/users', label: 'Kelola Staf', Icon: IconUsers },
  { path: '/admin/settings', label: 'Pengaturan', Icon: IconSettings },
]

export default function AdminLayout({ children, title }) {
  const location = useLocation()
  const navigate = useNavigate()
  // Drawer mobile: tertutup default. Di desktop (md+) sidebar selalu tampil.
  const [open, setOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-surface-low font-sans">
      {/* Backdrop (mobile, saat drawer terbuka) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-outline-variant/60 bg-surface-lowest transition-transform duration-200 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-outline-variant/60 px-4 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <IconTractor className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold leading-tight text-primary">Admin Panel</p>
            <p className="text-xs text-on-surface-variant">Bodogol Farm Management</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`mx-2 mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <item.Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-outline-variant/60 px-4 py-4">
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-on-surface">{user.name || 'Admin'}</p>
            <p className="truncate text-xs text-on-surface-variant">{user.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 text-sm text-danger hover:opacity-80"
          >
            <IconLogout className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-outline-variant/60 bg-surface-lowest px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Tombol drawer hanya di mobile */}
            <button
              onClick={() => setOpen(true)}
              className="text-xl text-on-surface-variant hover:text-on-surface md:hidden"
              aria-label="Buka menu"
            >
              ☰
            </button>
            {title && <h1 className="font-heading text-lg font-semibold text-on-surface">{title}</h1>}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant transition-colors hover:text-primary" aria-label="Notifikasi">
              <IconBell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
                {(user.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-on-surface sm:inline">{user.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
