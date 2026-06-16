import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../utils/constants'

/**
 * Footer — mengikuti design system: background surface-container,
 * brand Deep Forest Green, 3 kolom (Farm Info / Quick Links / Connect).
 */
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-outline-variant/60 bg-surface-container">
      <div className="mx-auto max-w-[1280px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + deskripsi */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-lg font-bold text-primary">
              Bodogol Farm
            </h3>
            <p className="mt-3 text-sm text-on-surface-variant">
              Menyebarkan ilmu peternakan modern yang berkelanjutan untuk masa
              depan pangan Indonesia.
            </p>
          </div>

          {/* Info Farm */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-on-surface">
              Info Farm
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>{SITE_CONFIG.location.address}</li>
              <li>Telp: {SITE_CONFIG.location.phone}</li>
              <li>Email: {SITE_CONFIG.location.email}</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-on-surface">
              Tautan Cepat
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: '/programs', label: 'Program' },
                { to: '/edukasi', label: 'Edukasi' },
                { to: '/about', label: 'Tentang Kami' },
                { to: '/booking', label: 'Booking' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-on-surface-variant transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-on-surface">
              Terhubung
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={SITE_CONFIG.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-outline-variant/60 pt-6 text-center text-sm text-on-surface-variant">
          © {new Date().getFullYear()} Bodogol Farm. Semua hak dilindungi.{' '}
          <span className="font-medium text-secondary">
            {SITE_CONFIG.hashtag}
          </span>
        </div>
      </div>
    </footer>
  )
}
