import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../utils/api'

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await apiFetch('/api/programs')
        setPrograms(response.data || [])
      } catch (err) {
        console.error('Error fetching programs:', err)
        // Fallback to mock data if API fails
        setPrograms([
          {
            _id: '1',
            title: 'Edukasi Sekolah',
            description: 'Program edukasi untuk siswa SD-SMA',
            duration: '1 hari',
            price: 200000,
            capacity: 30,
            schedule: 'Senin-Jumat',
            facilities: ['Snack', 'Makan siang', 'Materi']
          },
          {
            _id: '2',
            title: 'Paket Outing Days',
            description: 'Wisata edukasi untuk grup/komunitas',
            duration: '1 hari',
            price: 350000,
            capacity: 50,
            schedule: 'Akhir pekan',
            facilities: ['Breakfast', 'Makan siang', 'Snack']
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  console.log('Programs render:', { programs, loading })

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat program...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Program Edukasi Bodogol Farm
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Berbagai program edukasi peternakan
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <div key={program._id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-64 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-6xl">
                  📚
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">Durasi: {program.duration}</p>
                    <p className="text-sm text-gray-600">Kapasitas: {program.capacity} peserta</p>
                    <p className="text-2xl font-bold text-green-600">
                      Rp {program.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition font-semibold text-center block"
                  >
                    Booking Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}