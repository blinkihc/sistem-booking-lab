import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const JAM_PELAJARAN = [
  { ke: 1, label: 'Jam ke-1' },
  { ke: 2, label: 'Jam ke-2' },
  { ke: 3, label: 'Jam ke-3' },
  { ke: 4, label: 'Jam ke-4' },
  { ke: 5, label: 'Jam ke-5' },
  { ke: 6, label: 'Jam ke-6' },
  { ke: 7, label: 'Jam ke-7' }
]

const MATA_PELAJARAN = [
  { id: 'tik', nama: 'Teknologi Informasi dan Komunikasi' },
  { id: 'ipa', nama: 'Ilmu Pengetahuan Alam' },
  { id: 'mtk', nama: 'Matematika' },
  { id: 'ips', nama: 'Ilmu Pengetahuan Sosial' },
  { id: 'pai', nama: 'Pendidikan Agama dan Budi Pekerti' },
  { id: 'pra', nama: 'Prakarya' }
]

const DAFTAR_KELAS = [
  '7.1', '7.2', '7.3', '7.4', '7.5',
  '8.1', '8.2', '8.3', '8.4','8.5',
  '9.1', '9.2', '9.3', '9.4', '9.5'
]

const FormPemesananLab = () => {
  const navigate = useNavigate()
  const [jamTerpilih, setJamTerpilih] = useState<number[]>([])
  const [formData, setFormData] = useState({
    tanggal: '',
    keterangan: '',
    kelas: '',
    mataPelajaran: ''
  })
  const [loading, setLoading] = useState(false)

  const handlePilihJam = (jamKe: number) => {
    let jamBaru: number[]
    
    if (jamTerpilih.includes(jamKe)) {
      // Hapus jam yang dipilih dan jam setelahnya
      jamBaru = jamTerpilih.filter(j => j <= jamKe)
    } else {
      // Tambah jam baru jika berurutan
      if (jamTerpilih.length === 0 || jamKe === jamTerpilih[jamTerpilih.length - 1] + 1) {
        jamBaru = [...jamTerpilih, jamKe]
        if (jamBaru.length > 4) {
          alert('Maksimal pemesanan adalah 4 jam pelajaran')
          return
        }
      } else {
        alert('Mohon pilih jam pelajaran secara berurutan')
        return
      }
    }
    
    setJamTerpilih(jamBaru)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (jamTerpilih.length === 0) {
      alert('Mohon pilih jam pelajaran')
      return
    }

    setLoading(true)
    try {
      // Simulasi pengiriman data ke API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dataPemesanan = {
        ...formData,
        jamPelajaran: jamTerpilih,
        pemohon: 'blinkihc',
        tanggalPengajuan: new Date().toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta'
        })
      }
      
      console.log('Data Pemesanan:', dataPemesanan)
      alert('Pemesanan berhasil diajukan!')
      navigate('/riwayat')
    } catch (error) {
      alert('Terjadi kesalahan saat mengajukan pemesanan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Form Pemesanan Laboratorium</h1>
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
        >
          Kembali
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            {/* Informasi Pemohon */}
            <div className="alert alert-info">
              <div>
                <p className="font-semibold">Informasi Pemohon:</p>
                <p className="text-sm">Nama Pengajar: blinkihc</p>
                <p className="text-sm">
                  Waktu Pengajuan: {new Date().toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta'
                  })}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal Penggunaan</span>
                </label>
                <input 
                  type="date" 
                  name="tanggal"
                  className="input input-bordered" 
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mata Pelajaran</span>
                </label>
                <select 
                  name="mataPelajaran"
                  className="select select-bordered"
                  value={formData.mataPelajaran}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {MATA_PELAJARAN.map(mapel => (
                    <option key={mapel.id} value={mapel.id}>
                      {mapel.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kelas</span>
                </label>
                <select 
                  name="kelas"
                  className="select select-bordered"
                  value={formData.kelas}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {DAFTAR_KELAS.map(kelas => (
                    <option key={kelas} value={kelas}>
                      Kelas {kelas}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pemilihan Jam */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Pilih Jam Pelajaran</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {JAM_PELAJARAN.map((jam) => {
                  const isSelected = jamTerpilih.includes(jam.ke)
                  const dapatDipilih = jamTerpilih.length === 0 || 
                                     jamTerpilih.includes(jam.ke) || 
                                     jam.ke === jamTerpilih[jamTerpilih.length - 1] + 1

                  return (
                    <button
                      key={jam.ke}
                      type="button"
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'} 
                                ${!dapatDipilih ? 'btn-disabled opacity-50' : ''}`}
                      onClick={() => handlePilihJam(jam.ke)}
                      disabled={!dapatDipilih}
                    >
                      {jam.label}
                    </button>
                  )
                })}
              </div>
              {jamTerpilih.length > 0 && (
                <div className="text-sm mt-2">
                  Jam terpilih: {jamTerpilih.map(j => `Jam ke-${j}`).join(', ')}
                </div>
              )}
            </div>

            {/* Keterangan */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Keterangan Kegiatan</span>
              </label>
              <textarea 
                name="keterangan"
                className="textarea textarea-bordered h-24" 
                placeholder="Contoh: Praktikum Komputer - Materi Microsoft Excel"
                value={formData.keterangan}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Informasi */}
            <div className="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-semibold">Ketentuan Pemesanan:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Minimal pemesanan 1 jam pelajaran</li>
                  <li>Maksimal pemesanan 4 jam pelajaran</li>
                  <li>Pemilihan jam harus berurutan</li>
                  <li>Pemesanan dapat dibatalkan maksimal 1 hari sebelumnya</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || jamTerpilih.length === 0}
              >
                {loading ? 'Memproses...' : 'Ajukan Pemesanan'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormPemesananLab