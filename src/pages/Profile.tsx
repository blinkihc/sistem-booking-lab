import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Profile() {
  const { user, logout, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      toast.error('Gagal keluar dari sistem')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await updateUser({
        nama: formData.get('nama') as string,
        email: formData.get('email') as string
      })
      setIsEditing(false)
    } catch (error) {
      toast.error('Gagal memperbarui profil')
    }
  }

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Silakan masuk terlebih dahulu</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">Profil Pengguna</h2>
            <div className="flex gap-2">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="btn btn-error btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Keluar
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input 
                  type="text"
                  value={user.username}
                  disabled
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text-alt text-info">
                    Username tidak dapat diubah
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
                  defaultValue={user.nama}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Peran</span>
                </label>
                <input 
                  type="text"
                  value={user.role === 'kepala_lab' ? 'Kepala Lab' :
                         user.role === 'admin' ? 'Administrator' : 'Guru'}
                  disabled
                  className="input input-bordered"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium opacity-70">
                    Username
                  </label>
                  <p className="text-lg">{user.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium opacity-70">
                    Nama Lengkap
                  </label>
                  <p className="text-lg">{user.nama}</p>
                </div>

                <div>
                  <label className="text-sm font-medium opacity-70">
                    Email
                  </label>
                  <p className="text-lg">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium opacity-70">
                    Peran
                  </label>
                  <p className="text-lg">
                    {user.role === 'kepala_lab' ? 'Kepala Lab' :
                     user.role === 'admin' ? 'Administrator' : 'Guru'}
                  </p>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <label className="text-sm font-medium opacity-70">
                  Login Terakhir
                </label>
                <p className="text-lg">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString('id-ID')
                    : 'Belum pernah login'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile