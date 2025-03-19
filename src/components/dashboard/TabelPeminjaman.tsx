import { useEffect, useState } from 'react'
import { MATA_PELAJARAN } from '../../constants/pemesanan'

interface Peminjaman {
  id: string
  tanggal: string
  pengajar: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  keterangan: string
  status: string
  waktuPengajuan: string
}

const TabelPeminjaman = () => {
  const [peminjamanHariIni, setPeminjamanHariIni] = useState<Peminjaman[]>([])

  const updatePeminjamanHariIni = () => {
    const dataTersimpan = localStorage.getItem('pemesananLab')
    if (dataTersimpan) {
      const semuaPeminjaman = JSON.parse(dataTersimpan)
      const tanggalHariIni = new Date().toLocaleDateString('en-CA')
      
      // Filter peminjaman yang disetujui dan untuk hari ini
      const peminjamanDisetujui = semuaPeminjaman.filter(
        (peminjaman: Peminjaman) => 
          peminjaman.tanggal === tanggalHariIni && 
          peminjaman.status === 'disetujui'
      )
      
      // Urutkan berdasarkan jam pelajaran
      const peminjamanTerurut = peminjamanDisetujui.sort((a: Peminjaman, b: Peminjaman) => 
        Math.min(...a.jamPelajaran) - Math.min(...b.jamPelajaran)
      )
      
      setPeminjamanHariIni(peminjamanTerurut)
    }
  }

  useEffect(() => {
    updatePeminjamanHariIni()
    window.addEventListener('storage', updatePeminjamanHariIni)
    return () => window.removeEventListener('storage', updatePeminjamanHariIni)
  }, [])

  const getNamaMapel = (idMapel: string) => {
    const mapel = MATA_PELAJARAN.find(m => m.id === idMapel)
    return mapel ? mapel.nama : idMapel
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Jadwal Peminjaman Hari Ini</h2>
        {peminjamanHariIni.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Jam</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Pengajar</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanHariIni.map((peminjaman) => (
                  <tr key={peminjaman.id}>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {peminjaman.jamPelajaran.map(jam => (
                          <span key={jam} className="badge badge-primary badge-sm">
                            Jam ke-{jam}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{peminjaman.kelas}</span>
                    </td>
                    <td>{getNamaMapel(peminjaman.mataPelajaran)}</td>
                    <td>{peminjaman.pengajar}</td>
                    <td>
                      <span className="text-sm">{peminjaman.keterangan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-base-content/70">
              Belum ada peminjaman yang disetujui untuk hari ini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TabelPeminjaman