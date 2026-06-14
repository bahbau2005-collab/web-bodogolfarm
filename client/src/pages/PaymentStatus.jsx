import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

// Simple QR code placeholder using SVG pattern
function QRPlaceholder({ value }) {
  const size = 120
  const cells = 11
  const cell = size / cells
  // Pseudo-random pattern based on value string
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pattern = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      // Fixed corner squares (QR finder patterns)
      if ((r < 3 && c < 3) || (r < 3 && c > cells - 4) || (r > cells - 4 && c < 3)) return true
      // Random interior
      return ((seed * (r + 1) * (c + 1) * 17) % 7) < 3
    })
  )
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {pattern.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1} fill="#111827" rx="1" />
          ) : null
        )
      )}
    </svg>
  )
}

// E-ticket component (shown when payment is successful)
function ETicket({ booking }) {
  const bookingRef = booking?.paymentOrderId || `BF-${Date.now().toString().slice(-6)}`
  const program = booking?.program || {}
  const date = booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '-'

  const handlePrint = () => window.print()

  return (
    <div className="max-w-md mx-auto">
      {/* Success banner */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">Pembayaran Berhasil!</h1>
        <p className="text-gray-500 mt-1 text-sm">E-tiket Anda telah diterbitkan</p>
      </div>

      {/* Ticket card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Ticket header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs uppercase tracking-widest mb-1">E-Tiket Bodogol Farm</p>
              <p className="font-bold text-xl">{program.title || 'Program Edukasi'}</p>
            </div>
            <span className="text-3xl">🐑</span>
          </div>
        </div>

        {/* Ticket body */}
        <div className="px-6 py-5">
          {/* Booking ref + QR */}
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-dashed border-gray-200">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Kode Booking</p>
              <p className="text-xl font-bold text-gray-900 tracking-widest">{bookingRef}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">✓ Terverifikasi</p>
            </div>
            <div className="bg-white border border-gray-100 p-2 rounded-xl">
              <QRPlaceholder value={bookingRef} />
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nama Peserta</p>
              <p className="font-semibold text-gray-900 text-sm">{booking?.customerName || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Jumlah Peserta</p>
              <p className="font-semibold text-gray-900 text-sm">{booking?.participants || 1} orang</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tanggal Kunjungan</p>
              <p className="font-semibold text-gray-900 text-sm">{date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Durasi</p>
              <p className="font-semibold text-gray-900 text-sm">{program.duration || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
              <p className="font-semibold text-gray-900 text-sm truncate">{booking?.customerEmail || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Telepon</p>
              <p className="font-semibold text-gray-900 text-sm">{booking?.customerPhone || '-'}</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-2xl px-4 py-4 flex justify-between items-center mb-5">
            <div>
              <p className="text-xs text-gray-500">Total Pembayaran</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {(booking?.totalAmount || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-green-100 px-3 py-1.5 rounded-full">
              <p className="text-green-700 text-xs font-bold">LUNAS</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
            <p>📍 Kp. Kuta RT 03/RW 09, Desa Purwasari, Cicurug, Sukabumi</p>
            <p>📞 0857-5961-6910</p>
            <p>✉️ contact@bodogolfarm.com</p>
          </div>
        </div>

        {/* Ticket tear line */}
        <div className="relative flex items-center px-0">
          <div className="w-6 h-6 bg-gray-50 rounded-full -ml-3" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-1" />
          <div className="w-6 h-6 bg-gray-50 rounded-full -mr-3" />
        </div>

        {/* Ticket footer */}
        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-400">
            Tunjukkan e-tiket ini kepada petugas saat tiba di lokasi
          </p>
          <p className="text-xs text-gray-300 mt-1">Bodogol Farm © 2026</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handlePrint}
          className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-xl font-semibold transition text-sm"
        >
          🖨️ Cetak / Simpan PDF
        </button>
        <Link
          to="/"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm text-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

// Non-success states (pending, failed, cancelled)
function StatusCard({ status, orderId }) {
  const configs = {
    pending: {
      icon: '⏳', title: 'Pembayaran Sedang Diproses',
      message: 'Pembayaran Anda sedang diverifikasi. Konfirmasi akan dikirim via email.',
      color: 'yellow',
      actions: [{ text: 'Cek Status', href: '/booking', primary: true }, { text: 'Hubungi Kami', href: '/contact', primary: false }]
    },
    error: {
      icon: '❌', title: 'Pembayaran Gagal',
      message: 'Pembayaran tidak dapat diproses. Silakan coba lagi.',
      color: 'red',
      actions: [{ text: 'Coba Lagi', href: '/booking', primary: true }, { text: 'Hubungi Support', href: '/contact', primary: false }]
    },
    cancel: {
      icon: '🚫', title: 'Pembayaran Dibatalkan',
      message: 'Pembayaran telah dibatalkan. Anda bisa booking ulang kapan saja.',
      color: 'gray',
      actions: [{ text: 'Booking Ulang', href: '/booking', primary: true }, { text: 'Ke Beranda', href: '/', primary: false }]
    }
  }
  const cfg = configs[status] || configs.error
  const colorMap = { yellow: 'bg-yellow-50 text-yellow-800', red: 'bg-red-50 text-red-800', gray: 'bg-gray-50 text-gray-700' }

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-3xl p-8 text-center shadow-lg ${colorMap[cfg.color]}`}>
        <div className="text-6xl mb-4">{cfg.icon}</div>
        <h1 className="text-2xl font-bold mb-3">{cfg.title}</h1>
        <p className="text-sm opacity-80 mb-6">{cfg.message}</p>
        {orderId && <p className="text-xs opacity-60 mb-6">Order ID: {orderId}</p>}
        <div className="flex flex-col gap-3">
          {cfg.actions.map((a, i) => (
            <Link key={i} to={a.href}
              className={`py-3 rounded-xl font-semibold transition text-sm ${
                a.primary ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white/60 hover:bg-white text-gray-700'
              }`}
            >
              {a.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  const status = searchParams.get('status') || 'success'
  const orderId = searchParams.get('order_id')
  const bookingId = orderId ? orderId.split('-')[1] : null

  useEffect(() => {
    if (bookingId) {
      apiFetch(`/api/payments/status/${bookingId}`)
        .then((res) => setBooking(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Memuat e-tiket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {status === 'success' ? (
        <ETicket booking={booking} />
      ) : (
        <StatusCard status={status} orderId={orderId} />
      )}

      <p className="text-center text-xs text-gray-400 mt-8">
        Pertanyaan?{' '}
        <a href="tel:0857-5961-6910" className="text-green-600">0857-5961-6910</a>
        {' '}atau{' '}
        <a href="mailto:contact@bodogolfarm.com" className="text-green-600">contact@bodogolfarm.com</a>
      </p>
    </div>
  )
}
