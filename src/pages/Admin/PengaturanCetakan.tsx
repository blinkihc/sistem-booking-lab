import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../components/Header'

interface PengaturanCetakanData {
  logoSekolah: string
  namaSekolah: string
  alamatSekolah: string
  teleponSekolah: string
  namaKepalaLab: string
  nipKepalaLab: string
  namaKepalaSekolah: string
  nipKepalaSekolah: string
}

const PengaturanCetakan = () => {
  const [pengaturan, setPengaturan] = useState<PengaturanCetakanData>({
    logoSekolah: '',
    namaSekolah: '',
    alamatSekolah: '',
    teleponSekolah: '',
    namaKepalaLab: '',
    nipKepalaLab: '',
    namaKepalaSekolah: '',
    nipKepalaSekolah: ''
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('pengaturanCetakan')
    if (savedSettings) {
      setPengaturan(JSON.parse(savedSettings))
    }
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPengaturan(prev => ({
          ...prev,
          logoSekolah: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSimpan = () => {
    try {
      localStorage.setItem('pengaturanCetakan', JSON.stringify(pengaturan))
      toast.success('Pengaturan berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li>Pengaturan Cetakan</li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6">Pengaturan Cetakan PDF</h2>
            
            {/* Upload Logo */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Logo Sekolah</span>
              </label>
              <input 
                type="file" 
                className="file-input file-input-bordered w-full max-w-xs"
                accept="image/*"
                onChange={handleLogoChange}
              />
              {pengaturan.logoSekolah && (
                <div className="mt-4">
                  <label className="label">
                    <span className="label-text font-medium">Preview Logo</span>
                  </label>
                  <img 
                    src={pengaturan.logoSekolah} 
                    alt="Logo Sekolah" 
                    className="w-32 h-32 object-contain border rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Informasi Sekolah */}
            <div className="form-control mb-6">
              <h3 className="font-medium mb-4">Informasi Sekolah</h3>
              <div className="grid gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Nama Sekolah</span>
                  </label>
                  <input 
                    type="text"
                    className="input input-bordered w-full"
                    value={pengaturan.namaSekolah}
                    onChange={(e) => setPengaturan(prev => ({
                      ...prev,
                      namaSekolah: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Alamat Sekolah</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full"
                    value={pengaturan.alamatSekolah}
                    onChange={(e) => setPengaturan(prev => ({
                      ...prev,
                      alamatSekolah: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Nomor Telepon</span>
                  </label>
                  <input 
                    type="tel"
                    className="input input-bordered w-full"
                    value={pengaturan.teleponSekolah}
                    onChange={(e) => setPengaturan(prev => ({
                      ...prev,
                      teleponSekolah: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Informasi Pejabat */}
            <div className="form-control mb-6">
              <h3 className="font-medium mb-4">Informasi Pejabat</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Kepala Lab */}
                <div className="space-y-4">
                  <h4 className="font-medium">Kepala Laboratorium</h4>
                  <div>
                    <label className="label">
                      <span className="label-text">Nama Lengkap</span>
                    </label>
                    <input 
                      type="text"
                      className="input input-bordered w-full"
                      value={pengaturan.namaKepalaLab}
                      onChange={(e) => setPengaturan(prev => ({
                        ...prev,
                        namaKepalaLab: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">NIP</span>
                    </label>
                    <input 
                      type="text"
                      className="input input-bordered w-full"
                      value={pengaturan.nipKepalaLab}
                      onChange={(e) => setPengaturan(prev => ({
                        ...prev,
                        nipKepalaLab: e.target.value
                      }))}
                    />
                  </div>
                </div>

                {/* Kepala Sekolah */}
                <div className="space-y-4">
                  <h4 className="font-medium">Kepala Sekolah</h4>
                  <div>
                    <label className="label">
                      <span className="label-text">Nama Lengkap</span>
                    </label>
                    <input 
                      type="text"
                      className="input input-bordered w-full"
                      value={pengaturan.namaKepalaSekolah}
                      onChange={(e) => setPengaturan(prev => ({
                        ...prev,
                        namaKepalaSekolah: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">NIP</span>
                    </label>
                    <input 
                      type="text"
                      className="input input-bordered w-full"
                      value={pengaturan.nipKepalaSekolah}
                      onChange={(e) => setPengaturan(prev => ({
                        ...prev,
                        nipKepalaSekolah: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions justify-end">
              <Link to="/admin/dashboard" className="btn btn-ghost">Batal</Link>
              <button 
                className="btn btn-primary"
                onClick={handleSimpan}
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PengaturanCetakan