import { Link } from 'react-router-dom'
import heroBg from '../assets/hero-bg.webp'

/**
 * HeroSection — bagian paling atas Beranda.
 * Background foto farm yang di-blur + lapisan cream transparan agar teks
 * tetap terbaca (sesuai design reference). Di atasnya: teks + CTA di kiri,
 * foto utama di kanan.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background foto (blur) */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      {/* Lapisan cream transparan untuk keterbacaan */}
      <div className="absolute inset-0 bg-surface/55" aria-hidden="true" />

      {/* Konten */}
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="font-heading text-4xl font-bold leading-tight text-on-surface md:text-5xl">
            Belajar, Mengalami, dan Tumbuh bersama{' '}
            <span className="text-primary">Bodogol Farm</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-on-surface-variant">
            Destinasi edukasi peternakan & agrowisata untuk keluarga, sekolah,
            dan profesional. Belajar peternakan modern yang berkelanjutan dan
            tertata.
          </p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-secondary">
            #SELARASHIDUPDIKANDANG
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/programs"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container"
            >
              Jelajahi Program
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center rounded-lg border border-secondary bg-surface/60 px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary-container/40"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>

        {/* Foto utama */}
        <div className="overflow-hidden rounded-xl shadow-soft-lg">
          <img
            src={heroBg}
            alt="Suasana peternakan Bodogol Farm"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
