import nodemailer from 'nodemailer'

/**
 * Mailer generik berbasis SMTP (nodemailer).
 * Konfigurasi via .env — gampang ganti provider (Gmail / Brevo / Resend / dll)
 * tanpa ubah kode, cukup ganti EMAIL_HOST/PORT/USER/PASS.
 *
 * Kalau belum dikonfigurasi, fungsi sendMail jadi no-op (cuma log warning),
 * jadi aplikasi tetap jalan walau email belum disetel.
 */
const host = process.env.EMAIL_HOST
const port = Number(process.env.EMAIL_PORT) || 587
const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS
const from = process.env.EMAIL_FROM || `Bodogol Farm <${user || 'no-reply@bodogolfarm.com'}>`

const isConfigured = Boolean(host && user && pass && pass !== 'your-app-password')

let transporter = null
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  })
}

/** Kirim email. Aman dipanggil walau belum dikonfigurasi (jadi no-op). */
export async function sendMail({ to, subject, html }) {
  if (!transporter) {
    console.warn(`[Mailer] Email belum dikonfigurasi (.env). Lewati kirim ke ${to} — "${subject}"`)
    return { skipped: true }
  }
  try {
    const info = await transporter.sendMail({ from, to, subject, html })
    console.log(`[Mailer] Email terkirim ke ${to} (${info.messageId})`)
    return { sent: true, info }
  } catch (err) {
    console.error(`[Mailer] Gagal kirim email ke ${to}:`, err.message)
    return { error: err.message }
  }
}

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(n) || 0)

const tanggal = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'

/**
 * Template email e-ticket / konfirmasi booking.
 * paid=true -> sudah lunas (e-ticket); paid=false -> menunggu pembayaran.
 */
export function buildBookingEmail(booking, { paid }) {
  const program = booking.program || {}
  const guests = (() => {
    const a = booking.adults || 0, c = booking.children || 0
    if (!a && !c) return `${booking.participants || 1} orang`
    return [a ? `${a} Dewasa` : '', c ? `${c} Anak` : ''].filter(Boolean).join(', ')
  })()

  const statusBadge = paid
    ? '<span style="background:#d7f0cf;color:#0c3a08;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;">LUNAS</span>'
    : '<span style="background:#ffe2c4;color:#5a3300;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;">MENUNGGU PEMBAYARAN</span>'

  const cta = paid
    ? `<p style="margin:16px 0 0;color:#42493e;font-size:14px;">Tunjukkan kode e-ticket di atas kepada petugas saat tiba di lokasi.</p>`
    : booking.paymentUrl
      ? `<a href="${booking.paymentUrl}" style="display:inline-block;margin-top:16px;background:#154212;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">Selesaikan Pembayaran</a>`
      : ''

  const row = (label, value) =>
    `<tr><td style="padding:6px 0;color:#72796e;font-size:14px;">${label}</td><td style="padding:6px 0;text-align:right;color:#191c18;font-size:14px;font-weight:600;">${value}</td></tr>`

  return `
  <div style="background:#f9faf2;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      <div style="background:#154212;padding:20px 24px;">
        <h1 style="margin:0;color:#fff;font-size:20px;">Bodogol Farm</h1>
        <p style="margin:4px 0 0;color:#bcf0ae;font-size:13px;">${paid ? 'E-Ticket Kunjungan' : 'Konfirmasi Booking'}</p>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 4px;color:#72796e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Kode E-Ticket</p>
        <p style="margin:0;color:#191c18;font-size:26px;font-weight:700;letter-spacing:2px;">${booking.ticketCode || '-'}</p>
        <div style="margin-top:10px;">${statusBadge}</div>

        <table style="width:100%;margin-top:20px;border-top:1px solid #e2e3dc;border-bottom:1px solid #e2e3dc;border-collapse:collapse;">
          ${row('Nama', booking.customerName)}
          ${row('Program', program.title || '-')}
          ${row('Tanggal', tanggal(booking.bookingDate))}
          ${row('Peserta', guests)}
          ${row('Total', rupiah(booking.totalAmount))}
        </table>

        ${cta}

        <p style="margin:24px 0 0;color:#72796e;font-size:12px;line-height:1.6;">
          Bodogol Farm — Kp. Kuta RT 03/RW 09, Desa Purwasari, Cicurug, Sukabumi<br/>
          0857-5961-6910 · contact@bodogolfarm.com
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#9aa093;font-size:11px;margin-top:16px;">Email ini dikirim otomatis, mohon tidak membalas.</p>
  </div>`
}
