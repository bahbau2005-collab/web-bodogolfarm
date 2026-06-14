import { SITE_CONFIG, PILLARS } from '../utils/constants'

/**
 * PENJELASAN ABOUT PAGE:
 * Halaman Tentang Kami yang lebih detail daripada section di homepage.
 * Berisi:
 * 1. Company Profile (nama resmi, deskripsi)
 * 2. Visi & Misi (4 poin)
 * 3. 6 Pilar Manajemen (detail version)
 * 4. Tim & Pengelola (Ahkam founder)
 * 5. Lokasi & Akses
 */

export default function About() {
  return (
    <div className="w-full">

      {/* HERO SECTION ABOUT */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Tentang Bodogol Farm
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Peternakan domba modern terintegrasi yang berjarak hanya 1-2 jam dari Jabodetabek,
            dengan suhu ideal (19-31°C) dan sumber hijauan melimpah.
          </p>
        </div>
      </section>

      {/* COMPANY PROFILE */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Profil Perusahaan
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                <strong>Nama Resmi:</strong> PT. Agrowisata Prima Bodogol Edu Farm
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Kami adalah peternakan domba modern terintegrasi yang fokus pada program Breeding (pembiakan),
                Fattening (penggemukan), dan Trading (jual-beli komoditas domba).
              </p>
              <p className="text-lg text-gray-700">
                Didirikan sejak 2018, Bodogol Farm telah berkembang menjadi pusat edukasi dan inovasi
                dalam bidang peternakan yang berkelanjutan.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 h-96 rounded-lg flex items-center justify-center text-white text-6xl">
              🏢
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Visi & Misi Kami
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Visi</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {SITE_CONFIG.vision}
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Misi</h3>
              <ul className="space-y-3">
                {SITE_CONFIG.missions.map((mission, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6 PILAR MANAJEMEN - DETAIL VERSION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            6 Pilar Manajemen Bodogol Farm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIM & PENGELOLA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Tim & Pengelola
          </h2>

          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              {/* Avatar Placeholder */}
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-6xl">
                👨‍🌾
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nuur Muhammad Ahkam
              </h3>
              <p className="text-green-600 font-semibold mb-4">
                Founder & Komandan Peternak Muda Sukabumi
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ahkam adalah penggerak utama di balik inovasi peternakan modern di Bodogol Farm.
                Dengan pengalaman dan dedikasi yang tinggi, beliau terus mendorong pengembangan
                peternakan berkelanjutan dan edukasi bagi masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LOKASI & AKSES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Lokasi & Akses
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Lokasi */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Alamat Lengkap
              </h3>
              <p className="text-gray-700 mb-4">
                {SITE_CONFIG.location.address}
              </p>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Akses & Kondisi
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Berada sekitar ± 100 meter dari pemukiman penduduk</li>
                <li>✅ Akses jalan yang mudah/tidak macet</li>
                <li>✅ Suhu ideal: 19-31°C</li>
                <li>✅ Sumber hijauan melimpah</li>
                <li>✅ Jarak dari Jabodetabek: 1-2 jam</li>
              </ul>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center text-gray-500 text-xl">
              🗺️ Google Maps Embed<br/>
              (Lokasi Bodogol Farm)
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}