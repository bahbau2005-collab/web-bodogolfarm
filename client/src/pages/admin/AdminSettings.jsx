import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, Input } from '../../components/ui'
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
        body: JSON.stringify(profile),
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
      setPwMsg('Error: Password baru tidak cocok!')
      return
    }
    setPwLoading(true)
    try {
      await apiFetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      setPwMsg('Password berhasil diperbarui!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMsg('Error: ' + err.message)
    } finally {
      setPwLoading(false)
    }
  }

  const Msg = ({ text }) =>
    text ? (
      <p className={`mb-4 rounded-lg px-4 py-3 text-sm ${text.startsWith('Error') ? 'bg-danger-container text-on-danger-container' : 'bg-success-container text-on-success-container'}`}>
        {text}
      </p>
    ) : null

  return (
    <AdminLayout title="Pengaturan">
      <div className="max-w-2xl space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-on-surface">Pengaturan Akun</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Kelola profil dan keamanan akun admin.</p>
        </div>

        <div className="flex w-fit gap-1 rounded-lg bg-surface-container p-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === i ? 'bg-surface-lowest text-on-surface shadow-soft' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <Card>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/40 text-2xl">👤</div>
              <div>
                <p className="font-heading font-bold text-on-surface">{user.name}</p>
                <p className="text-sm capitalize text-on-surface-variant">{user.role}</p>
              </div>
            </div>
            <Msg text={profileMsg} />
            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input label="Nama Lengkap" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label="Role" value={user.role || ''} disabled />
              <button type="submit" disabled={profileLoading} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-50">
                {profileLoading ? 'Menyimpan…' : 'Simpan Perubahan'}
              </button>
            </form>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <h3 className="font-heading text-lg font-semibold text-on-surface">Ubah Password</h3>
            <div className="mt-4">
              <Msg text={pwMsg} />
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <Input label="Password Saat Ini" type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                <Input label="Password Baru" type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                <Input label="Konfirmasi Password Baru" type="password" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                <button type="submit" disabled={pwLoading} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-50">
                  {pwLoading ? 'Memperbarui…' : 'Perbarui Password'}
                </button>
              </form>
            </div>
            <div className="mt-6 border-t border-outline-variant/60 pt-6">
              <h4 className="text-sm font-semibold text-on-surface">Tips Keamanan</h4>
              <ul className="mt-2 space-y-1 text-xs text-on-surface-variant">
                <li>• Gunakan password minimal 8 karakter</li>
                <li>• Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                <li>• Jangan pakai password yang sama di banyak platform</li>
                <li>• Ganti password secara berkala</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
