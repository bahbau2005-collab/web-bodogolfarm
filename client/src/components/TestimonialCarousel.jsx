/**
 * PENJELASAN TESTIMONIAL CAROUSEL:
 * Component ini menampilkan testimonial peserta dalam grid atau carousel.
 * Setiap testimonial card berisi:
 * - Foto peserta (dummy)
 * - Nama dan role
 * - Quote/review mereka
 * - Rating (bintang)
 * 
 * Ini membantu trust building dan social proof
 */

export default function TestimonialCarousel({ testimonials }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <div 
          key={testimonial.id}
          className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600"
        >
          {/* Rating Stars */}
          <div className="mb-4 text-2xl">
            {'⭐'.repeat(testimonial.rating)}
          </div>

          {/* Quote */}
          <p className="text-gray-700 italic mb-6 text-sm leading-relaxed">
            "{testimonial.text}"
          </p>

          {/* User Info */}
          <div className="flex items-center">
            {/* User Avatar Dummy */}
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl mr-4">
              {testimonial.name.charAt(0)}
            </div>

            {/* Name & Role */}
            <div>
              <p className="font-bold text-gray-900">
                {testimonial.name}
              </p>
              <p className="text-gray-600 text-sm">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
