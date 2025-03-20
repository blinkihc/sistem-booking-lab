import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'


interface FormData {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth() // Rename untuk menghindari konflik
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Pastikan fungsi login dari useAuth mengembalikan Promise<UserData>
      const userData = await authLogin(formData.username, formData.password)
      
      switch(userData.role) {
        case 'admin':
          navigate('/admin/dashboard')
          toast.success('Selamat datang di Dashboard Admin')
          break
        case 'kepala_lab':
          navigate('/kepala-lab/dashboard')
          toast.success('Selamat datang di Dashboard Kepala Lab')
          break
        default:
          navigate('/dashboard')
          toast.success('Selamat datang di Dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
            Masuk ke Sistem Lab
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Masukkan username"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login