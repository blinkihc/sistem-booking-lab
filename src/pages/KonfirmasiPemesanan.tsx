import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CONFIG } from '../config/appConfig'

interface DetailPemesanan {
  id: string
  namaKegiatan: string
  laboratorium: string
  tanggal: string
  waktuMulai: string
  waktuSelesai: string
  jumlahPeserta: number
  penanggungJawab: string
  keterangan: string
  status: 'menunggu' | 'disetujui' | 'ditolak'
  createdAt: string
}

const KonfirmasiPemesanan = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [pemesanan, setPemesanan] = useState<DetailPemesanan | null>(null)

  useEffect(() => {
    // Simulasi mengambil data dari server
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setPemesanan({
          id: id || '123',
          namaKegiatan: 'Praktikum Pemrograman Web',
          laboratorium: 'Laboratorium Komputer A1',
          tanggal: '2025-03-19',
          waktuMulai: '09:00',
          waktuSelesai: '12:00',
          jumlahPeserta: 30,
          penanggungJawab: CONFIG.userLogin,
          keterangan: 'Praktikum untuk mahasiswa semester 4',
          status: 'menunggu',
          createdAt: CONFIG.waktuServer
        })
      } catch (error) {
        console.error('Gagal mengambil data:', error)
        alert('Terjadi kesalahan saat mengambil data pemesanan')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!pemesanan) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-error">Data Tidak Ditemukan</h2>
        <p className="mt-2">Pemesanan dengan ID tersebut tidak ditemukan</p>
        <button 
          onClick={() => navigate('/pemesanan')} 
          className="btn btn-primary mt-4"
        >
          Kembali ke Daftar Pemesanan
        </button>
      </div>
    )
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'menunggu':
        return 'badge badge-warning'
      case 'disetujui':
        return 'badge badge-success'
      case 'ditolak':
        return 'badge badge-error'
      default:
        return 'badge'
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Konfirmasi Pemesanan</h2>
        <p className="text-gray-600">
          Pemesanan berhasil dibuat. Silakan cek detail pemesanan Anda di bawah ini.
        </p>
      </div>

      {/* Kartu Konfirmasi */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Status dan ID Pemesanan */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-sm text-gray-500">ID Pemesanan:</span>
              <p className="font-mono">{pemesanan.id}</p>
            </div>
            <div className={getStatusBadgeClass(pemesanan.status)}>
              {pemesanan.status === 'menunggu' && 'Menunggu Persetujuan'}
              {pemesanan.status === 'disetujui' && 'Disetujui'}
              {pemesanan.status === 'ditolak' && 'Ditolak'}
            </div>
          </div>

          {/* Detail Pemesanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Kegiatan</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Nama Kegiatan</label>
                  <p className="font-medium">{pemesanan.namaKegiatan}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Laboratorium</label>
                  <p className="font-medium">{pemesanan.laboratorium}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Jumlah Peserta</label>
                  <p className="font-medium">{pemesanan.jumlahPeserta} orang</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Waktu dan Penanggung Jawab</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Tanggal</label>
                  <p className="font-medium">
                    {new Date(pemesanan.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Waktu</label>
                  <p className="font-medium">{pemesanan.waktuMulai} - {pemesanan.waktuSelesai} WIB</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Penanggung Jawab</label>
                  <p className="font-medium">{pemesanan.penanggungJawab}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          {pemesanan.keterangan && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Keterangan Tambahan</h3>
              <p className="text-gray-600">{pemesanan.keterangan}</p>
            </div>
          )}

          {/* Informasi Waktu Pembuatan */}
          <div className="divider"></div>
          <div className="text-sm text-gray-500">
            Dibuat pada: {new Date(pemesanan.createdAt).toLocaleString('id-ID')}
          </div>

          {/* Tombol Aksi */}
          <div className="card-actions justify-end mt-6">
            <button 
              className="btn btn-ghost"
              onClick={() => window.print()}
            >
              Cetak
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Petunjuk Selanjutnya */}
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Langkah Selanjutnya</h3>
          <div className="text-sm">
            Pemesanan Anda akan diproses dalam waktu 1x24 jam kerja. Anda akan menerima notifikasi ketika status pemesanan berubah.
          </div>
        </div>
      </div>
    </div>
  )
}

export default KonfirmasiPemesanan