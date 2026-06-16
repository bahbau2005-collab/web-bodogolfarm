/**
 * Input — field teks dengan label di atas (label-md).
 * Background putih, border 1px netral; saat focus border jadi Deep Forest Green.
 * Mendukung pesan error & textarea (prop `as="textarea"`).
 */
export default function Input({
  label,
  id,
  error,
  as = 'input',
  className = '',
  required = false,
  ...props
}) {
  const Field = as
  const base = `w-full rounded-lg bg-surface-lowest border px-4 py-2.5 text-on-surface
    placeholder:text-on-surface-variant/60 transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/30
    ${error ? 'border-danger focus:border-danger' : 'border-outline-variant focus:border-primary'}`

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-on-surface-variant"
        >
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <Field
        id={id}
        className={`${base} ${as === 'textarea' ? 'min-h-[96px] resize-y' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
