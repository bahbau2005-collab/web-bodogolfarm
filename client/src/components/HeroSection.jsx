/**
 * PENJELASAN HERO SECTION:
 * Hero section adalah bagian paling atas halaman yang menarik perhatian.
 * Biasanya berisi:
 * - Background image (atau warna)
 * - Headline utama (tagline)
 * - Subheading (deskripsi singkat)
 * - CTA button
 * 
 * Untuk sekarang kita gunakan dummy image dari placeholder service
 */

export default function HeroSection() {
  return (
    <section className="relative h-96 md:h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1500595046891-d9aee9a95fe5?w=1200&h=600&fit=crop)'
      }}>
      
      {/* Dark overlay untuk meningkatkan readability teks */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Kandang Tempat Kamu Belajar
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100">
          Peternakan Domba Modern Terintegrasi & Konsep Wisata Edukasi
        </p>
        <p className="text-lg md:text-xl mb-10 font-semibold text-yellow-300">
          #SELARASHIDUPDIKANDANG
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg transition font-bold text-lg">
          Daftar Kelas Sekarang
        </button>
      </div>
    </section>
  )
}
