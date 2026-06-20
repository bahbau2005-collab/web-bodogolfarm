import { Link } from 'react-router-dom'

/**
 * NotFound — halaman 404 untuk rute yang tidak ada.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-6 py-20">
      <div className="text-center">
        <p className="font-heading text-7xl font-bold text-primary md:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-on-surface">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
          Sepertinya halaman yang kamu cari sudah pindah kandang atau tidak ada.
          Yuk kembali ke halaman utama.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container"
          >
            Kembali ke Beranda
          </Link>
          <Link
            to="/programs"
            className="rounded-lg border border-secondary px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary-container/40"
          >
            Lihat Program
          </Link>
        </div>
      </div>
    </div>
  )
}
