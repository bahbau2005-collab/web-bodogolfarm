import { Link } from 'react-router-dom'

/**
 * HeroSection — bagian paling atas Beranda.
 * Layout: teks + CTA di kiri, foto farm di kanan (sesuai design reference).
 */
export default function HeroSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        {/* Teks */}
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
              className="inline-flex items-center rounded-lg border border-secondary px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary-container/40"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>

        {/* Gambar */}
        <div className="overflow-hidden rounded-xl shadow-soft-lg">
          <img
            src="https://images.unsplash.com/photo-1500595046891-d9aee9a95fe5?w=1000&h=750&fit=crop"
            alt="Suasana peternakan Bodogol Farm"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
