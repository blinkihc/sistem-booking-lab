import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CONFIG } from '../config/appConfig'

interface RiwayatPemesanan {
  id: string
  namaKegiatan: string
  laboratorium: string
  tanggal: string
  waktuMulai: string
  waktuSelesai: string
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'selesai'
  createdAt: string
}

const RiwayatPemesanan = () => {
  const [loading, setLoading] = useState(true)
  const [riwayat, setRiwayat] = useState<RiwayatPemesanan[]>([])
  const [filter, setFilter] = useState('semua')

  useEffect(() => {
    // Simulasi mengambil data dari server
    const fetchRiwayat = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setRiwayat([
          {
            id: 'PMN-001',
            namaKegiatan: 'Praktikum Pemrograman Web',
            laboratorium: 'Lab Komputer A1',
            tanggal: '2025-03-18',
            waktuMulai: '09:00',
            waktuSelesai: '12:00',
            status: 'selesai',
            createdAt: '2025-03-15 10:00:00'
          },
          {
            id: 'PMN-002',
            namaKegiatan: 'Praktikum Basis Data',
            laboratorium: 'Lab Komputer A2',
            tanggal: '2025-03-19',
            waktuMulai: '13:00',
            waktuSelesai: '15:00',
            status: 'menunggu',
            createdAt: '2025-03-17 14:30:00'
          },
          {
            id: 'PMN-003',
            namaKegiatan: 'Praktikum Jaringan Komputer',
            laboratorium: 'Lab Komputer B1',
            tanggal: '2025-03-20',
            waktuMulai: '10:00',
            waktuSelesai: '13:00',
            status: 'disetujui',
            createdAt: '2025-03-18 09:15:00'
          }
        ])
      } catch (error) {
        console.error('Gagal mengambil data riwayat:', error)
        alert('Terjadi kesalahan saat mengambil data riwayat')
      } finally {
        setLoading(false)
      }
    }

    fetchRiwayat()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return <span className="badge badge-warning">Menunggu</span>
      case 'disetujui':
        return <span className="badge badge-success">Disetujui</span>
      case 'ditolak':
        return <span className="badge badge-error">Ditolak</span>
      case 'selesai':
        return <span className="badge badge-neutral">Selesai</span>
      default:
        return <span className="badge">-</span>
    }
  }

  const filteredRiwayat = riwayat.filter(item => {
    if (filter === 'semua') return true
    return item.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Riwayat Pemesanan</h2>
          <p className="text-gray-600">
            Menampilkan riwayat pemesanan laboratorium Anda
          </p>
        </div>
        <Link to="/pemesanan/baru" className="btn btn-primary">
          Buat Pemesanan Baru
        </Link>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button 
          className={`btn btn-sm ${filter === 'semua' ? 'btn-active' : 'btn-ghost'}`}
          onClick={() => setFilter('semua')}
        >
          Semua
        </button>
        <button 
          className={`btn btn-sm ${filter === 'menunggu' ? 'btn-warning' : 'btn-ghost'}`}
          onClick={() => setFilter('menunggu')}
        >
          Menunggu
        </button>
        <button 
          className={`btn btn-sm ${filter === 'disetujui' ? 'btn-success' : 'btn-ghost'}`}
          onClick={() => setFilter('disetujui')}
        >
          Disetujui
        </button>
        <button 
          className={`btn btn-sm ${filter === 'ditolak' ? 'btn-error' : 'btn-ghost'}`}
          onClick={() => setFilter('ditolak')}
        >
          Ditolak
        </button>
        <button 
          className={`btn btn-sm ${filter === 'selesai' ? 'btn-neutral' : 'btn-ghost'}`}
          onClick={() => setFilter('selesai')}
        >
          Selesai
        </button>
      </div>

      {/* Tabel Riwayat */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredRiwayat.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="font-semibold text-lg">Tidak Ada Data</h3>
          <p className="text-gray-600">Belum ada riwayat pemesanan yang sesuai filter</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Kegiatan</th>
                <th>Laboratorium</th>
                <th>Tanggal & Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiwayat.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono">{item.id}</td>
                  <td>{item.namaKegiatan}</td>
                  <td>{item.laboratorium}</td>
                  <td>
                    <div className="flex flex-col">
                      <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                      <span className="text-sm text-gray-500">
                        {item.waktuMulai} - {item.waktuSelesai}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link 
                        to={`/pemesanan/${item.id}`}
                        className="btn btn-sm btn-ghost"
                      >
                        Detail
                      </Link>
                      {item.status === 'menunggu' && (
                        <button 
                          className="btn btn-sm btn-error"
                          onClick={() => {
                            if (confirm('Yakin ingin membatalkan pemesanan ini?')) {
                              // Implementasi pembatalan
                              console.log('Membatalkan pemesanan:', item.id)
                            }
                          }}
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Informasi */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Informasi</h3>
          <div className="text-sm">
            <p>• Pemesanan yang sudah disetujui tidak dapat dibatalkan</p>
            <p>• Riwayat pemesanan akan disimpan selama 3 bulan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiwayatPemesanan