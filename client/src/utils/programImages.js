import paud from '../assets/paud.png'
import sekolah from '../assets/sekolah.png'
import outing from '../assets/outing.png'
import magang from '../assets/magang.png'

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
