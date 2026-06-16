import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { path: '/admin/services', label: 'Layanan', icon: '🐑' },
  { path: '/admin/schedules', label: 'Jadwal & Kuota', icon: '🗓' },
  { path: '/admin/bookings', label: 'Booking', icon: '🎫' },
  { path: '/admin/content', label: 'Konten', icon: '📄' },
  { path: '/admin/reports', label: 'Laporan', icon: '📈' },
  { path: '/admin/settings', label: 'Pengaturan', icon: '⚙' },
]

export default function AdminLayout({ children, title }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-surface-low font-sans">
      {/* Sidebar */}
      <aside className={`${open ? 'w-64' : 'w-16'} flex flex-col border-r border-outline-variant/60 bg-surface-lowest transition-all duration-200`}>
        <div className="flex items-center gap-3 border-b border-outline-variant/60 px-4 py-5">
          <span className="text-xl">🐑</span>
          {open && (
            <div>
              <p className="font-heading text-sm font-bold leading-tight text-primary">Admin Panel</p>
              <p className="text-xs text-on-surface-variant">Bodogol Farm Management</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mx-2 mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="flex-shrink-0 text-base">{item.icon}</span>
                {open && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-outline-variant/60 px-4 py-4">
          {open && (
            <div className="mb-3">
              <p className="truncate text-sm font-medium text-on-surface">{user.name || 'Admin'}</p>
              <p className="truncate text-xs text-on-surface-variant">{user.email || ''}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 text-sm text-danger hover:opacity-80"
          >
            <span>🚪</span>
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-outline-variant/60 bg-surface-lowest px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(!open)} className="text-xl text-on-surface-variant hover:text-on-surface">
              ☰
            </button>
            {title && <h1 className="font-heading text-lg font-semibold text-on-surface">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/40 text-sm">
              👤
            </div>
            <span className="text-sm font-medium text-on-surface">{user.name || 'Admin'}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
