import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { exportToExcel, formatDateForExport } from '../../utils/exportData'
import { useAuth } from '../../hooks/useAuth'

interface User {
  id: string
  username: string
  nama: string
  email: string
  role: 'guru' | 'kepala_lab' | 'admin'
  active: boolean
  lastLogin?: string
}

const UserManagement = () => {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  // Memindahkan fetchUsers ke useCallback
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Gagal mengambil data')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast.error('Gagal memuat data pengguna')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filter dan pencarian pengguna
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery.toLowerCase() === '' 
      ? true 
      : user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === 'all' ? true : user.role === filterRole

    return matchesSearch && matchesRole
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const userData = {
        username: formData.get('username'),
        nama: formData.get('nama'),
        email: formData.get('email'),
        role: formData.get('role'),
        password: formData.get('password'),
      }

      const response = await fetch('/api/users', {
        method: selectedUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) throw new Error('Gagal menyimpan data')

      toast.success(
        selectedUser 
          ? 'Pengguna berhasil diperbarui' 
          : 'Pengguna baru berhasil ditambahkan'
      )
      fetchUsers()
      setShowForm(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data')
      console.error(error)
    }
  }

  const toggleUserStatus = async (userId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      })

      if (!response.ok) throw new Error('Gagal mengubah status')

      toast.success(
        active 
          ? 'Pengguna berhasil diaktifkan' 
          : 'Pengguna berhasil dinonaktifkan'
      )
      fetchUsers()
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah status')
      console.error(error)
    }
  }

  const handleExport = useCallback(() => {
    try {
      const dataToExport = filteredUsers.map(user => ({
        'Username': user.username,
        'Nama Lengkap': user.nama,
        'Email': user.email,
        'Peran': user.role === 'kepala_lab' ? 'Kepala Lab' :
                 user.role === 'admin' ? 'Admin' : 'Guru',
        'Status': user.active ? 'Aktif' : 'Nonaktif',
        'Login Terakhir': user.lastLogin ? formatDateForExport(user.lastLogin) : '-'
      }))

      const filename = `Daftar_Pengguna_${new Date().toISOString().split('T')[0]}`
      exportToExcel(dataToExport, {
        filename,
        sheetName: 'Data Pengguna'
      })

      toast.success('Data berhasil diekspor ke Excel')
    } catch (error) {
      toast.error('Gagal mengekspor data')
      console.error(error)
    }
  }, [filteredUsers])

  if (!hasPermission('manage:users')) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 stroke-current text-error">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Akses Ditolak</h3>
          <p className="text-base-content/70">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="card-title text-2xl">Manajemen Pengguna</h2>
            
            {/* Pencarian dan Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="join">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  className="input input-bordered join-item"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="select select-bordered join-item"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">Semua Peran</option>
                  <option value="guru">Guru</option>
                  <option value="kepala_lab">Kepala Lab</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Tambah Pengguna
              </button>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Ekspor
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={handleExport}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5" />
                      </svg>
                      Ekspor ke Excel
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || filterRole !== 'all' 
                  ? 'Tidak ada pengguna yang sesuai dengan kriteria pencarian'
                  : 'Belum ada pengguna'}
              </h3>
              <p className="text-base-content/70">
                {searchQuery || filterRole !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Klik tombol "Tambah Pengguna" untuk menambahkan pengguna baru'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Peran</th>
                    <th>Status</th>
                    <th>Login Terakhir</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.nama}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'admin' ? 'badge-primary' :
                          user.role === 'kepala_lab' ? 'badge-secondary' :
                          'badge-ghost'
                        }`}>
                          {user.role === 'kepala_lab' ? 'Kepala Lab' :
                           user.role === 'admin' ? 'Admin' : 'Guru'}
                        </span>
                      </td>
                      <td>
                        <div className="form-control">
                          <input
                            type="checkbox"
                            className="toggle toggle-success toggle-sm"
                            checked={user.active}
                            onChange={() => toggleUserStatus(user.id, !user.active)}
                          />
                        </div>
                      </td>
                      <td className="text-sm">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleString('id-ID')
                          : '-'
                        }
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowForm(true)
                          }}
                          className="btn btn-ghost btn-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Pengguna */}
      <dialog id="modal_user" className={`modal ${showForm ? 'modal-open' : ''}`}>
        <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">
            {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h3>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="text"
                name="username"
                className="input input-bordered w-full"
                defaultValue={selectedUser?.username}
                required
                placeholder="Masukkan username"
                disabled={!!selectedUser}
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_-]+"
                title="Username hanya boleh mengandung huruf, angka, underscore, dan strip"
              />
              <label className="label">
                <span className="label-text-alt text-info">
                  3-20 karakter (huruf, angka, _, -)
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input 
                type="text"
                name="nama"
                className="input input-bordered w-full"
                defaultValue={selectedUser?.nama}
                required
                placeholder="Masukkan nama lengkap"
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email"
                name="email"
                className="input input-bordered w-full"
                defaultValue={selectedUser?.email}
                required
                placeholder="Masukkan alamat email"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Peran</span>
              </label>
              <select 
                name="role"
                className="select select-bordered w-full"
                defaultValue={selectedUser?.role || 'guru'}
                required
              >
                <option value="guru">Guru</option>
                <option value="kepala_lab">Kepala Laboratorium</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {!selectedUser && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="join w-full">
                  <input 
                    type="password"
                    name="password"
                    className="input input-bordered join-item flex-1"
                    required={!selectedUser}
                    placeholder="Masukkan password"
                    minLength={6}
                    maxLength={32}
                  />
                  <button 
                    type="button"
                    className="btn join-item"
                    onClick={() => {
                      const input = document.querySelector('input[name="password"]') as HTMLInputElement
                      input.type = input.type === 'password' ? 'text' : 'password'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt text-info">
                    Minimal 6 karakter
                  </span>
                </label>
              </div>
            )}

            {selectedUser && (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span>
                  Untuk mengubah password, silakan gunakan fitur "Reset Password" yang terpisah.
                </span>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setShowForm(false)
                setSelectedUser(null)
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {selectedUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </dialog>

      {/* Status Info */}
      <div className="toast toast-end">
        {loading && (
          <div className="alert alert-info">
            <span>Memuat data...</span>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Pengguna</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-desc">
              {users.filter(u => u.active).length} Aktif
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Kepala Lab</div>
            <div className="stat-value text-secondary">
              {users.filter(u => u.role === 'kepala_lab').length}
            </div>
            <div className="stat-desc">
              {users.filter(u => u.role === 'kepala_lab' && u.active).length} Aktif
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Guru</div>
            <div className="stat-value text-primary">
              {users.filter(u => u.role === 'guru').length}
            </div>
            <div className="stat-desc">
              {users.filter(u => u.role === 'guru' && u.active).length} Aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement