/**
 * Helper format untuk tampilan (mata uang Rupiah & tanggal Indonesia).
 * Dipakai di seluruh halaman agar konsisten (bukan dollar).
 */

/** Format angka jadi Rupiah, mis. 450000 -> "Rp 450.000" */
export function formatRupiah(value) {
  const number = Number(value) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

/** Format tanggal Indonesia, mis. "24 Oktober 2026" */
export function formatTanggal(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format tanggal + jam, mis. "24 Okt 2026, 09:00" */
export function formatTanggalJam(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
