import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

/**
 * Header — navigasi atas, tampil di setiap halaman publik.
 * Mengikuti design system: background cream/putih, brand Deep Forest Green,
 * tombol CTA "Booking Sekarang". Responsive dengan menu hamburger di mobile.
 */
const NAV_LINKS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/programs', label: 'Program' },
  { to: '/edukasi', label: 'Edukasi' },
  { to: '/about', label: 'Tentang' },
  { to: '/contact', label: 'Kontak' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/60 bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        {/* Brand */}
        <Link to="/" className="font-heading text-xl font-bold text-primary">
          Bodogol Farm
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <Link
          to="/booking"
          className="hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container md:inline-flex"
        >
          Booking Sekarang
        </Link>

        {/* Toggle mobile */}
        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface md:hidden"
        >
          <span className="text-2xl leading-none">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-outline-variant/60 bg-surface px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/booking"
                onClick={() => setOpen(false)}
                className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary"
              >
                Booking Sekarang
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
