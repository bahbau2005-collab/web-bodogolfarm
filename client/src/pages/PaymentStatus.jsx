import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { Card, Chip } from '../components/ui'
import { formatRupiah, formatTanggal } from '../utils/format'

const WA_NUMBER = '6285759616910'

/** Rangkai teks peserta: "2 Dewasa, 1 Anak" */
function guestsLabel(booking) {
  const a = booking?.adults || 0
  const c = booking?.children || 0
  if (!a && !c) return `${booking?.participants || 1} orang`
  const parts = []
  if (a) parts.push(`${a} Dewasa`)
  if (c) parts.push(`${c} Anak`)
  return parts.join(', ')
}

/** E-Ticket (status lunas/sukses) */
function ETicket({ booking }) {
  const code = booking?.ticketCode || booking?.paymentOrderId || 'BF-XXXX'
  const program = booking?.program || {}
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(code)}`

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-container text-2xl text-on-success-container">
          ✓
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-primary">
          Booking Anda Terkonfirmasi!
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Salinan tiket ini juga dikirim ke email Anda.
        </p>
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Kode E-Ticket
            </p>
            <p className="mt-1 font-heading text-2xl font-bold tracking-wider text-on-surface">
              {code}
            </p>
          </div>
          <Chip tone="success">Lunas</Chip>
        </div>

        <div className="mt-6 flex flex-col gap-6 border-t border-outline-variant/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <Field label="Nama Pemesan" value={booking?.customerName || '-'} />
            <Field label="Peserta" value={guestsLabel(booking)} />
            <Field label="Program" value={program.title || '-'} />
            <div className="flex gap-8">
              <Field label="Tanggal" value={formatTanggal(booking?.bookingDate)} />
              <Field label="Durasi" value={program.duration || '-'} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 sm:border-l sm:border-outline-variant/60 sm:pl-6">
            <img src={qrUrl} alt="QR e-ticket" className="h-32 w-32 rounded-lg" />
            <p className="max-w-[8rem] text-center text-xs text-on-surface-variant">
              Tunjukkan QR ini di pintu masuk farm.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-surface-low px-4 py-3">
          <span className="text-sm text-on-surface-variant">Total Pembayaran</span>
          <span className="font-bold text-primary">{formatRupiah(booking?.totalAmount || 0)}</span>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container"
        >
          Unduh / Cetak E-Ticket
        </button>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Bodogol Farm, saya ingin konfirmasi tiket ' + code)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-secondary px-6 py-3 text-sm font-medium text-secondary transition-colors hover:bg-secondary-container/40"
        >
          Hubungi via WhatsApp
        </a>
      </div>
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm text-on-surface-variant hover:text-primary">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

/** Status non-sukses: pending / gagal / batal */
function StatusCard({ status, orderId }) {
  const cfg = {
    pending: {
      tone: 'warning', icon: '⏳', title: 'Menunggu Pembayaran',
      msg: 'Pembayaran belum selesai. Jika Anda baru saja membayar, tunggu beberapa saat lalu muat ulang halaman ini — status akan otomatis diperbarui.',
      primary: { text: 'Muat Ulang Status', href: '' },
    },
    error: {
      tone: 'danger', icon: '✕', title: 'Pembayaran Gagal',
      msg: 'Pembayaran tidak dapat diproses. Silakan coba lagi.',
      primary: { text: 'Coba Lagi', href: '/booking' },
    },
    cancel: {
      tone: 'neutral', icon: '⊘', title: 'Pembayaran Dibatalkan',
      msg: 'Pembayaran dibatalkan. Anda bisa booking ulang kapan saja.',
      primary: { text: 'Booking Ulang', href: '/booking' },
    },
  }[status] || {
    tone: 'danger', icon: '✕', title: 'Status Tidak Diketahui',
    msg: 'Tidak dapat memuat status pembayaran.',
    primary: { text: 'Ke Beranda', href: '/' },
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-2xl">
          {cfg.icon}
        </div>
        <Chip tone={cfg.tone}>{cfg.title}</Chip>
        <p className="mt-4 text-sm text-on-surface-variant">{cfg.msg}</p>
        {orderId && (
          <p className="mt-3 text-xs text-on-surface-variant">Order ID: {orderId}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {cfg.primary.href ? (
            <Link
              to={cfg.primary.href}
              className="rounded-lg bg-primary py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
            >
              {cfg.primary.text}
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
            >
              {cfg.primary.text}
            </button>
          )}
          <Link
            to="/contact"
            className="rounded-lg bg-surface-container py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-high"
          >
            Hubungi Kami
          </Link>
        </div>
      </Card>
    </div>
  )
}

// Status pembayaran asli (dari DB) -> tampilan
const PAYMENT_VIEW = {
  paid: 'success',
  pending: 'pending',
  challenge: 'pending',
  unknown: 'pending',
  failed: 'error',
  cancelled: 'cancel',
}

export default function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

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
    return <div className="py-32 text-center text-on-surface-variant">Memuat status…</div>
  }

  // Sumber kebenaran = status pembayaran di database (bukan parameter URL),
  // supaya tidak menampilkan "Lunas" kalau sebenarnya belum dibayar.
  const view = PAYMENT_VIEW[booking?.paymentStatus] || 'pending'

  return (
    <div className="min-h-screen bg-surface-low px-6 py-16">
      {view === 'success' ? (
        <ETicket booking={booking} />
      ) : (
        <StatusCard status={view} orderId={orderId} />
      )}
      <p className="mt-10 text-center text-xs text-on-surface-variant">
        Pertanyaan?{' '}
        <a href="tel:085759616910" className="text-primary">0857-5961-6910</a> ·{' '}
        <a href="mailto:contact@bodogolfarm.com" className="text-primary">
          contact@bodogolfarm.com
        </a>
      </p>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-on-surface">{value}</p>
    </div>
  )
}
