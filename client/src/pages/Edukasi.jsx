import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { Card, Chip } from '../components/ui'

/**
 * Edukasi — Hub artikel edukasi (data dari /api/articles). Filter kategori + modal baca.
 */
export default function Edukasi() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    apiFetch('/api/articles')
      .then((res) => setArticles(res.data || []))
      .catch(() => setError('Gagal memuat artikel. Pastikan server aktif.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))],
    [articles]
  )

  const filtered = selectedCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === selectedCategory)

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-surface-low py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold text-on-surface">
            Hub Edukasi Peternakan
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            Pengetahuan mendalam tentang dunia peternakan domba modern — dari
            teknik breeding hingga manajemen bisnis.
          </p>
        </div>
      </section>

      {/* Filter kategori */}
      {!loading && !error && articles.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === c
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-high'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid artikel */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1280px] px-6">
          {loading && <p className="py-16 text-center text-on-surface-variant">Memuat artikel…</p>}
          {error && !loading && (
            <Card className="mx-auto max-w-md text-center"><p className="text-danger">{error}</p></Card>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="py-16 text-center text-on-surface-variant">Belum ada artikel.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <Card key={a._id} padded={false} hover className="overflow-hidden" onClick={() => setSelectedArticle(a)}>
                  {a.image ? (
                    <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-surface-high text-4xl">📚</div>
                  )}
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Chip tone="info">{a.category}</Chip>
                      <span className="text-xs text-on-surface-variant">{a.readTime}</span>
                    </div>
                    <h3 className="line-clamp-2 font-heading text-lg font-semibold text-on-surface">{a.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">{a.excerpt}</p>
                    <p className="mt-4 text-sm font-medium text-secondary">Baca Selengkapnya →</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal artikel */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedArticle(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-lowest p-8 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Chip tone="info">{selectedArticle.category}</Chip>
                <h2 className="mt-3 font-heading text-2xl font-bold text-on-surface">{selectedArticle.title}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{selectedArticle.readTime}</p>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-2xl text-on-surface-variant hover:text-on-surface">✕</button>
            </div>

            {selectedArticle.image && (
              <img src={selectedArticle.image} alt={selectedArticle.title} className="mt-6 aspect-[16/9] w-full rounded-lg object-cover" />
            )}

            <div className="mt-6 space-y-4 text-on-surface-variant">
              <p>{selectedArticle.content || selectedArticle.excerpt}</p>
              <div className="rounded-lg border-l-4 border-primary bg-success-container/40 p-4 text-sm text-on-success-container">
                💡 <strong>Tips Bodogol Farm:</strong> Kunjungi peternakan kami untuk
                melihat implementasi praktis dari teori dalam artikel ini.
              </div>
            </div>

            <div className="mt-8 border-t border-outline-variant/60 pt-6 text-center">
              <p className="text-on-surface-variant">Ingin belajar lebih dalam?</p>
              <Link to="/booking" className="mt-4 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:bg-primary-container">
                Booking Program Edukasi
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
