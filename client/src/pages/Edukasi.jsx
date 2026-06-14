import { useState } from 'react'

/**
 * EDUKASI PAGE
 * Halaman edukasi tentang peternakan domba dan manajemen ternak.
 * Berisi artikel edukasi, tips peternakan, dan informasi berguna.
 */

const EDUKASI_ARTICLES = [
  {
    id: 1,
    title: "Panduan Lengkap Beternak Domba Modern",
    excerpt: "Pelajari langkah-langkah praktis memulai peternakan domba dari nol hingga menghasilkan.",
    content: "Peternakan domba modern membutuhkan perencanaan yang matang...",
    category: "Panduan",
    readTime: "5 min read",
    image: "/images/edukasi/domba-modern.jpg"
  },
  {
    id: 2,
    title: "Pakan Ternak yang Efektif untuk Pertumbuhan Optimal",
    excerpt: "Strategi pemberian pakan yang tepat untuk meningkatkan produktivitas ternak domba.",
    content: "Pakan merupakan 70% dari keberhasilan peternakan...",
    category: "Nutrisi",
    readTime: "4 min read",
    image: "/images/edukasi/pakan.jpg"
  },
  {
    id: 3,
    title: "Manajemen Kesehatan Domba di Peternakan",
    excerpt: "Cara mencegah dan menangani penyakit umum pada ternak domba.",
    content: "Kesehatan ternak adalah prioritas utama dalam peternakan modern...",
    category: "Kesehatan",
    readTime: "6 min read",
    image: "/images/edukasi/kesehatan.jpg"
  },
  {
    id: 4,
    title: "Bisnis Peternakan Domba: Dari Hobi ke Profit",
    excerpt: "Analisis profitabilitas dan strategi bisnis peternakan domba yang sukses.",
    content: "Peternakan domba bukan hanya hobi, tapi juga peluang bisnis yang menjanjikan...",
    category: "Bisnis",
    readTime: "7 min read",
    image: "/images/edukasi/bisnis.jpg"
  },
  {
    id: 5,
    title: "Teknologi Modern dalam Peternakan Domba",
    excerpt: "Penerapan teknologi IoT dan AI untuk efisiensi peternakan modern.",
    content: "Teknologi telah merevolusi cara kita mengelola peternakan...",
    category: "Teknologi",
    readTime: "5 min read",
    image: "/images/edukasi/teknologi.jpg"
  },
  {
    id: 6,
    title: "Sustainability dalam Peternakan Domba",
    excerpt: "Praktik peternakan berkelanjutan untuk masa depan yang lebih baik.",
    content: "Peternakan berkelanjutan adalah kunci keberlanjutan lingkungan...",
    category: "Sustainability",
    readTime: "4 min read",
    image: "/images/edukasi/sustainability.jpg"
  }
]

const CATEGORIES = ["Semua", "Panduan", "Nutrisi", "Kesehatan", "Bisnis", "Teknologi", "Sustainability"]

export default function Edukasi() {
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedArticle, setSelectedArticle] = useState(null)

  const filteredArticles = selectedCategory === "Semua"
    ? EDUKASI_ARTICLES
    : EDUKASI_ARTICLES.filter(article => article.category === selectedCategory)

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Edukasi Peternakan
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Temukan pengetahuan mendalam tentang dunia peternakan domba modern,
            dari teknik breeding hingga manajemen bisnis yang sukses.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                {/* Article Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-6xl opacity-50">📚</div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 text-green-600 font-medium text-sm">
                    Baca Selengkapnya →
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full mb-3 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {selectedArticle.readTime}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Article Image */}
              <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-8">
                <div className="text-8xl opacity-50">📖</div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedArticle.content}
                </p>

                {/* Sample expanded content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pendahuluan</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Dalam dunia peternakan modern, pengetahuan yang tepat adalah kunci keberhasilan.
                  Artikel ini akan membahas secara mendalam tentang topik yang Anda pilih.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Langkah-langkah Praktis</h3>
                <ol className="list-decimal list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
                  <li>Persiapan dan perencanaan yang matang</li>
                  <li>Implementasi teknik-teknik terbaik</li>
                  <li>Monitoring dan evaluasi berkala</li>
                  <li>Optimasi berdasarkan hasil yang didapat</li>
                </ol>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tips dan Trik</h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
                  <li>Konsistensi dalam penerapan metode</li>
                  <li>Pembelajaran berkelanjutan dari praktik</li>
                  <li>Kolaborasi dengan ahli di bidangnya</li>
                  <li>Dokumentasi setiap langkah dan hasil</li>
                </ul>

                <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                  <p className="text-green-800 font-medium">
                    💡 <strong>Tips Bodogol Farm:</strong> Kunjungi peternakan kami untuk melihat
                    implementasi praktis dari teori-teori yang dibahas dalam artikel ini.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Ingin Belajar Lebih Dalam?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Daftar program edukasi kami dan dapatkan pengalaman langsung di peternakan modern.
                  </p>
                  <a
                    href="/booking"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                  >
                    Booking Program Edukasi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}