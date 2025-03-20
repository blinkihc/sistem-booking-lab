import { createContext, useContext, useState, ReactNode } from 'react'

type UserRole = 'admin' | 'kepala_lab'

interface UserData {
  username: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: UserData | null
  login: (username: string, password: string) => Promise<UserData>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {
    throw new Error('Login not implemented')
  },
  logout: async () => {
    throw new Error('Logout not implemented')
  }
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      console.error('Failed to load user data:', error)
      return null
    }
  })

  const handleLogin = async (username: string, password: string): Promise<UserData> => {
    try {
      const registeredUsers = {
        admin: {
          username: 'admin',
          password: 'admin123',
          role: 'admin' as const,
          name: 'Administrator'
        },
        kepalaLab: {
          username: 'kepalab',
          password: 'kepalab123',
          role: 'kepala_lab' as const,
          name: 'Kepala Laboratorium'
        }
      }

      if (username === registeredUsers.admin.username && 
          password === registeredUsers.admin.password) {
        const userData = {
          username: registeredUsers.admin.username,
          role: registeredUsers.admin.role,
          name: registeredUsers.admin.name
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return userData
      }

      if (username === registeredUsers.kepalaLab.username && 
          password === registeredUsers.kepalaLab.password) {
        const userData = {
          username: registeredUsers.kepalaLab.username,
          role: registeredUsers.kepalaLab.role,
          name: registeredUsers.kepalaLab.name
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return userData
      }

      throw new Error('Invalid username or password')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const handleLogout = async (): Promise<void> => {
    try {
      setUser(null)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}