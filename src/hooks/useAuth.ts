import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import type { AuthContextType } from '../contexts/AuthContext'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}