import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { apiFetch } from '../../utils/api'

const TABS = ['Detail Akun', 'Keamanan']

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0)
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}')
  const token = localStorage.getItem('adminToken')

  const [profile, setProfile] = useState({ name: user.name || '', email: user.email || '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    try {
      const res = await apiFetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile)
      })
      localStorage.setItem('adminUser', JSON.stringify(res.data))
      setProfileMsg('Profil berhasil diperbarui!')
    } catch (err) {
      setProfileMsg('Error: ' + err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwMsg('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg('Password baru tidak cocok!')
      return
    }
    setPwLoading(true)
    try {
      await apiFetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      })
      setPwMsg('Password berhasil diperbarui!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMsg('Error: ' + err.message)
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola profil dan keamanan akun admin</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Detail Akun */}
        {activeTab === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">👤</div>
              <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>

            {profileMsg && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${profileMsg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  value={user.role}
                  disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Keamanan */}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubah Password</h2>

            {pwMsg && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${pwMsg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {pwMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                {pwLoading ? 'Memperbarui...' : 'Perbarui Password'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips Keamanan</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Gunakan password minimal 8 karakter</li>
                <li>• Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                <li>• Jangan gunakan password yang sama di banyak platform</li>
                <li>• Ganti password secara berkala</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
