import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface UserProfile {
  nama: string
  email: string
  noTelp: string
  fakultas: string
  jurusan: string
  role: string
  fotoProfil: string
  bergabungPada: string
}

const Profil = () => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    nama: '',
    email: '',
    noTelp: '',
    fakultas: '',
    jurusan: '',
    role: '',
    fotoProfil: '',
    bergabungPada: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProfile({
          nama: 'Budi Santoso',
          email: 'budi@example.com',
          noTelp: '081234567890',
          fakultas: 'Teknik',
          jurusan: 'Teknik Informatika',
          role: 'Mahasiswa',
          fotoProfil: 'https://placehold.co/200x200/png',
          bergabungPada: '2025-01-01'
        })
      } catch (error) {
        console.error('Gagal memuat profil:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto Profil */}
            <div className="flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={profile.fotoProfil} alt="Foto Profil" />
                </div>
              </div>
              <Link to="/pengaturan" className="btn btn-sm btn-ghost">
                Ubah Foto
              </Link>
            </div>

            {/* Informasi Profil */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{profile.nama}</h2>
              <p className="text-gray-600 mb-4">{profile.role}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Nomor Telepon</label>
                  <p className="font-medium">{profile.noTelp}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Fakultas</label>
                  <p className="font-medium">{profile.fakultas}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Jurusan</label>
                  <p className="font-medium">{profile.jurusan}</p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Bergabung sejak {new Date(profile.bergabungPada).toLocaleDateString('id-ID')}
                </div>
                <Link to="/pengaturan" className="btn btn-primary">
                  Edit Profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil