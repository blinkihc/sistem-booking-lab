import { useState, useEffect } from 'react'
import { CONFIG } from '../config/appConfig'

interface UserSettings {
  nama: string
  email: string
  noTelp: string
  notifikasi: {
    email: boolean
    pushNotification: boolean
    reminder: boolean
  }
  bahasa: 'id' | 'en'
  tema: 'light' | 'dark'
}

const Pengaturan = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    nama: '',
    email: '',
    noTelp: '',
    notifikasi: {
      email: true,
      pushNotification: true,
      reminder: true
    },
    bahasa: 'id',
    tema: 'light'
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setSettings({
          nama: 'Budi Santoso',
          email: 'budi@example.com',
          noTelp: '081234567890',
          notifikasi: {
            email: true,
            pushNotification: true,
            reminder: true
          },
          bahasa: 'id',
          tema: 'light'
        })
      } catch (error) {
        console.error('Gagal mengambil pengaturan:', error)
        alert('Terjadi kesalahan saat mengambil pengaturan')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulasi menyimpan ke server
      console.log('Menyimpan pengaturan:', settings)
      alert('Pengaturan berhasil disimpan')
    } catch (error) {
      console.error('Gagal menyimpan pengaturan:', error)
      alert('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-gray-600">
          Kelola pengaturan akun dan preferensi Anda
        </p>
      </div>

      <div className="space-y-8">
        {/* Profil */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Informasi Profil</h3>
            
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Nama Lengkap</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={settings.nama}
                  onChange={(e) => setSettings({...settings, nama: e.target.value})}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered w-full" 
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Nomor Telepon</span>
                </label>
                <input 
                  type="tel" 
                  className="input input-bordered w-full" 
                  value={settings.noTelp}
                  onChange={(e) => setSettings({...settings, noTelp: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Pengaturan Notifikasi</h3>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={settings.notifikasi.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifikasi: {
                        ...settings.notifikasi,
                        email: e.target.checked
                      }
                    })}
                  />
                  <span className="label-text">Notifikasi Email</span>
                </label>
                <p className="text-sm text-gray-500 ml-16">
                  Terima pemberitahuan melalui email
                </p>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={settings.notifikasi.pushNotification}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifikasi: {
                        ...settings.notifikasi,
                        pushNotification: e.target.checked
                      }
                    })}
                  />
                  <span className="label-text">Notifikasi Push</span>
                </label>
                <p className="text-sm text-gray-500 ml-16">
                  Terima pemberitahuan langsung di browser
                </p>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={settings.notifikasi.reminder}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifikasi: {
                        ...settings.notifikasi,
                        reminder: e.target.checked
                      }
                    })}
                  />
                  <span className="label-text">Pengingat</span>
                </label>
                <p className="text-sm text-gray-500 ml-16">
                  Terima pengingat sebelum jadwal pemesanan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferensi */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Preferensi</h3>
            
            <div className="space-y-4">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Bahasa</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={settings.bahasa}
                  onChange={(e) => setSettings({
                    ...settings,
                    bahasa: e.target.value as 'id' | 'en'
                  })}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Tema</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={settings.tema}
                  onChange={(e) => setSettings({
                    ...settings,
                    tema: e.target.value as 'light' | 'dark'
                  })}
                >
                  <option value="light">Terang</option>
                  <option value="dark">Gelap</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end gap-4">
          <button 
            className="btn btn-ghost"
            onClick={() => window.location.reload()}
          >
            Batal
          </button>
          <button 
            className={`btn btn-primary ${saving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Informasi */}
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Catatan</h3>
          <div className="text-sm">
            Perubahan pengaturan akan langsung diterapkan setelah disimpan.
            Beberapa fitur mungkin memerlukan refresh halaman.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pengaturan