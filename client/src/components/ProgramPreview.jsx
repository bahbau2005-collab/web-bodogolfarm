/**
 * PENJELASAN PROGRAM PREVIEW:
 * Component ini menampilkan preview 4 program utama dalam card layout.
 * Setiap card berisi:
 * - Image dummy
 * - Title program
 * - Description singkat
 * - Duration dan harga
 * - Button "Lihat Detail"
 * 
 * Ini adalah preview singkat, detail lengkap akan di halaman Program tersendiri
 */

export default function ProgramPreview({ programs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {programs.map((program) => (
        <div 
          key={program.id}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
        >
          {/* Program Image Dummy */}
          <div 
            className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-6xl"
          >
            {program.icon || '📸'}
          </div>

          {/* Program Info */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {program.name}
            </h3>

            {/* Description (truncate) */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {program.description}
            </p>

            {/* Duration & Price */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Durasi:</span> {program.duration}
              </p>
              <p className="text-sm text-green-600 font-bold">
                Rp {program.price.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition font-semibold text-sm">
              Lihat Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
