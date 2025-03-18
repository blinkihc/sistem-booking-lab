import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CONFIG } from '../config/appConfig'

interface JadwalHarian {
  tanggal: string
  jadwal: {
    mulai: string
    selesai: string
    kegiatan: string
    penanggungJawab: string
  }[]
}

interface Laboratorium {
  id: string
  nama: string
  lokasi: string
  lantai: number
  kapasitas: number
  fasilitas: string[]
  peralatan: string[]
  status: 'tersedia' | 'digunakan' | 'maintenance'
  keterangan?: string
  gambar: string[]
  jadwalMingguIni: JadwalHarian[]
}

const DetailLab = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [lab, setLab] = useState<Laboratorium | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchDetailLab = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setLab({
          id: 'LAB-KOM-A1',
          nama: 'Laboratorium Komputer A1',
          lokasi: 'Gedung Teknik A',
          lantai: 2,
          kapasitas: 30,
          fasilitas: ['AC', 'Proyektor', 'Papan Tulis', 'Wifi'],
          peralatan: [
            'Komputer Desktop (30 unit)',
            'Printer Laser',
            'Scanner',
            'Router Jaringan',
            'Switch Manageable'
          ],
          status: 'tersedia',
          keterangan: 'Lab ini dikhususkan untuk praktikum pemrograman dan jaringan komputer',
          gambar: [
            'https://placehold.co/800x600/png',
            'https://placehold.co/800x600/png',
            'https://placehold.co/800x600/png'
          ],
          jadwalMingguIni: [
            {
              tanggal: '2025-03-18',
              jadwal: [
                {
                  mulai: '09:00',
                  selesai: '12:00',
                  kegiatan: 'Praktikum Pemrograman Web',
                  penanggungJawab: 'Dosen A'
                }
              ]
            },
            {
              tanggal: '2025-03-19',
              jadwal: []
            }
          ]
        })
      } catch (error) {
        console.error('Gagal mengambil detail laboratorium:', error)
        alert('Terjadi kesalahan saat mengambil detail laboratorium')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailLab()
  }, [id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'tersedia':
        return <span className="badge badge-lg badge-success">Tersedia</span>
      case 'digunakan':
        return <span className="badge badge-lg badge-warning">Sedang Digunakan</span>
      case 'maintenance':
        return <span className="badge badge-lg badge-error">Maintenance</span>
      default:
        return <span className="badge badge-lg">-</span>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!lab) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-error">Laboratorium Tidak Ditemukan</h2>
        <p className="mt-2">Data laboratorium tidak tersedia</p>
        <Link to="/laboratorium" className="btn btn-primary mt-4">
          Kembali ke Daftar Lab
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">{lab.nama}</h2>
          <p className="text-gray-600">
            {lab.lokasi}, Lantai {lab.lantai}
          </p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(lab.status)}
          {lab.status === 'tersedia' && (
            <Link 
              to={`/pemesanan/baru?lab=${lab.id}`}
              className="btn btn-primary"
            >
              Pesan Sekarang
            </Link>
          )}
        </div>
      </div>

      {/* Galeri Gambar */}
      <div className="mb-8">
        <div className="relative">
          <img 
            src={lab.gambar[selectedImage]} 
            alt={`${lab.nama} - Gambar ${selectedImage + 1}`}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          {lab.gambar.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {lab.gambar.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === selectedImage ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Kapasitas dan Fasilitas</h3>
            <p className="mb-2">
              <span className="font-medium">Kapasitas:</span> {lab.kapasitas} orang
            </p>
            <div>
              <span className="font-medium">Fasilitas:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {lab.fasilitas.map((item, index) => (
                  <span key={index} className="badge badge-outline">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Peralatan</h3>
            <ul className="list-disc list-inside space-y-1">
              {lab.peralatan.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {lab.keterangan && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
              <p className="text-gray-600">{lab.keterangan}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Jadwal Minggu Ini</h3>
          <div className="space-y-4">
            {lab.jadwalMingguIni.map((hari, index) => (
              <div key={index} className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <h4 className="font-medium">
                    {new Date(hari.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h4>
                  {hari.jadwal.length > 0 ? (
                    <div className="space-y-2">
                      {hari.jadwal.map((jadwal, idx) => (
                        <div key={idx} className="bg-base-200 p-2 rounded">
                          <p className="font-medium">{jadwal.kegiatan}</p>
                          <p className="text-sm text-gray-600">
                            {jadwal.mulai} - {jadwal.selesai}
                          </p>
                          <p className="text-sm text-gray-600">
                            PJ: {jadwal.penanggungJawab}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada jadwal</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panduan Penggunaan */}
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Panduan Penggunaan</h3>
          <div className="text-sm">
            <p>• Peminjam wajib menjaga kebersihan dan kerapian laboratorium</p>
            <p>• Dilarang membawa makanan dan minuman ke dalam lab</p>
            <p>• Peralatan harus dikembalikan ke posisi semula setelah digunakan</p>
            <p>• Laporkan segera jika ada kerusakan atau masalah</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailLab