import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { JAM_PELAJARAN, MATA_PELAJARAN, DAFTAR_KELAS } from '../constants/pemesanan'
import { getTanggalMinimal, isTanggalValid, hitungJamTerisi } from '../utils/dateValidation'
import { cekTanggalValid, ambilDataHariLibur } from '../utils/date'

interface FormPemesananState {
  namaGuru: string
  tanggal: string
  keterangan: string
  kelas: string
  mataPelajaran: string
}

const INITIAL_STATE: FormPemesananState = {
  namaGuru: '',
  tanggal: '',
  keterangan: '',
  kelas: '',
  mataPelajaran: ''
}
interface PemesananData {
  id: string
  namaGuru: string
  tanggal: string
  keterangan: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan'
  pengaju: string
  waktuPengajuan: string
  waktuPersetujuan?: string
  disetujuiOleh?: string
  alasanPenolakan?: string
}
const FormPemesanan = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [jamTerpilih, setJamTerpilih] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [jamTerisi, setJamTerisi] = useState<number[]>([])
  const [hariLibur, setHariLibur] = useState<string[]>([])
  const [loadingHariLibur, setLoadingHariLibur] = useState(true)

  const tanggalMinimal = useMemo(() => getTanggalMinimal(), [])

  // Memuat data hari libur
  useEffect(() => {
    const loadHariLibur = async () => {
      try {
        const tahunSekarang = new Date().getFullYear().toString()
        const dataHariLibur = await ambilDataHariLibur(tahunSekarang)
        setHariLibur(dataHariLibur)
      } catch (error) {
        console.error('Gagal memuat data hari libur:', error)
        toast.error('Gagal memuat data hari libur')
      } finally {
        setLoadingHariLibur(false)
      }
    }

    loadHariLibur()
  }, [])

  // Memperbarui jam terisi saat tanggal berubah
  useEffect(() => {
    if (formData.tanggal) {
      const jamTerbooking = hitungJamTerisi(formData.tanggal)
      setJamTerisi(jamTerbooking)
      
      if (jamTerpilih.some(jam => jamTerbooking.includes(jam))) {
        setJamTerpilih([])
        toast.warning('Jam yang dipilih sudah tidak tersedia')
      }
    }
  }, [formData.tanggal, jamTerpilih])

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'tanggal') {
      if (!isTanggalValid(value, hariLibur)) { // Menambahkan parameter hariLibur
        toast.error('Maaf,Tanggal yang dipilih adalah hari Minggu atau hari libur nasional')
        return
      }

      if (!cekTanggalValid(value, hariLibur)) {
        toast.error('Maaf,Tanggal yang dipilih adalah hari Minggu atau hari libur nasional')
        return
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }, [hariLibur])

  const handlePilihJam = useCallback((jamKe: number) => {
    setJamTerpilih(prev => {
      if (prev.includes(jamKe)) {
        return prev.filter(j => j <= jamKe)
      }

      if (prev.length === 0 || jamKe === prev[prev.length - 1] + 1) {
        const jamBaru = [...prev, jamKe]
        
        if (jamBaru.length > 4) {
          toast.warning('Maksimal pemesanan adalah 4 jam pelajaran')
          return prev
        }

        if (jamTerisi.includes(jamKe)) {
          toast.error('Jam ini sudah terisi')
          return prev
        }

        return jamBaru
      }

      toast.warning('Mohon pilih jam pelajaran secara berurutan')
      return prev
    })
  }, [jamTerisi])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.namaGuru.trim()) {
      toast.error('Mohon isi nama guru')
      return
    }

    if (!isTanggalValid(formData.tanggal, hariLibur)) { // Menambahkan parameter hariLibur
      toast.error('Tanggal tidak valid')
      return
    }

    if (!cekTanggalValid(formData.tanggal, hariLibur)) {
      toast.error('Tanggal yang dipilih adalah hari libur')
      return
    }

    if (jamTerpilih.length === 0) {
      toast.error('Mohon pilih jam pelajaran')
      return
    }

    setLoading(true)

    try {
      const waktuSekarang = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      // Format data pemesanan dengan struktur yang konsisten
      const dataPemesanan: PemesananData = {
        id: `BOOK-${Date.now()}`,
        namaGuru: formData.namaGuru,
        tanggal: formData.tanggal,
        keterangan: formData.keterangan,
        kelas: formData.kelas,
        mataPelajaran: formData.mataPelajaran,
        jamPelajaran: jamTerpilih,
        status: 'menunggu',
        pengaju: 'blinkihc',
        waktuPengajuan: waktuSekarang
      }

      // Ambil data yang sudah ada
      const dataTersimpan = localStorage.getItem('pemesananLab')
      let daftarPemesanan: PemesananData[] = []
      
      if (dataTersimpan) {
        try {
          daftarPemesanan = JSON.parse(dataTersimpan)
          // Validasi format data
          if (!Array.isArray(daftarPemesanan)) {
            throw new Error('Format data tidak valid')
          }
        } catch (error) {
          console.error('Error parsing data:', error)
          daftarPemesanan = []
        }
      }

      // Tambahkan pemesanan baru di awal array
      const pemesananBaru = [dataPemesanan, ...daftarPemesanan]
      
      // Simpan kembali ke localStorage dengan key yang konsisten
      localStorage.setItem('pemesananLab', JSON.stringify(pemesananBaru))
      
      // Trigger event untuk memberitahu komponen lain
      window.dispatchEvent(new Event('storage'))
      
      toast.success('Pemesanan berhasil diajukan!')
      navigate('/riwayat')
    } catch (error) {
      console.error('Terjadi kesalahan:', error)
      toast.error('Terjadi kesalahan saat mengajukan pemesanan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-8">
      <div className="max-w-3xl mx-auto">
  {loadingHariLibur ? (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">Tunggu sebentar ya...</p>
      </div>
    </div>
    ) : (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-center max-w-full mx-auto">
            Form Peminjaman Lab Komputer UPT SMP Negeri 1 Buay Rawan
          </h1>
          
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Guru */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nama Guru</span>
                </label>
                <input 
                  type="text" 
                  name="namaGuru"
                  className="input input-bordered w-full"
                  value={formData.namaGuru}
                  onChange={handleFormChange}
                  required
                  placeholder="Masukkan nama lengkap guru"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tanggal */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Tanggal Penggunaan</span>
                  </label>
                  <input 
                    type="date" 
                    name="tanggal"
                    className="input input-bordered w-full"
                    value={formData.tanggal}
                    onChange={handleFormChange}
                    min={tanggalMinimal}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-error">
                      *Minimal 2 hari dari sekarang
                    </span>
                  </label>
                </div>

                {/* Mata Pelajaran */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Mata Pelajaran</span>
                  </label>
                  <select 
                    name="mataPelajaran"
                    className="select select-bordered w-full"
                    value={formData.mataPelajaran}
                    onChange={handleFormChange}
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

                {/* Kelas */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Kelas</span>
                  </label>
                  <select 
                    name="kelas"
                    className="select select-bordered w-full"
                    value={formData.kelas}
                    onChange={handleFormChange}
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

              {/* Jam Pelajaran */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Pilih Jam Pelajaran</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {JAM_PELAJARAN.map((jam) => {
                    const isSelected = jamTerpilih.includes(jam.ke)
                    const isTerisi = jamTerisi.includes(jam.ke)
                    const dapatDipilih = !isTerisi && (
                      jamTerpilih.length === 0 || 
                      jamTerpilih.includes(jam.ke) || 
                      jam.ke === jamTerpilih[jamTerpilih.length - 1] + 1
                    )

                    return (
                      <div key={jam.ke} className="relative tooltip" data-tip={jam.waktu}>
                        <button
                          type="button"
                          className={`btn w-full ${
                            isSelected ? 'btn-primary' : 
                            isTerisi ? 'btn-error' : 
                            !dapatDipilih ? 'btn-disabled' : 
                            'btn-outline'
                          }`}
                          onClick={() => handlePilihJam(jam.ke)}
                          disabled={!dapatDipilih || isTerisi}
                        >
                          {jam.label}
                        </button>
                        {isTerisi && (
                          <div className="absolute -top-2 -right-2">
                            <div className="badge badge-error badge-sm">Terisi</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {jamTerpilih.length > 0 && (
                  <div className="mt-2">
                    <div className="alert alert-info">
                      <span>Jam terpilih: {jamTerpilih.map(j => {
                        const jam = JAM_PELAJARAN.find(item => item.ke === j)
                        return `${jam?.label} (${jam?.waktu})`
                      }).join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Keterangan */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Keterangan</span>
                </label>
                <textarea 
                  name="keterangan"
                  className="textarea textarea-bordered w-full" 
                  placeholder="Masukkan keterangan atau materi pembelajaran"
                  value={formData.keterangan}
                  onChange={handleFormChange}
                  required
                  rows={3}
                />
              </div>

              {/* Status Legenda */}
              <div className="alert bg-base-200">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Keterangan Status Jam:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="badge badge-primary badge-xs"></div>
                      <span className="text-sm">Terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-error badge-xs"></div>
                      <span className="text-sm">Terisi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-outline badge-xs"></div>
                      <span className="text-sm">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-ghost badge-xs"></div>
                      <span className="text-sm">Tidak Tersedia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
          >
            Kembali
          </button>
              <div className="card-actions justify-end mt-6">
              
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading || jamTerpilih.length === 0}
                >
                  {loading ? 'Memproses...' : 'Ajukan Pemesanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )}
  </div>
</div>
  )
}

export default FormPemesanan