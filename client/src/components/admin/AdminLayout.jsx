import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/bookings', label: 'Booking & Verifikasi', icon: '📋' },
  { path: '/admin/services', label: 'Layanan & Kuota', icon: '⚙️' },
  { path: '/admin/content', label: 'Content Manager', icon: '🖼️' },
  { path: '/admin/reports', label: 'Laporan', icon: '📈' },
  { path: '/admin/settings', label: 'Pengaturan Akun', icon: '👤' },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-gray-900 text-white flex flex-col transition-all duration-200`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <span className="text-2xl">🐑</span>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm leading-tight">Bodogol Farm</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm w-full"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            ☰
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">{user.name || 'Admin'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
