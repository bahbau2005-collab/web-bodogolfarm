import { useState } from 'react'
import { SITE_CONFIG } from '../utils/constants'
import { apiFetch } from '../utils/api'

/**
 * PENJELASAN CONTACT PAGE:
 * Halaman kontak lengkap dengan:
 * 1. Informasi kontak detail
 * 2. Form kontak
 * 3. Map embed
 * 4. Social media links
 */

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setError('')

    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">

      {/* HERO SECTION CONTACT */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Hubungi Kami</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Punya pertanyaan tentang program edukasi atau ingin berkunjung ke Bodogol Farm?
            Jangan ragu untuk menghubungi kami.
          </p>
        </div>
      </section>

      {/* CONTACT INFO & FORM */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">??</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-700">{SITE_CONFIG.location.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">??</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-700">{SITE_CONFIG.location.phone}</p>
                    <p className="text-sm text-gray-600">Nuur Muhammad Ahkam (Founder)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">??</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700">{SITE_CONFIG.location.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">??</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                    <p className="text-gray-700">Senin - Minggu: 08:00 - 17:00 WIB</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Kami</h3>
                <div className="flex space-x-4">
                  <a
                    href={SITE_CONFIG.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-100 hover:bg-pink-200 p-3 rounded-full transition"
                  >
                    ??
                  </a>
                  <a
                    href={SITE_CONFIG.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full transition"
                  >
                    f
                  </a>
                  <a
                    href={SITE_CONFIG.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-100 hover:bg-red-200 p-3 rounded-full transition"
                  >
                    ??
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Kirim Pesan</h2>

              {status === 'success' && (
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4 mb-6 text-green-700">
                  Pesan berhasil dikirim. Kami akan segera menghubungi Anda.
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-6 text-red-700">
                  Gagal mengirim pesan: {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pilih subjek</option>
                    <option value="info-program">Informasi Program</option>
                    <option value="booking">Booking Kunjungan</option>
                    <option value="partnership">Kerjasama</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition font-semibold disabled:cursor-not-allowed disabled:bg-green-400"
                >
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Lokasi Bodogol Farm</h2>

          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center text-gray-500 text-xl mb-6">
            ??? Google Maps Embed<br />
            (Interactive Map - {SITE_CONFIG.location.address})
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cara Menuju Bodogol Farm</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">??</div>
                <h4 className="font-semibold text-gray-900 mb-2">Dari Jabodetabek</h4>
                <p className="text-gray-700 text-sm">
                  Perjalanan 1-2 jam melalui tol Jagorawi atau tol Cikampek. Titik kumpul tersedia di beberapa lokasi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">??</div>
                <h4 className="font-semibold text-gray-900 mb-2">Transportasi Umum</h4>
                <p className="text-gray-700 text-sm">
                  Naik bus ke terminal Sukabumi, kemudian lanjut dengan angkutan lokal atau taksi online ke lokasi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-3">??</div>
                <h4 className="font-semibold text-gray-900 mb-2">Layanan Antar-Jemput</h4>
                <p className="text-gray-700 text-sm">
                  Kami menyediakan layanan antar-jemput dari titik kumpul terdekat untuk grup dengan minimal peserta tertentu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
