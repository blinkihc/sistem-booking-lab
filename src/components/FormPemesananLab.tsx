import { useState } from 'react'
import { useWaktu } from '../contexts/WaktuContext'

interface JamPelajaran {
  ke: number
  label: string
}

const JAM_PELAJARAN: JamPelajaran[] = [
  { ke: 1, label: 'Jam ke-1' },
  { ke: 2, label: 'Jam ke-2' },
  { ke: 3, label: 'Jam ke-3' },
  { ke: 4, label: 'Jam ke-4' },
  { ke: 5, label: 'Jam ke-5' },
  { ke: 6, label: 'Jam ke-6' },
  { ke: 7, label: 'Jam ke-7' }
]

const FormPemesananLab = () => {
  const { formatTanggal } = useWaktu()
  const [jamTerpilih, setJamTerpilih] = useState<number[]>([])
  const [tanggal, setTanggal] = useState('')
  const [keterangan, setKeterangan] = useState('')
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
        if (jamBaru.length > 4) { // Maksimal 4 jam pelajaran
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

  const isJamDapatDipilih = (jamKe: number): boolean => {
    if (jamTerpilih.length === 0) return true
    if (jamTerpilih.includes(jamKe)) return true
    return jamKe === jamTerpilih[jamTerpilih.length - 1] + 1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (jamTerpilih.length === 0) {
      alert('Mohon pilih jam pelajaran')
      return
    }

    setLoading(true)
    try {
      // Simulasi pengiriman data
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log({
        tanggal,
        jamPelajaran: jamTerpilih,
        keterangan
      })
      alert('Pemesanan berhasil diajukan!')
      // Reset form
      setJamTerpilih([])
      setTanggal('')
      setKeterangan('')
    } catch (error) {
      alert('Terjadi kesalahan saat mengajukan pemesanan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Form Pemesanan Laboratorium</h2>

            {/* Tanggal Pemesanan */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Pemesanan</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered" 
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
              {tanggal && (
                <label className="label">
                  <span className="label-text-alt">{formatTanggal(new Date(tanggal))}</span>
                </label>
              )}
            </div>

            {/* Pemilihan Jam Pelajaran */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pilih Jam Pelajaran</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {JAM_PELAJARAN.map((jam) => {
                  const isSelected = jamTerpilih.includes(jam.ke)
                  const dapatDipilih = isJamDapatDipilih(jam.ke)

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
                <label className="label">
                  <span className="label-text-alt">
                    Jam terpilih: {jamTerpilih.map(j => `Jam ke-${j}`).join(', ')}
                  </span>
                </label>
              )}
            </div>

            {/* Keterangan */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Keterangan Penggunaan</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Praktikum TIK Kelas 7A"
                required
              ></textarea>
            </div>

            {/* Informasi */}
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-semibold">Ketentuan Pemesanan:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Minimal pemesanan 1 jam pelajaran</li>
                  <li>Maksimal pemesanan 4 jam pelajaran</li>
                  <li>Pemilihan jam harus berurutan</li>
                </ul>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="card-actions justify-end mt-4">
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