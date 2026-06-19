import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Chip } from '../components/ui'
import imgDomba from '../assets/domba-modern.png'
import imgPakan from '../assets/pakan.png'
import imgKesehatan from '../assets/kesehatan.png'
import imgBisnis from '../assets/bisnis.png'
import imgTeknologi from '../assets/teknologi.png'
import imgKeberlanjutan from '../assets/keberlanjutan.png'

/**
 * Edukasi — Hub artikel edukasi peternakan. Filter kategori + modal baca.
 */
const EDUKASI_ARTICLES = [
  { id: 1, title: 'Panduan Lengkap Beternak Domba Modern', excerpt: 'Langkah praktis memulai peternakan domba dari nol hingga menghasilkan.', content: 'Peternakan domba modern membutuhkan perencanaan yang matang...', category: 'Panduan', readTime: '5 menit', image: imgDomba },
  { id: 2, title: 'Pakan Ternak yang Efektif untuk Pertumbuhan Optimal', excerpt: 'Strategi pemberian pakan yang tepat untuk meningkatkan produktivitas ternak.', content: 'Pakan merupakan 70% dari keberhasilan peternakan...', category: 'Nutrisi', readTime: '4 menit', image: imgPakan },
  { id: 3, title: 'Manajemen Kesehatan Domba di Peternakan', excerpt: 'Cara mencegah dan menangani penyakit umum pada ternak domba.', content: 'Kesehatan ternak adalah prioritas utama dalam peternakan modern...', category: 'Kesehatan', readTime: '6 menit', image: imgKesehatan },
  { id: 4, title: 'Bisnis Peternakan Domba: Dari Hobi ke Profit', excerpt: 'Analisis profitabilitas dan strategi bisnis peternakan domba yang sukses.', content: 'Peternakan domba bukan hanya hobi, tapi juga peluang bisnis...', category: 'Bisnis', readTime: '7 menit', image: imgBisnis },
  { id: 5, title: 'Teknologi Modern dalam Peternakan Domba', excerpt: 'Penerapan teknologi untuk efisiensi peternakan modern.', content: 'Teknologi telah merevolusi cara kita mengelola peternakan...', category: 'Teknologi', readTime: '5 menit', image: imgTeknologi },
  { id: 6, title: 'Keberlanjutan dalam Peternakan Domba', excerpt: 'Praktik peternakan berkelanjutan untuk masa depan yang lebih baik.', content: 'Peternakan berkelanjutan adalah kunci keberlanjutan lingkungan...', category: 'Keberlanjutan', readTime: '4 menit', image: imgKeberlanjutan },
]
const CATEGORIES = ['Semua', 'Panduan', 'Nutrisi', 'Kesehatan', 'Bisnis', 'Teknologi', 'Keberlanjutan']

export default function Edukasi() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const articles = selectedCategory === 'Semua'
    ? EDUKASI_ARTICLES
    : EDUKASI_ARTICLES.filter((a) => a.category === selectedCategory)

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
      <section className="py-8">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
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

      {/* Grid artikel */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Card key={a.id} padded={false} hover className="overflow-hidden" onClick={() => setSelectedArticle(a)}>
                <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Chip tone="info">{a.category}</Chip>
                    <span className="text-xs text-on-surface-variant">{a.readTime}</span>
                  </div>
                  <h3 className="line-clamp-2 font-heading text-lg font-semibold text-on-surface">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">{a.excerpt}</p>
                  <p className="mt-4 text-sm font-medium text-secondary">Baca Selengkapnya →</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal artikel */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-surface-lowest p-8 shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Chip tone="info">{selectedArticle.category}</Chip>
                <h2 className="mt-3 font-heading text-2xl font-bold text-on-surface">
                  {selectedArticle.title}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">{selectedArticle.readTime}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-2xl text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <img src={selectedArticle.image} alt={selectedArticle.title} className="mt-6 aspect-[16/9] w-full rounded-lg object-cover" />

            <div className="mt-6 space-y-4 text-on-surface-variant">
              <p>{selectedArticle.content}</p>
              <p>
                Dalam dunia peternakan modern, pengetahuan yang tepat adalah kunci
                keberhasilan. Artikel ini membahas secara mendalam topik yang Anda pilih.
              </p>
              <div className="rounded-lg border-l-4 border-primary bg-success-container/40 p-4 text-sm text-on-success-container">
                💡 <strong>Tips Bodogol Farm:</strong> Kunjungi peternakan kami untuk
                melihat implementasi praktis dari teori dalam artikel ini.
              </div>
            </div>

            <div className="mt-8 border-t border-outline-variant/60 pt-6 text-center">
              <p className="text-on-surface-variant">Ingin belajar lebih dalam?</p>
              <Link
                to="/booking"
                className="mt-4 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:bg-primary-container"
              >
                Booking Program Edukasi
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
