import { SITE_CONFIG } from '../utils/constants'

/**
 * PENJELASAN FOOTER COMPONENT:
 * Footer adalah bagian bawah website yang berisi:
 * - Informasi kontak lengkap
 * - Social media links
 * - Quick links (menu cepat)
 * - Copyright info
 * 
 * Struktur:
 * - 3 kolom: Info, Social, Quick Links
 * - Satu baris copyright di bawah
 */

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Content - 3 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Kolom 1: Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bodogol Farm</h3>
            <p className="text-gray-400 text-sm mb-4">
              Peternakan domba modern terintegrasi & konsep wisata edukasi
            </p>
            <p className="text-gray-400 text-sm">
              <strong>Alamat:</strong> {SITE_CONFIG.location.address}
            </p>
            <p className="text-gray-400 text-sm">
              <strong>Telepon:</strong> {SITE_CONFIG.location.phone}
            </p>
            <p className="text-gray-400 text-sm">
              <strong>Email:</strong> {SITE_CONFIG.location.email}
            </p>
          </div>

          {/* Kolom 2: Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="space-y-3">
              <a 
                href={SITE_CONFIG.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-green-400 transition"
              >
                📱 Instagram @bodogolfarm
              </a>
              <a 
                href={SITE_CONFIG.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-green-400 transition"
              >
                f Facebook
              </a>
              <a 
                href={SITE_CONFIG.socialMedia.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-green-400 transition"
              >
                ▶️ YouTube
              </a>
            </div>
          </div>

          {/* Kolom 3: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Program</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Edukasi</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Kontak</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2024 Bodogol Farm. Semua hak dilindungi. 
            <br />
            #SELARASHIDUPDIKANDANG
          </p>
        </div>

      </div>
    </footer>
  )
}
