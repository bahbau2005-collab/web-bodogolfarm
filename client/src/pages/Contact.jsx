import { useState } from 'react'
import { SITE_CONFIG } from '../utils/constants'
import { apiFetch } from '../utils/api'
import { Card, Input } from '../components/ui'

/**
 * Contact — informasi kontak + form pesan (POST /api/contact).
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setError('')
    try {
      await apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const INFO = [
    { label: 'Alamat', value: SITE_CONFIG.location.address },
    { label: 'Telepon', value: `${SITE_CONFIG.location.phone} (${SITE_CONFIG.company.founder})` },
    { label: 'Email', value: SITE_CONFIG.location.email },
    { label: 'Jam Operasional', value: 'Senin – Minggu: 08:00 – 17:00 WIB' },
  ]

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-surface-low py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold text-on-surface">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            Punya pertanyaan tentang program edukasi atau ingin berkunjung? Jangan
            ragu menghubungi kami.
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="py-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-2">
          {/* Info */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-on-surface">
              Informasi Kontak
            </h2>
            <div className="mt-6 space-y-5">
              {INFO.map((i) => (
                <div key={i.label}>
                  <p className="text-sm font-semibold text-on-surface">{i.label}</p>
                  <p className="mt-0.5 text-on-surface-variant">{i.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold text-on-surface">Ikuti Kami</p>
              <div className="mt-3 flex gap-3">
                {[
                  { label: 'Instagram', href: SITE_CONFIG.socialMedia.instagram },
                  { label: 'Facebook', href: SITE_CONFIG.socialMedia.facebook },
                  { label: 'YouTube', href: SITE_CONFIG.socialMedia.youtube },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-high hover:text-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <Card>
            <h2 className="font-heading text-2xl font-bold text-on-surface">Kirim Pesan</h2>

            {status === 'success' && (
              <p className="mt-4 rounded-lg bg-success-container px-4 py-3 text-sm text-on-success-container">
                Pesan berhasil dikirim. Kami akan segera menghubungi Anda.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 rounded-lg bg-danger-container px-4 py-3 text-sm text-on-danger-container">
                Gagal mengirim pesan: {error}
              </p>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input label="Nama Lengkap" name="name" required value={form.name} onChange={handleChange} placeholder="Nama lengkap Anda" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email@contoh.com" />
                <Input label="Nomor Telepon" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08123456789" />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                  Subjek <span className="text-danger">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Pilih subjek</option>
                  <option value="info-program">Informasi Program</option>
                  <option value="booking">Booking Kunjungan</option>
                  <option value="partnership">Kerjasama</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <Input as="textarea" label="Pesan" name="message" required value={form.message} onChange={handleChange} placeholder="Tulis pesan Anda di sini..." />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Mengirim…' : 'Kirim Pesan'}
              </button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
