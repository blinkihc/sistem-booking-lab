import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { PemesananLab, ambilSemuaPemesanan } from '../utils/pemesanan'
import { MATA_PELAJARAN } from '../constants/pemesanan'

const RiwayatPemesanan = () => {
  const [riwayat, setRiwayat] = useState<PemesananLab[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Muat data awal
    muatDataRiwayat()

    // Set up event listener untuk perubahan localStorage
    window.addEventListener('storage', muatDataRiwayat)

    return () => {
      window.removeEventListener('storage', muatDataRiwayat)
    }
  }, [])

  const muatDataRiwayat = () => {
    setRiwayat(ambilSemuaPemesanan())
    setLoading(false)
  }

  const getNamaMapel = (idMapel: string) => {
    const mapel = MATA_PELAJARAN.find(m => m.id === idMapel)
    return mapel ? mapel.nama : idMapel
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Riwayat Pemesanan Lab</h1>
          <div className="flex gap-2">
            <Link to="/" className="btn btn-ghost btn-sm">
              Kembali ke Dashboard
            </Link>
            <Link to="/form-pemesanan" className="btn btn-primary btn-sm">
              Ajukan Pemesanan
            </Link>
          </div>
        </div>

        {riwayat.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="card-title mb-2">Belum Ada Riwayat Pemesanan</h2>
              <p className="text-base-content/70 mb-4">
                Silakan ajukan pemesanan laboratorium terlebih dahulu
              </p>
              <Link to="/pemesanan/baru" className="btn btn-primary">
                Ajukan Pemesanan
              </Link>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Kelas</th>
                      <th>Mata Pelajaran</th>
                      <th>Jam</th>
                      <th>Pengajar</th>
                      <th>Status</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayat.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{format(new Date(item.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })}</td>
                        <td>{item.kelas}</td>
                        <td>{getNamaMapel(item.mataPelajaran)}</td>
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {item.jamPelajaran.map((jam) => (
                              <span key={jam} className="badge badge-sm">
                                Jam ke-{jam}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>{item.pengajar}</td>
                        <td>
                          <div className={`badge ${
                            item.status === 'disetujui' ? 'badge-success' :
                            item.status === 'ditolak' ? 'badge-error' :
                            'badge-warning'
                          } gap-1`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {item.status}
                          </div>
                        </td>
                        <td>{item.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiwayatPemesanan