import { createContext } from 'react'

// Tipe data untuk peran pengguna
export type UserRole = 'guru' | 'kepala_lab' | 'admin'

// Interface untuk data pengguna
export interface User {
  id: string
  username: string
  nama: string
  email: string
  role: UserRole
  active: boolean
  lastLogin?: string
}

// Interface untuk kredensial login
export interface LoginCredentials {
  username: string
  password: string
}

// Interface untuk context autentikasi
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

// Daftar izin untuk setiap peran
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'manage:users',        // Mengelola pengguna
    'approve:peminjaman',  // Menyetujui peminjaman
    'view:logs',          // Melihat log aktivitas
    'manage:lab',         // Mengelola laboratorium
    'manage:settings'     // Mengelola pengaturan
  ],
  kepala_lab: [
    'approve:peminjaman',  // Menyetujui peminjaman
    'view:reports',       // Melihat laporan
    'manage:lab',         // Mengelola laboratorium
    'view:logs'          // Melihat log aktivitas
  ],
  guru: [
    'create:peminjaman',          // Membuat peminjaman
    'view:peminjaman_sendiri',    // Melihat peminjaman sendiri
    'view:jadwal'                 // Melihat jadwal
  ]
}

// Membuat context dengan nilai default null
const AuthContext = createContext<AuthContextType | null>(null)

export default AuthContext