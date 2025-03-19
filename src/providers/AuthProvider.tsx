import { useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-toastify'
import AuthContext, { 
  User, 
  LoginCredentials, 
  ROLE_PERMISSIONS 
} from '../contexts/AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    periksaStatusAuth()
  }, [])

  const periksaStatusAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('auth_token')
        toast.error('Sesi Anda telah berakhir, silakan login kembali', {
          className: 'alert alert-error'
        })
      }
    } catch (error) {
      console.error('Gagal memeriksa status autentikasi:', error)
      toast.error('Terjadi kesalahan saat memeriksa status autentikasi', {
        className: 'alert alert-error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const catatAktivitas = async (aksi: string, detail: string) => {
    try {
      const sekarang = new Date().toISOString()
      
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          aksi,
          detail,
          waktu: sekarang,
          pengguna: user?.username || 'sistem'
        })
      })
    } catch (error) {
      console.error('Gagal mencatat aktivitas:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role].includes(permission)
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login gagal')
      }

      const { user: userData, token } = await response.json()
      
      localStorage.setItem('auth_token', token)
      setUser(userData)
      setIsAuthenticated(true)
      
      await catatAktivitas('LOGIN', 'Pengguna berhasil masuk ke sistem')
      
      toast.success('Selamat datang kembali!', {
        className: 'alert alert-success'
      })
    } catch (error) {
      const pesan = error instanceof Error ? error.message : 'Gagal melakukan login'
      toast.error(pesan, {
        className: 'alert alert-error'
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await catatAktivitas('LOGOUT', 'Pengguna keluar dari sistem')
      localStorage.removeItem('auth_token')
      setUser(null)
      setIsAuthenticated(false)
      
      toast.success('Anda telah keluar dari sistem', {
        className: 'alert alert-success'
      })
    } catch (error) {
      console.error('Gagal melakukan logout:', error)
      toast.error('Terjadi kesalahan saat keluar dari sistem', {
        className: 'alert alert-error'
      })
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui data pengguna')
      }

      const updatedUser = await response.json()
      setUser(prev => prev ? { ...prev, ...updatedUser } : null)
      
      toast.success('Data pengguna berhasil diperbarui', {
        className: 'alert alert-success'
      })
    } catch (error) {
      const pesan = error instanceof Error ? error.message : 'Terjadi kesalahan'
      toast.error(pesan, {
        className: 'alert alert-error'
      })
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasPermission,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}