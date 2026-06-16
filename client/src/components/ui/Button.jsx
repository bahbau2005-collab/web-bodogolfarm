/**
 * Button — sesuai design system Bodogol Farm.
 * variant:
 *   - primary   : Deep Forest Green, teks putih (aksi utama)
 *   - secondary : outline Warm Brown, background transparan
 *   - ghost     : tanpa border, untuk aksi minor
 *   - danger    : merah, untuk aksi destruktif
 * size: sm | md | lg
 */
const VARIANTS = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container shadow-soft',
  secondary:
    'border border-secondary text-secondary bg-transparent hover:bg-secondary-container/40',
  ghost:
    'bg-transparent text-on-surface hover:bg-surface-container',
  danger:
    'bg-danger text-white hover:opacity-90',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
