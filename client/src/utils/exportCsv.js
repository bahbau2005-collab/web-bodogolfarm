/**
 * Download data sebagai file CSV (bisa langsung dibuka di Excel/Spreadsheet).
 * @param {string} filename  nama file (mis. 'laporan.csv')
 * @param {string[]} headers judul kolom
 * @param {Array<Array>} rows baris data
 */
export function downloadCsv(filename, headers, rows) {
  const escape = (v) => {
    const s = String(v ?? '')
    // Bungkus dengan kutip kalau ada koma/kutip/newline
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers, ...rows].map((row) => row.map(escape).join(','))
  // BOM ﻿ supaya Excel kenal UTF-8 (karakter Rp/é dll tidak rusak)
  const csv = '﻿' + lines.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
