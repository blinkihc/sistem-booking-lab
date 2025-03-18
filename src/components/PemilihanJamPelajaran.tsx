import { useState } from 'react'
import { JAM_SEKOLAH_CONFIG } from '../config/jamSekolahConfig'

interface PemilihanJamPelajaranProps {
  onChange: (jamTerpilih: number[]) => void
  disabled?: boolean
}

const PemilihanJamPelajaran = ({ onChange, disabled = false }: PemilihanJamPelajaranProps) => {
  const [jamTerpilih, setJamTerpilih] = useState<number[]>([])

  const handlePilihJam = (jamKe: number) => {
    let jamBaru: number[]
    
    if (jamTerpilih.includes(jamKe)) {
      // Hapus jam yang sudah dipilih dan jam-jam setelahnya
      jamBaru = jamTerpilih.filter(j => j <= jamKe)
    } else {
      // Jika belum ada jam yang dipilih atau jam yang dipilih berurutan
      if (jamTerpilih.length === 0 || jamKe === jamTerpilih[jamTerpilih.length - 1] + 1) {
        jamBaru = [...jamTerpilih, jamKe]
        if (jamBaru.length > JAM_SEKOLAH_CONFIG.aturanPemesanan.maxJamPelajaran) {
          alert(`Maksimal pemesanan adalah ${JAM_SEKOLAH_CONFIG.aturanPemesanan.maxJamPelajaran} jam pelajaran`)
          return
        }
      } else {
        // Jika tidak berurutan, tidak diizinkan
        alert('Mohon pilih jam pelajaran secara berurutan')
        return
      }
    }

    setJamTerpilih(jamBaru)
    onChange(jamBaru)
  }

  const isJamDapatDipilih = (jamKe: number): boolean => {
    if (jamTerpilih.length === 0) return true
    if (jamTerpilih.includes(jamKe)) return true
    return jamKe === jamTerpilih[jamTerpilih.length - 1] + 1
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Pilih Jam Pelajaran</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {JAM_SEKOLAH_CONFIG.jamPelajaran.map((jam) => {
            const isSelected = jamTerpilih.includes(jam.ke)
            const dapatDipilih = isJamDapatDipilih(jam.ke)

            return (
              <button
                key={jam.ke}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'} 
                          ${!dapatDipilih ? 'btn-disabled opacity-50' : ''}`}
                onClick={() => handlePilihJam(jam.ke)}
                disabled={disabled || !dapatDipilih}
              >
                <div className="text-center">
                  <div>Jam ke-{jam.ke}</div>
                  <div className="text-xs">{jam.mulai}-{jam.selesai}</div>
                </div>
              </button>
            )
          })}
        </div>

        {jamTerpilih.length > 0 && (
          <div className="mt-4">
            <p className="text-sm">
              Jam terpilih: {JAM_SEKOLAH_CONFIG.fungsi.formatJamPelajaran(jamTerpilih)}
            </p>
          </div>
        )}

        <div className="alert alert-info mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p>Informasi Pemesanan:</p>
            <ul className="list-disc list-inside text-sm">
              <li>Minimal pemesanan: {JAM_SEKOLAH_CONFIG.aturanPemesanan.minJamPelajaran} jam pelajaran</li>
              <li>Maksimal pemesanan: {JAM_SEKOLAH_CONFIG.aturanPemesanan.maxJamPelajaran} jam pelajaran</li>
              <li>Pemesanan harus berurutan (tidak boleh loncat jam)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PemilihanJamPelajaran