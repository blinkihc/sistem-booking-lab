import { useEffect, useState } from 'react'
import { MATA_PELAJARAN } from '../../constants/pemesanan'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Peminjaman {
  id: string
  tanggal: string
  namaGuru: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  keterangan: string
  status: string
  waktuPengajuan: string
}

const TabelPeminjaman = () => {
  const [peminjamanBulanIni, setPeminjamanBulanIni] = useState<Peminjaman[]>([])

  const updatePeminjamanBulanIni = () => {
    const dataTersimpan = localStorage.getItem('pemesananLab')
    if (dataTersimpan) {
      const semuaPeminjaman = JSON.parse(dataTersimpan)
      const tahunBulanIni = format(new Date(), 'yyyy-MM')
      
      // Filter peminjaman yang disetujui dan untuk bulan ini
      const peminjamanDisetujui = semuaPeminjaman.filter(
        (peminjaman: Peminjaman) => 
          peminjaman.tanggal.startsWith(tahunBulanIni) && 
          peminjaman.status === 'disetujui'
      )
      
      // Urutkan berdasarkan tanggal dan jam pelajaran
      const peminjamanTerurut = peminjamanDisetujui.sort((a: Peminjaman, b: Peminjaman) => {
        if (a.tanggal === b.tanggal) {
          return Math.min(...a.jamPelajaran) - Math.min(...b.jamPelajaran)
        }
        return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      })
      
      setPeminjamanBulanIni(peminjamanTerurut)
    }
  }

  useEffect(() => {
    updatePeminjamanBulanIni()
    window.addEventListener('storage', updatePeminjamanBulanIni)
    return () => window.removeEventListener('storage', updatePeminjamanBulanIni)
  }, [])

  const getNamaMapel = (idMapel: string) => {
    const mapel = MATA_PELAJARAN.find(m => m.id === idMapel)
    return mapel ? mapel.nama : idMapel
  }

  // Fungsi format tanggal yang benar menggunakan date-fns
  const formatTanggal = (tanggal: string) => {
    return format(new Date(tanggal), 'd MMMM yyyy', { locale: id })
  }

  // Fungsi untuk mendapatkan nama bulan dan tahun saat ini
  const getBulanTahunSekarang = () => {
    return format(new Date(), 'MMMM yyyy', { locale: id })
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Jadwal Pemakaian Lab Bulan {getBulanTahunSekarang()}
        </h2>
        {peminjamanBulanIni.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Nama Guru</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanBulanIni.map((peminjaman) => (
                  <tr key={peminjaman.id}>
                    <td className="whitespace-nowrap">
                      {formatTanggal(peminjaman.tanggal)}
                    </td>
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
                    <td>{peminjaman.namaGuru}</td>
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
              Belum ada jadwal pemakaian lab untuk bulan ini
            </p>
          </div>
        )}

        {/* Info tambahan */}
        <div className="mt-4 text-sm text-base-content/70">
          <p>* Jadwal akan diperbarui secara otomatis saat ada perubahan</p>
          <p>* Hanya menampilkan peminjaman pemakaian lab yang telah disetujui</p>
        </div>
      </div>
    </div>
  )
}

export default TabelPeminjaman