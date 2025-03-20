import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'

interface User {
  id: string
  username: string
  password: string
  nama: string
  email: string
  role: 'admin' | 'kepala_lab' // Hanya admin dan kepala lab
  active: boolean
  createdAt: string
  lastLogin: string | null
}

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Redirect jika bukan admin
    if (user?.role !== 'admin') {
      toast.error('Anda tidak memiliki akses ke halaman ini')
      window.location.href = '/dashboard'
      return
    }
    loadUsers()
  }, [user])

  const loadUsers = () => {
    try {
      // Ambil data admin dan kepala lab saja
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
        .filter((u: User) => u.role === 'admin' || u.role === 'kepala_lab')
      setUsers(storedUsers)
    } catch (error) {
      toast.error('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const password = formData.get('password') as string
      const konfirmasiPassword = formData.get('konfirmasi_password') as string

      if (!selectedUser && password !== konfirmasiPassword) {
        toast.error('Konfirmasi kata sandi tidak sesuai')
        return
      }

      const userData = {
        id: selectedUser?.id || `user-${Date.now()}`,
        username: formData.get('username') as string,
        password: password || selectedUser?.password,
        nama: formData.get('nama') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'admin' | 'kepala_lab',
        active: formData.get('active') === 'true',
        createdAt: selectedUser?.createdAt || new Date().toISOString(),
        lastLogin: selectedUser?.lastLogin || null
      }

      // Simpan ke localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = selectedUser
        ? allUsers.map((u: User) => u.id === selectedUser.id ? userData : u)
        : [...allUsers, userData]

      localStorage.setItem('users', JSON.stringify(updatedUsers))
      loadUsers() // Muat ulang daftar admin & kepala lab
      setIsModalOpen(false)
      toast.success(`Pengguna berhasil ${selectedUser ? 'diperbarui' : 'ditambahkan'}`)
    } catch (error) {
      toast.error('Gagal menyimpan data pengguna')
    } finally {
      setLoading(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Akun Admin & Kepala Lab</h1>
          <p className="text-base-content/70 mt-1">
            Kelola akun pengguna yang memiliki akses khusus untuk mengelola sistem
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedUser(null)
            setIsModalOpen(true)
          }}
        >
          Tambah Admin/Kepala Lab
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
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
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-primary' : 'badge-secondary'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'Kepala Lab'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
                      {user.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-square btn-sm btn-ghost"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsModalOpen(true)
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full"
                pattern="^[a-zA-Z0-9_-]*$"
                defaultValue={selectedUser?.username}
                required
                placeholder="Contoh: john_doe"
              />
            </div>

            {!selectedUser ? (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Kata Sandi</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input input-bordered w-full"
                    minLength={6}
                    required
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Konfirmasi Kata Sandi</span>
                  </label>
                  <input
                    type="password"
                    name="konfirmasi_password"
                    className="input input-bordered w-full"
                    minLength={6}
                    required
                    placeholder="Masukkan ulang kata sandi"
                  />
                </div>
              </>
            ) : (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kata Sandi Baru (Opsional)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered w-full"
                  minLength={6}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>
            )}

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
                placeholder="Contoh: john@example.com"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Peran</span>
              </label>
              <select
                name="role"
                className="select select-bordered w-full"
                defaultValue={selectedUser?.role || 'kepala_lab'}
                required
              >
                <option value="admin">Administrator</option>
                <option value="kepala_lab">Kepala Lab</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="active"
                className="select select-bordered w-full"
                defaultValue={String(selectedUser?.active ?? true)}
                required
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedUser(null)
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  selectedUser ? 'Perbarui' : 'Simpan'
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default UserManagement