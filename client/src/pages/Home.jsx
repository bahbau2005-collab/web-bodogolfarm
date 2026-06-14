import { PILLARS, PROGRAMS, TESTIMONIALS, SITE_CONFIG } from '../utils/constants'
import HeroSection from '../components/HeroSection'
import PillarCards from '../components/PillarCards'
import ProgramPreview from '../components/ProgramPreview'
import TestimonialCarousel from '../components/TestimonialCarousel'

/**
 * PENJELASAN HOME PAGE:
 * Home adalah halaman utama website yang menampilkan:
 * 1. Hero Banner - Gambar indah + tagline + CTA
 * 2. About Section - Perkenalan singkat
 * 3. Pillar Cards - 6 pilar manajemen dalam grid
 * 4. Program Preview - 3-4 program unggulan
 * 5. Testimonial - Review peserta
 * 6. CTA Booking - Call-to-action untuk booking
 * 
 * Flow: User landing → lihat hero → scroll down → lihat pillar & program → 
 *       lihat testimonial → click booking
 */

export default function Home() {
  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. TENTANG KAMI (SINGKAT) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tentang Bodogol Farm
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Bodogol Farm adalah peternakan domba modern yang terintegrasi dengan konsep wisata edukasi. 
              Kami berlokasi di Desa Purwasari, Sukabumi, dengan suhu ideal (19-31°C) dan sumber hijauan melimpah.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Misi kami adalah menjadi inspirasi dalam membangun ketahanan pangan nasional melalui sektor peternakan, 
              sambil membuka ilmu kepada masyarakat luas.
            </p>
            <button className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition font-semibold">
              Pelajari Lebih Lanjut →
            </button>
          </div>
        </div>
      </section>

      {/* 3. 6 PILAR MANAJEMEN */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Keunggulan Kami: 6 Pilar Manajemen
          </h2>
          <PillarCards pillars={PILLARS} />
        </div>
      </section>

      {/* 4. PROGRAM PREVIEW */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Program Edukasi Kami
          </h2>
          <ProgramPreview programs={PROGRAMS} />
          <div className="text-center mt-12">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition font-semibold">
              Lihat Semua Program →
            </button>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Testimoni Peserta
          </h2>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* 6. CTA BOOKING - PROMINENT */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap untuk Petualangan Edukasi?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan ribuan peserta yang telah belajar dan berkembang bersama Bodogol Farm
          </p>
          <button className="bg-white hover:bg-gray-100 text-green-600 px-10 py-4 rounded-lg transition font-bold text-lg">
            🎯 Booking Sekarang
          </button>
        </div>
      </section>

    </div>
  )
}
