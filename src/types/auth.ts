export type UserRole = 'guru' | 'kepala_lab' | 'admin'

export interface User {
  id: string
  username: string
  nama: string
  email: string
  role: UserRole
  active: boolean
  lastLogin?: string
}

export interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  details: string
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface RolePermission {
  role: UserRole
  permissions: string[]
}

// Definisi izin berdasarkan peran
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  guru: [
    'view:dashboard',
    'create:peminjaman',
    'view:peminjaman_sendiri',
    'edit:peminjaman_sendiri',
  ],
  kepala_lab: [
    'view:dashboard',
    'view:all_peminjaman',
    'approve:peminjaman',
    'reject:peminjaman',
    'view:logs',
    'view:reports',
  ],
  admin: [
    'view:dashboard',
    'view:all_peminjaman',
    'manage:users',
    'manage:roles',
    'view:logs',
    'view:reports',
    'manage:settings',
  ]
}