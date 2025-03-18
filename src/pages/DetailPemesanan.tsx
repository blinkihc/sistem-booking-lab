import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'selesai'
  createdAt: string
  catatan?: string
  disetujuiOleh?: string
  disetujuiPada?: string
}

const DetailPemesanan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [pemesanan, setPemesanan] = useState<DetailPemesanan | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setPemesanan({
          id: 'PMN-001',
          namaKegiatan: 'Praktikum Pemrograman Web',
          laboratorium: 'Laboratorium Komputer A1',
          tanggal: '2025-03-19',
          waktuMulai: '09:00',
          waktuSelesai: '12:00',
          jumlahPeserta: 30,
          penanggungJawab: CONFIG.userLogin,
          keterangan: 'Praktikum untuk mahasiswa semester 4',
          status: 'disetujui',
          createdAt: '2025-03-18 10:30:00',
          disetujuiOleh: 'Admin Lab',
          disetujuiPada: '2025-03-18 14:15:00',
          catatan: 'Silakan ambil kunci lab di ruang admin 30 menit sebelum waktu mulai'
        })
      } catch (error) {
        console.error('Gagal mengambil detail:', error)
        alert('Terjadi kesalahan saat mengambil detail pemesanan')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
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
          onClick={() => navigate('/riwayat')} 
          className="btn btn-primary mt-4"
        >
          Kembali ke Riwayat
        </button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      menunggu: 'badge-warning',
      disetujui: 'badge-success',
      ditolak: 'badge-error',
      selesai: 'badge-neutral'
    }
    return `badge ${badges[status as keyof typeof badges]} badge-lg`
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Detail Pemesanan</h2>
            <p className="text-gray-600">ID: {pemesanan.id}</p>
          </div>
          <span className={getStatusBadge(pemesanan.status)}>
            {pemesanan.status.charAt(0).toUpperCase() + pemesanan.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Kartu Detail */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Informasi Kegiatan */}
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
              <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
              <p className="text-gray-600">{pemesanan.keterangan}</p>
            </div>
          )}

          {/* Status dan Catatan */}
          <div className="divider"></div>
          
          {pemesanan.status === 'disetujui' && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Pemesanan Disetujui</h3>
                <div className="text-sm">
                  Disetujui oleh: {pemesanan.disetujuiOleh}<br />
                  Pada: {new Date(pemesanan.disetujuiPada!).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          )}

          {pemesanan.catatan && (
            <div className="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-bold">Catatan</h3>
                <div className="text-sm">{pemesanan.catatan}</div>
              </div>
            </div>
          )}

          {/* Informasi Waktu */}
          <div className="mt-6 text-sm text-gray-500">
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
            {pemesanan.status === 'menunggu' && (
              <button 
                className="btn btn-error"
                onClick={() => {
                  if (confirm('Yakin ingin membatalkan pemesanan ini?')) {
                    // Implementasi pembatalan
                    console.log('Membatalkan pemesanan:', pemesanan.id)
                  }
                }}
              >
                Batalkan
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/riwayat')}
            >
              Kembali ke Riwayat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPemesanan