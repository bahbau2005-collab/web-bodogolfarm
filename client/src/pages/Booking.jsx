import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { Card, Chip, Input } from '../components/ui'
import { formatRupiah, formatTanggal } from '../utils/format'

/**
 * Booking — satu halaman terpadu (sesuai design "Book Your Visit"):
 * 1. Pilih program & sesi (tanggal/jam + kuota)
 * 2. Jumlah peserta (dewasa/anak)
 * 3. Data diri
 * + Ringkasan booking & lanjut ke pembayaran (Midtrans).
 */
export default function Booking() {
  const [searchParams] = useSearchParams()
  const [programs, setPrograms] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  const [programId, setProgramId] = useState('')
  const [scheduleId, setScheduleId] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', requests: '' })
  const [fallbackDate, setFallbackDate] = useState('')

  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [error, setError] = useState('')
  const [payment, setPayment] = useState(null)

  // Ambil daftar program
  useEffect(() => {
    apiFetch('/api/programs')
      .then((res) => {
        const list = res.data || []
        setPrograms(list)
        const fromQuery = searchParams.get('program')
        setProgramId(fromQuery && list.some((p) => p._id === fromQuery) ? fromQuery : list[0]?._id || '')
      })
      .catch(() => setError('Gagal memuat program. Pastikan server aktif.'))
      .finally(() => setLoading(false))
  }, [searchParams])

  // Ambil jadwal saat program berubah
  useEffect(() => {
    if (!programId) return
    setScheduleId('')
    apiFetch(`/api/schedules?program=${programId}&upcoming=true`)
      .then((res) => setSchedules(res.data || []))
      .catch(() => setSchedules([]))
  }, [programId])

  const program = useMemo(() => programs.find((p) => p._id === programId), [programs, programId])
  const schedule = useMemo(() => schedules.find((s) => s._id === scheduleId), [schedules, scheduleId])
  const totalParticipants = (Number(adults) || 0) + (Number(children) || 0)
  const totalAmount = program ? program.price * totalParticipants : 0
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const maxPeserta = schedule ? schedule.remaining : program?.capacity || 50
  const overQuota = totalParticipants > maxPeserta
  const canSubmit =
    program &&
    totalParticipants >= 1 &&
    !overQuota &&
    customer.name &&
    customer.email &&
    customer.phone &&
    (schedule || fallbackDate)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('loading')
    setError('')
    try {
      const bookingDate = schedule ? schedule.date : fallbackDate
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          program: programId,
          schedule: schedule ? scheduleId : undefined,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          adults: Number(adults) || 0,
          children: Number(children) || 0,
          participants: totalParticipants,
          bookingDate,
          specialRequests: customer.requests,
        }),
      })
      const pay = await apiFetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ bookingId: res.data._id }),
      })
      setPayment(pay.data)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (loading) {
    return <div className="py-32 text-center text-on-surface-variant">Memuat data booking…</div>
  }

  return (
    <div className="w-full">
      <section className="bg-surface-low py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="font-heading text-3xl font-bold text-on-surface md:text-4xl">
            Selesaikan Booking Anda
          </h1>
          <p className="mt-3 text-on-surface-variant">
            Lengkapi detail di bawah untuk menyelesaikan reservasi.
          </p>
        </div>
      </section>

      <section className="py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-3"
        >
          {/* Kolom kiri: detail */}
          <div className="space-y-6 lg:col-span-2">
            {/* 1. Pilih program & sesi */}
            <Card>
              <StepTitle no={1} title="Pilih Program & Sesi" />
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                    Program
                  </label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-lowest px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} — {formatRupiah(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sesi berjadwal */}
                {schedules.length > 0 ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                      Pilih Sesi (Tanggal & Jam)
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {schedules.map((s) => {
                        const full = s.remaining <= 0 || s.status !== 'open'
                        const active = s._id === scheduleId
                        return (
                          <button
                            type="button"
                            key={s._id}
                            disabled={full}
                            onClick={() => setScheduleId(s._id)}
                            className={`rounded-lg border p-3 text-left transition-colors ${
                              active
                                ? 'border-primary bg-primary-container/20'
                                : 'border-outline-variant hover:border-primary'
                            } ${full ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            <p className="text-sm font-medium text-on-surface">
                              {formatTanggal(s.date)}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {s.startTime}{s.endTime ? `–${s.endTime}` : ''}
                            </p>
                            <div className="mt-2">
                              {full ? (
                                <Chip tone="danger">Penuh</Chip>
                              ) : (
                                <Chip tone="success">Sisa {s.remaining} kuota</Chip>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <Input
                    label="Tanggal Kunjungan"
                    type="date"
                    min={today}
                    value={fallbackDate}
                    onChange={(e) => setFallbackDate(e.target.value)}
                    required
                  />
                )}
              </div>
            </Card>

            {/* 2. Peserta */}
            <Card>
              <StepTitle no={2} title="Jumlah Peserta" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Dewasa"
                  type="number"
                  min={0}
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                />
                <Input
                  label="Anak"
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-on-surface-variant">
                Maks. {maxPeserta} peserta{schedule ? ' untuk sesi ini' : ''}.
              </p>
              {overQuota && (
                <p className="mt-1 text-xs text-danger">
                  Jumlah peserta melebihi kuota tersedia ({maxPeserta}).
                </p>
              )}
            </Card>

            {/* 3. Data diri */}
            <Card>
              <StepTitle no={3} title="Data Diri Anda" />
              <div className="mt-4 space-y-4">
                <Input
                  label="Nama Lengkap"
                  required
                  placeholder="Nama lengkap"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="email@contoh.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  />
                  <Input
                    label="Nomor Telepon"
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>
                <Input
                  as="textarea"
                  label="Permintaan Khusus (opsional)"
                  placeholder="Kebutuhan diet, aksesibilitas, latar belakang/tujuan untuk pelatihan, dll."
                  value={customer.requests}
                  onChange={(e) => setCustomer({ ...customer, requests: e.target.value })}
                />
              </div>
            </Card>
          </div>

          {/* Kolom kanan: ringkasan */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <h3 className="font-heading text-lg font-semibold text-on-surface">
                  Ringkasan Booking
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Program" value={program?.title || '-'} />
                  <Row
                    label="Tanggal"
                    value={schedule ? formatTanggal(schedule.date) : fallbackDate ? formatTanggal(fallbackDate) : '-'}
                  />
                  <Row label="Peserta" value={`${totalParticipants} orang`} />
                  <Row label="Harga satuan" value={program ? formatRupiah(program.price) : '-'} />
                  <div className="border-t border-outline-variant/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-on-surface">Total</span>
                      <span className="font-bold text-primary">{formatRupiah(totalAmount)}</span>
                    </div>
                  </div>
                </dl>

                {status === 'error' && (
                  <p className="mt-4 rounded-lg bg-danger-container px-3 py-2 text-sm text-on-danger-container">
                    {error}
                  </p>
                )}

                {status === 'success' && payment ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = payment.paymentUrl
                    }}
                    className="mt-5 w-full rounded-lg bg-primary py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container"
                  >
                    Bayar Sekarang via Midtrans
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canSubmit || status === 'loading'}
                    className="mt-5 w-full rounded-lg bg-primary py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Memproses…' : 'Lanjut ke Pembayaran'}
                  </button>
                )}
                <p className="mt-3 text-center text-xs text-on-surface-variant">
                  🔒 Pembayaran aman & terenkripsi
                </p>
              </Card>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

function StepTitle({ no, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
        {no}
      </span>
      <h2 className="font-heading text-lg font-semibold text-on-surface">{title}</h2>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-right font-medium text-on-surface">{value}</dd>
    </div>
  )
}
