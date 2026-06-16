import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../utils/api'
import { Card, Input } from '../../components/ui'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      localStorage.setItem('adminToken', res.token)
      localStorage.setItem('adminUser', JSON.stringify(res.data))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-low p-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-3xl">
            🐑
          </div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">Bodogol Farm Admin</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Masuk ke panel administrasi</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-danger-container px-4 py-3 text-sm text-on-danger-container">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="admin@bodogolfarm.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-on-primary shadow-soft transition-colors hover:bg-primary-container disabled:opacity-50"
          >
            {loading ? 'Masuk…' : 'Masuk ke Admin Panel'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-on-surface-variant">
          Bodogol Farm Management System v1.0
        </p>
      </Card>
    </div>
  )
}
