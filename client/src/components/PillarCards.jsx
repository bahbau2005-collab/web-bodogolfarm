/**
 * PENJELASAN PILLAR CARDS:
 * Component ini menampilkan 6 pilar manajemen Bodogol dalam grid layout.
 * Setiap card berisi:
 * - Icon emoji
 * - Title (nama pilar)
 * - Description (penjelasan singkat)
 * 
 * Layout:
 * - Desktop: 3 kolom (3x2 grid)
 * - Mobile: 1 kolom (full width)
 * - Tablet: 2 kolom
 */

export default function PillarCards({ pillars }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pillars.map((pillar) => (
        <div 
          key={pillar.id}
          className="bg-white border-2 border-green-100 rounded-lg p-8 hover:shadow-lg hover:border-green-400 transition"
        >
          {/* Icon */}
          <div className="text-5xl mb-4">
            {pillar.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {pillar.title}
          </h3>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {pillar.description}
          </p>
        </div>
      ))}
    </div>
  )
}
