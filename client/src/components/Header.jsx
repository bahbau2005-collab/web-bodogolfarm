import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../utils/constants'

/**
 * PENJELASAN HEADER COMPONENT:
 * Header adalah navigasi atas website yang tampil di setiap halaman.
 * Berisi: Logo, Menu navigasi, dan CTA button (Booking Sekarang)
 * 
 * Struktur:
 * - Logo/Brand di sebelah kiri
 * - Menu di tengah (Home, Tentang, Program, Edukasi, Kontak)
 * - CTA Button "Booking Sekarang" di kanan
 * 
 * Tailwind Classes:
 * - w-full = lebar penuh
 * - bg-white = background putih
 * - shadow = bayangan subtle
 * - sticky top-0 = melekat di atas ketika scroll
 */

export default function Header() {
  return (
    <header className="w-full bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO / BRAND - Link ke Home */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-600">
              🐑 Bodogol Farm
            </h1>
            <p className="text-sm text-gray-600">Kandang Tempat Kamu Belajar</p>
          </Link>

          {/* MENU NAVIGASI */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-green-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link to="/programs" className="text-gray-700 hover:text-green-600 transition">
                Program
              </Link>
            </li>
            <li>
              <Link to="/booking" className="text-gray-700 hover:text-green-600 transition">
                Booking
              </Link>
            </li>
            <li>
              <Link to="/edukasi" className="text-gray-700 hover:text-green-600 transition">
                Edukasi
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
                Kontak
              </Link>
            </li>
          </ul>

          {/* CTA BUTTON */}
          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            Booking Sekarang
          </Link>
        </div>
      </nav>
    </header>
  )
}
