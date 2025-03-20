import { createContext, useContext, useState } from 'react'

interface User {
  username: string
  role: 'admin' | 'kepala_lab' | 'guru'
  nama: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = async (username: string, password: string): Promise<User> => {
    // Simulasi login - ganti dengan API call sesuai kebutuhan
    if (username === 'admin' && password === 'admin123') {
      const userData: User = {
        username: 'admin',
        role: 'admin',
        nama: 'Administrator'
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } else if (username === 'kepalab' && password === 'kepalab123') {
      const userData: User = {
        username: 'kepalab',
        role: 'kepala_lab',
        nama: 'Kepala Laboratorium'
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    }
    throw new Error('Username atau password salah')
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}