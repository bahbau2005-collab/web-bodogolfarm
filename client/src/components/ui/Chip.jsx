/**
 * Chip — status pill. Background tint lembut + teks warna senada.
 * tone: success (Lunas) | warning (Pending) | danger (Gagal/Batal)
 *       | neutral (Selesai/Nonaktif) | info (label umum)
 */
const TONES = {
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  danger: 'bg-danger-container text-on-danger-container',
  neutral: 'bg-neutral-container text-on-neutral-container',
  info: 'bg-secondary-container/60 text-on-secondary-container',
}

export default function Chip({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1
        text-xs font-semibold tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
