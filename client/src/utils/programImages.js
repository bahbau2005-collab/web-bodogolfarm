import paud from '../assets/paud.webp'
import sekolah from '../assets/sekolah.webp'
import outing from '../assets/outing.webp'
import magang from '../assets/magang.webp'

/**
 * Petakan judul/nama program ke foto yang sesuai (cocokkan kata kunci).
 * Dipakai di halaman Beranda (constants) & Programs (data API).
 */
export function programImage(titleOrName = '') {
  const t = (titleOrName || '').toLowerCase()
  if (t.includes('paud')) return paud
  if (t.includes('sekolah')) return sekolah
  if (t.includes('outing')) return outing
  if (t.includes('magang') || t.includes('training') || t.includes('pelatihan')) return magang
  return paud
}
