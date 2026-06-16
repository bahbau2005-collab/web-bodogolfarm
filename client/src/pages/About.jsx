import { SITE_CONFIG, PILLARS } from '../utils/constants'
import { Card } from '../components/ui'

/**
 * About — profil perusahaan, visi & misi, 6 pilar, tim, lokasi.
 */
export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-surface-low py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-heading text-4xl font-bold text-on-surface">
            Tentang Bodogol Farm
          </h1>
          <p className="mt-4 text-lg text-on-surface-variant">
            Peternakan domba modern terintegrasi, hanya 1–2 jam dari Jabodetabek,
            dengan suhu ideal (19–31°C) dan sumber hijauan melimpah.
          </p>
        </div>
      </section>

      {/* Profil perusahaan */}
      <section className="py-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-on-surface">
              Profil Perusahaan
            </h2>
            <p className="mt-6 text-on-surface-variant">
              <strong className="text-on-surface">Nama Resmi:</strong>{' '}
              {SITE_CONFIG.company.name}
            </p>
            <p className="mt-4 text-on-surface-variant">
              Kami fokus pada program Breeding (pembiakan), Fattening (penggemukan),
              dan Trading (jual-beli komoditas domba).
            </p>
            <p className="mt-4 text-on-surface-variant">
              Didirikan sejak {SITE_CONFIG.company.established}, Bodogol Farm berkembang
              menjadi pusat edukasi dan inovasi peternakan berkelanjutan.
            </p>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-surface-high text-6xl shadow-soft">
            🏢
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-surface-low py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
            Visi & Misi Kami
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="font-heading text-xl font-bold text-primary">Visi</h3>
              <p className="mt-4 text-on-surface-variant">{SITE_CONFIG.vision}</p>
            </Card>
            <Card>
              <h3 className="font-heading text-xl font-bold text-primary">Misi</h3>
              <ul className="mt-4 space-y-3">
                {SITE_CONFIG.missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                    <span className="mt-1 text-primary">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 6 Pilar */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-on-surface">
            6 Pilar Manajemen Bodogol Farm
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <Card key={p.id} hover>
                <div className="text-3xl">{p.icon}</div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-on-surface">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">{p.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="bg-surface-low py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-on-surface">
            Tim & Pengelola
          </h2>
          <Card className="mt-12">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-surface-high text-5xl">
              👨‍🌾
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold text-on-surface">
              {SITE_CONFIG.company.founder}
            </h3>
            <p className="mt-1 font-medium text-secondary">
              Founder & Komandan Peternak Muda Sukabumi
            </p>
            <p className="mt-4 text-on-surface-variant">
              Penggerak utama di balik inovasi peternakan modern di Bodogol Farm,
              terus mendorong peternakan berkelanjutan dan edukasi bagi masyarakat.
            </p>
          </Card>
        </div>
      </section>

      {/* Lokasi */}
      <section className="py-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-on-surface">
              Lokasi & Akses
            </h2>
            <p className="mt-6 text-on-surface-variant">{SITE_CONFIG.location.address}</p>
            <h3 className="mt-8 font-heading text-lg font-semibold text-on-surface">
              Akses & Kondisi
            </h3>
            <ul className="mt-4 space-y-2 text-on-surface-variant">
              {['± 100 meter dari pemukiman penduduk', 'Akses jalan mudah / tidak macet', 'Suhu ideal: 19–31°C', 'Sumber hijauan melimpah', 'Jarak dari Jabodetabek: 1–2 jam'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-surface-high text-on-surface-variant shadow-soft">
            🗺️ Peta Lokasi Bodogol Farm
          </div>
        </div>
      </section>
    </div>
  )
}
