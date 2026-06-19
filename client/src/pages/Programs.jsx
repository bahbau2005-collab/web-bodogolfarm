import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { Card, Chip } from '../components/ui'
import { formatRupiah } from '../utils/format'
import { programImage } from '../utils/programImages'

// Label tampilan (enum DB -> Indonesia)
const TYPE_LABELS = {
  agrotourism: 'Agrowisata',
  edukasi: 'Edukasi',
  training: 'Pelatihan',
}
const CATEGORY_LABELS = {
  family: 'Keluarga',
  school: 'Sekolah',
  university: 'Kampus',
  umum: 'Umum',
}
const MODE_LABELS = { offline: 'Offline', online: 'Online' }
const UNIT_LABELS = {
  orang: '/orang',
  paket: '/paket',
  course: '/course',
  semester: '/semester',
}

const TYPE_OPTIONS = ['agrotourism', 'edukasi', 'training']
const MODE_OPTIONS = ['offline', 'online']

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [modeFilter, setModeFilter] = useState('all')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await apiFetch('/api/programs')
        setPrograms(response.data || [])
      } catch (err) {
        setError('Gagal memuat program. Pastikan server aktif.')
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const okType = typeFilter === 'all' || p.type === typeFilter
      const okMode = modeFilter === 'all' || p.mode === modeFilter
      return okType && okMode
    })
  }, [programs, typeFilter, modeFilter])

  return (
    <div className="w-full">
      {/* Header halaman */}
      <section className="bg-surface-low py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="font-heading text-4xl font-bold text-on-surface">
            Layanan Kami
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-on-surface-variant">
            Jelajahi berbagai program agrowisata dan pelatihan edukasi. Pesan
            kunjungan atau daftar program hari ini.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Filter */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <FilterGroup
              label="Jenis"
              value={typeFilter}
              onChange={setTypeFilter}
              options={TYPE_OPTIONS}
              labels={TYPE_LABELS}
            />
            <span className="hidden h-6 w-px bg-outline-variant sm:block" />
            <FilterGroup
              label="Mode"
              value={modeFilter}
              onChange={setModeFilter}
              options={MODE_OPTIONS}
              labels={MODE_LABELS}
            />
          </div>

          {/* State */}
          {loading && (
            <div className="py-20 text-center text-on-surface-variant">
              Memuat program…
            </div>
          )}
          {error && !loading && (
            <Card className="mx-auto max-w-md text-center">
              <p className="text-danger">{error}</p>
            </Card>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-20 text-center text-on-surface-variant">
              Tidak ada program untuk filter ini.
            </div>
          )}

          {/* Grid program */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((program) => (
                <Card key={program._id} padded={false} hover className="flex flex-col overflow-hidden">
                  <img
                    src={programImage(program.title)}
                    alt={program.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {program.type && (
                        <Chip tone="info">{TYPE_LABELS[program.type] || program.type}</Chip>
                      )}
                      {program.mode && (
                        <Chip tone="neutral">{MODE_LABELS[program.mode] || program.mode}</Chip>
                      )}
                      {program.category && program.category !== 'umum' && (
                        <Chip tone="neutral">{CATEGORY_LABELS[program.category] || program.category}</Chip>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-on-surface">
                      {program.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-on-surface-variant">
                      {program.description}
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-on-surface-variant">
                      <p>Durasi: {program.duration}</p>
                      <p>Kapasitas: {program.capacity} peserta</p>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary">
                          {formatRupiah(program.price)}
                        </span>
                        <span className="ml-1 text-sm text-on-surface-variant">
                          {UNIT_LABELS[program.priceUnit] || ''}
                        </span>
                      </div>
                      <Link
                        to={`/booking?program=${program._id}`}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
                      >
                        Booking
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/** Grup tombol filter (pill) */
function FilterGroup({ label, value, onChange, options, labels }) {
  const all = ['all', ...options]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-on-surface-variant">{label}:</span>
      {all.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            value === opt
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-high'
          }`}
        >
          {opt === 'all' ? 'Semua' : labels[opt]}
        </button>
      ))}
    </div>
  )
}
