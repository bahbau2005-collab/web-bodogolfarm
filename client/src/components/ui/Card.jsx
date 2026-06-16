/**
 * Card — komponen signature design system.
 * Background putih, radius 24px (rounded-xl), shadow lembut, padding 24px.
 * Pakai `hover` untuk efek "lift" halus (mis. kartu layanan yang bisa diklik).
 */
export default function Card({
  children,
  className = '',
  hover = false,
  padded = true,
  ...props
}) {
  return (
    <div
      className={`bg-surface-lowest rounded-xl shadow-soft ${padded ? 'p-6' : ''}
        ${hover ? 'transition-shadow duration-200 hover:shadow-soft-lg cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
