import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

// STEP 1 — Path selection (Fig 3.15)
function PathSelection({ onSelect }) {
  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Booking Program Bodogol Farm</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Pilih jenis program yang sesuai dengan kebutuhan Anda
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Pilih Jenis Program
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Kami menyediakan dua jalur program untuk kebutuhan yang berbeda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Agritourism & Education */}
            <button
              onClick={() => onSelect('agritourism')}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-green-500 transition-all text-left"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-green-500 group-hover:text-white transition-all">
                🌾
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Agritourism & Edukasi
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Program wisata edukasi untuk PAUD, sekolah, komunitas, dan outing days.
                Cocok untuk kelompok yang ingin belajar sambil berwisata.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Wisata Edukasi PAUD</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Edukasi Sekolah SD/SMP/SMA</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Paket Outing Days</li>
              </ul>
              <span className="inline-block bg-green-600 group-hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                Pilih Agritourism →
              </span>
            </button>

            {/* Professional Training */}
            <button
              onClick={() => onSelect('training')}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all text-left"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                🎓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Pelatihan Profesional
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Program magang dan pelatihan intensif untuk calon peternak, profesional,
                dan entrepreneur yang ingin menguasai manajemen peternakan modern.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Program Magang 3 hari – 1 bulan</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Hands-on training semua aspek</li>
                <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Sertifikat resmi</li>
              </ul>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                Pilih Pelatihan →
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// STEP 2A — Agritourism booking form (Fig 3.16)
function AgritourismForm({ programs, onBack }) {
  const [submitStatus, setSubmitStatus] = useState(null)
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [form, setForm] = useState({
    program: programs[0]?._id || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    participants: 1,
    bookingDate: '',
    specialRequests: ''
  })

  const selectedProgram = useMemo(
    () => programs.find((p) => p._id === form.program),
    [programs, form.program]
  )

  const totalAmount = useMemo(
    () => (selectedProgram ? selectedProgram.price * form.participants : 0),
    [selectedProgram, form.participants]
  )

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'participants' ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')
    setError('')
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ ...form, bookingType: 'agritourism' })
      })
      const payRes = await apiFetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ bookingId: res.data._id })
      })
      setSubmitStatus('success')
      setPaymentData(payRes.data)
    } catch (err) {
      setError(err.message)
      setSubmitStatus('error')
    }
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="text-green-200 hover:text-white mb-4 flex items-center gap-2 text-sm">
            ← Kembali pilih jenis program
          </button>
          <h1 className="text-4xl font-bold mb-2">Booking Agritourism & Edukasi</h1>
          <p className="text-green-100">Isi form di bawah untuk memesan program wisata edukasi</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Ringkasan */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Program</span>
                    <span className="font-medium text-right max-w-32">{selectedProgram?.title || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Durasi</span>
                    <span className="font-medium">{selectedProgram?.duration || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kapasitas maks</span>
                    <span className="font-medium">{selectedProgram?.capacity || '-'} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peserta</span>
                    <span className="font-medium">{form.participants} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="font-medium">{form.bookingDate || '-'}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold">Total Estimasi</span>
                    <span className="font-bold text-green-600 text-base">
                      {totalAmount > 0 ? `Rp ${totalAmount.toLocaleString('id-ID')}` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-5 text-sm text-green-800">
                <p className="font-semibold mb-2">Yang sudah termasuk:</p>
                <ul className="space-y-1">
                  {selectedProgram?.facilities?.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">✓ {f}</li>
                  )) || <li>✓ Sesuai paket yang dipilih</li>}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Booking Agritourism</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Program</label>
                  <select
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  >
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} — Rp {p.price.toLocaleString('id-ID')} /orang
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text" name="customerName" value={form.customerName}
                      onChange={handleChange} required placeholder="Nama lengkap"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email" name="customerEmail" value={form.customerEmail}
                      onChange={handleChange} required placeholder="email@contoh.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel" name="customerPhone" value={form.customerPhone}
                      onChange={handleChange} required placeholder="08123456789"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Peserta</label>
                    <input
                      type="number" name="participants" value={form.participants}
                      onChange={handleChange} min="1" max="50" required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kunjungan</label>
                  <input
                    type="date" name="bookingDate" value={form.bookingDate}
                    onChange={handleChange} min={today} required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permintaan Khusus</label>
                  <textarea
                    name="specialRequests" rows="3" value={form.specialRequests}
                    onChange={handleChange} placeholder="Contoh: kebutuhan vegetarian, wheelchair access, dll."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>

                {submitStatus === 'success' && paymentData && (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-green-800">
                      <p className="font-semibold">🎉 Booking berhasil dibuat!</p>
                      <p className="text-sm mt-1">Lanjutkan ke pembayaran untuk konfirmasi.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(paymentData.paymentUrl, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
                    >
                      🚀 Bayar Sekarang via Midtrans
                    </button>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {!paymentData && (
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-xl font-semibold transition"
                  >
                    {submitStatus === 'loading' ? 'Memproses...' : 'Kirim Booking'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// STEP 2B — Training booking form (Fig 3.17)
function TrainingForm({ programs, onBack }) {
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    duration: '3 hari', startDate: '', participants: 1, background: '', goals: ''
  })
  const [submitStatus, setSubmitStatus] = useState(null)
  const [error, setError] = useState('')

  const trainingProgram = programs.find((p) => p.title?.toLowerCase().includes('magang') || p.title?.toLowerCase().includes('training'))
  const pricePerDay = trainingProgram ? Math.round(trainingProgram.price / 3) : 200000
  const durationDays = { '3 hari': 3, '1 minggu': 7, '2 minggu': 14, '1 bulan': 30 }
  const totalAmount = pricePerDay * (durationDays[form.duration] || 3) * form.participants
  const today = new Date().toISOString().split('T')[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'participants' ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')
    setError('')
    try {
      if (!trainingProgram) throw new Error('Program pelatihan tidak tersedia')
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          program: trainingProgram._id,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          participants: form.participants,
          bookingDate: form.startDate,
          specialRequests: `Durasi: ${form.duration}. Latar belakang: ${form.background}. Tujuan: ${form.goals}`,
          bookingType: 'training'
        })
      })
      await apiFetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ bookingId: res.data._id })
      })
      setSubmitStatus('success')
    } catch (err) {
      setError(err.message)
      setSubmitStatus('error')
    }
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="text-blue-200 hover:text-white mb-4 flex items-center gap-2 text-sm">
            ← Kembali pilih jenis program
          </button>
          <h1 className="text-4xl font-bold mb-2">Booking Pelatihan Profesional</h1>
          <p className="text-blue-100">Program magang intensif manajemen peternakan modern</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Info */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimasi Biaya</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Durasi</span>
                    <span className="font-medium">{form.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peserta</span>
                    <span className="font-medium">{form.participants} orang</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold">Total Estimasi</span>
                    <span className="font-bold text-blue-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-800">
                <p className="font-semibold mb-2">Program mencakup:</p>
                <ul className="space-y-1">
                  {['Akomodasi selama pelatihan','Semua makan (3x/hari)','Materi & modul training','Sertifikat resmi'].map((item) => (
                    <li key={item} className="flex items-center gap-2">✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Pendaftaran Pelatihan</h2>

              {submitStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
                  <p className="text-gray-600">Tim kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi jadwal dan pembayaran.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required placeholder="Nama lengkap"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} required placeholder="email@contoh.com"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                      <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} required placeholder="08123456789"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Peserta</label>
                      <input type="number" name="participants" value={form.participants} onChange={handleChange} min="1" max="10" required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Pelatihan</label>
                      <select name="duration" value={form.duration} onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                        <option>3 hari</option>
                        <option>1 minggu</option>
                        <option>2 minggu</option>
                        <option>1 bulan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                      <input type="date" name="startDate" value={form.startDate} onChange={handleChange} min={today} required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latar Belakang</label>
                    <textarea name="background" rows="2" value={form.background} onChange={handleChange}
                      placeholder="Pengalaman di bidang peternakan / pertanian sebelumnya..."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan Mengikuti Pelatihan</label>
                    <textarea name="goals" rows="2" value={form.goals} onChange={handleChange}
                      placeholder="Apa yang ingin Anda capai setelah pelatihan ini?"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error}</div>
                  )}

                  <button type="submit" disabled={submitStatus === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-semibold transition">
                    {submitStatus === 'loading' ? 'Mengirim...' : 'Daftar Pelatihan'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Main Booking component — router antar step
export default function Booking() {
  const [step, setStep] = useState('select') // 'select' | 'agritourism' | 'training'
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/programs')
      .then((res) => setPrograms(res.data || []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data program...</p>
        </div>
      </div>
    )
  }

  if (step === 'agritourism') return <AgritourismForm programs={programs} onBack={() => setStep('select')} />
  if (step === 'training') return <TrainingForm programs={programs} onBack={() => setStep('select')} />
  return <PathSelection onSelect={setStep} />
}
