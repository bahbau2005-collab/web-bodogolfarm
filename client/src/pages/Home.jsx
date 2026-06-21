import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PILLARS, PROGRAMS } from '../utils/constants'
import HeroSection from '../components/HeroSection'
import { Card } from '../components/ui'
import { formatRupiah } from '../utils/format'
import { programImage } from '../utils/programImages'
import { apiFetch } from '../utils/api'

/**
 * Home — halaman utama. Section: Hero, Tentang singkat, 6 Pilar,
 * Preview Program, Testimoni, CTA Booking. Memakai design system.
 */
export default function Home() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    apiFetch('/api/testimonials')
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]))
  }, [])

  return (
    <div className="w-full">
      <HeroSection />

      {/* Tentang singkat */}
      <section className="bg-surface-low py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-on-surface">
            Tentang Bodogol Farm
          </h2>
          <p className="mt-6 text-lg text-on-surface-variant">
            Bodogol Farm adalah peternakan domba modern terintegrasi dengan
            konsep wisata edukasi. Berlokasi di Desa Purwasari, Sukabumi, dengan
            suhu ideal (19–31°C) dan sumber hijauan melimpah.
          </p>
          <p className="mt-4 text-lg text-on-surface-variant">
            Misi kami: menjadi inspirasi membangun ketahanan pangan nasional
            lewat sektor peternakan, sambil membuka ilmu kepada masyarakat luas.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </section>

      {/* 6 Pilar */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
            Keunggulan Kami: 6 Pilar Manajemen
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pilar) => (
              <Card key={pilar.id} hover>
                <div className="text-3xl">{pilar.icon}</div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-on-surface">
                  {pilar.title}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {pilar.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Program */}
      <section className="bg-surface-low py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
            Program Edukasi Kami
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((program) => (
              <Card key={program.id} padded={false} hover className="overflow-hidden">
                <img
                  src={programImage(program.name)}
                  alt={program.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold text-on-surface">
                    {program.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                    {program.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-primary">
                      {formatRupiah(program.price)}
                    </span>
                    <Link
                      to="/programs"
                      className="text-sm font-medium text-secondary hover:underline"
                    >
                      Detail →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/programs"
              className="inline-flex rounded-lg border border-secondary px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary-container/40"
            >
              Lihat Semua Program
            </Link>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
              Testimoni Peserta
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t._id}>
                  <p className="text-on-surface">“{t.text}”</p>
                  <div className="mt-4 text-sm text-amber-500">
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-on-surface">{t.name}</p>
                      <p className="text-sm text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Booking */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-on-primary md:text-4xl">
            Siap untuk Petualangan Edukasi?
          </h2>
          <p className="mt-4 text-lg text-on-primary/80">
            Bergabunglah dengan peserta lain yang telah belajar dan berkembang
            bersama Bodogol Farm.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-flex rounded-lg bg-on-primary px-8 py-4 font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Booking Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}
