import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { JAM_PELAJARAN, MATA_PELAJARAN, DAFTAR_KELAS } from '../constants/pemesanan'
import { 
  cekTanggalValid, 
  ambilDataHariLibur 
} from '../utils/date'

const FormPemesanan = () => {
  const navigate = useNavigate()
  const [jamTerpilih, setJamTerpilih] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [hariLibur, setHariLibur] = useState<string[]>([])
  const [loadingHariLibur, setLoadingHariLibur] = useState(true)
  const [formData, setFormData] = useState({
    tanggal: '',
    keterangan: '',
    kelas: '',
    mataPelajaran: ''
  })

  // State untuk menyimpan jam yang sudah dibooking
  const [jamTerbooking, setJamTerbooking] = useState<{[key: string]: number[]}>({})

  // Fungsi untuk mengecek apakah jam sudah dibooking
  const isJamTerbooking = (tanggal: string, jamKe: number): boolean => {
    return jamTerbooking[tanggal]?.includes(jamKe) || false
  }

  // Load data booking saat tanggal berubah
  useEffect(() => {
    if (formData.tanggal) {
      const dataTersimpan = localStorage.getItem('pemesananLab')
      if (dataTersimpan) {
        const daftarPemesanan = JSON.parse(dataTersimpan)
        const jadwalHariIni = daftarPemesanan
          .filter((pemesanan: any) => pemesanan.tanggal === formData.tanggal)
          .reduce((acc: number[], curr: any) => [...acc, ...curr.jamPelajaran], [])
        
        setJamTerbooking(prev => ({
          ...prev,
          [formData.tanggal]: jadwalHariIni
        }))
      }
    }
  }, [formData.tanggal])

  // Load data hari libur saat komponen dimuat
  useEffect(() => {
    const loadHariLibur = async () => {
      try {
        const tahunSekarang = new Date().getFullYear().toString()
        const dataHariLibur = await ambilDataHariLibur(tahunSekarang)
        setHariLibur(dataHariLibur)
      } catch (error) {
        console.error('Gagal memuat data hari libur:', error)
      } finally {
        setLoadingHariLibur(false)
      }
    }

    loadHariLibur()
  }, [])

  const tanggalMinimal = new Date().toISOString().split('T')[0]

  const handleChangeTanggal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tanggalDipilih = e.target.value

    if (!cekTanggalValid(tanggalDipilih, hariLibur)) {
      alert('Maaf, tanggal yang dipilih adalah hari Minggu atau hari libur nasional')
      return
    }

    setFormData(prev => ({
      ...prev,
      tanggal: tanggalDipilih
    }))
  }

  const handlePilihJam = (jamKe: number) => {
    let jamBaru: number[]
    
    if (jamTerpilih.includes(jamKe)) {
      jamBaru = jamTerpilih.filter(j => j <= jamKe)
    } else {
      if (jamTerpilih.length === 0 || jamKe === jamTerpilih[jamTerpilih.length - 1] + 1) {
        jamBaru = [...jamTerpilih, jamKe]
        if (jamBaru.length > 4) {
          alert('Maksimal pemesanan adalah 4 jam pelajaran')
          return
        }

        if (isJamTerbooking(formData.tanggal, jamKe)) {
          alert('Maaf, jam ini sudah dibooking')
          return
        }
      } else {
        alert('Mohon pilih jam pelajaran secara berurutan')
        return
      }
    }
    
    setJamTerpilih(jamBaru)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (jamTerpilih.length === 0) {
      alert('Mohon pilih jam pelajaran')
      return
    }

    setLoading(true)

    try {
      const dataPemesanan = {
        id: Date.now().toString(),
        tanggal: formData.tanggal,
        pengajar: 'blinkihc', // Username yang sedang login
        kelas: formData.kelas,
        mataPelajaran: formData.mataPelajaran,
        jamPelajaran: jamTerpilih,
        keterangan: formData.keterangan,
        status: 'menunggu',
        waktuPengajuan: new Date().toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta'
        })
      }

      const dataTersimpan = localStorage.getItem('pemesananLab')
      const daftarPemesanan = dataTersimpan ? JSON.parse(dataTersimpan) : []
      daftarPemesanan.unshift(dataPemesanan)
      localStorage.setItem('pemesananLab', JSON.stringify(daftarPemesanan))

      alert('Pemesanan berhasil diajukan!')
      navigate('/riwayat')
    } catch (error) {
      console.error('Terjadi kesalahan:', error)
      alert('Terjadi kesalahan saat mengajukan pemesanan')
    } finally {
      setLoading(false)
    }
  }

  // Render komponen
return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {loadingHariLibur ? (
          <div className="min-h-[80vh] flex justify-center items-center">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-base-content/70">Memuat data hari libur...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary text-center max-w-md mx-auto">
  Form Peminjaman Lab Komputer UPT SMPN 1 Buay Rawan
</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-sm"
              >
                Kembali
              </button>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Info Pengaju dengan warna yang lebih menarik */}
                  <div className="alert alert-info bg-info/20 border-info">
                    <div className="flex flex-col">
                      <span className="font-semibold">Informasi Pengaju</span>
                      <span className="text-sm">Nama Pengajar: blinkihc</span>
                      <span className="text-sm">
                        Waktu Pengajuan: {new Date().toLocaleString('id-ID', {
                          timeZone: 'Asia/Jakarta'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Form Fields dengan warna yang lebih menarik */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tanggal */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Tanggal Penggunaan</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="date" 
                          name="tanggal"
                          className={`input input-bordered w-full pr-10 
                            ${hariLibur.includes(formData.tanggal) ? 'border-error text-error' : 'border-primary'}`}
                          value={formData.tanggal}
                          onChange={handleChangeTanggal}
                          min={tanggalMinimal}
                          required
                        />
                        {hariLibur.includes(formData.tanggal) && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="tooltip" data-tip="Hari Libur">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <label className="label">
                        <span className="label-text-alt text-error">
                          *Hari Minggu dan hari libur nasional tidak dapat dipilih
                        </span>
                      </label>
                    </div>

                    {/* Mata Pelajaran dengan style yang lebih menarik */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Mata Pelajaran</span>
                      </label>
                      <select 
                        name="mataPelajaran"
                        className="select select-bordered hover:border-primary focus:border-primary"
                        value={formData.mataPelajaran}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          mataPelajaran: e.target.value
                        }))}
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
                        className="select select-bordered hover:border-primary focus:border-primary"
                        value={formData.kelas}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          kelas: e.target.value
                        }))}
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

                  {/* Jam Pelajaran dengan indikator status */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Pilih Jam Pelajaran</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {JAM_PELAJARAN.map((jam) => {
                        const isSelected = jamTerpilih.includes(jam.ke)
                        const isTerbooking = isJamTerbooking(formData.tanggal, jam.ke)
                        const dapatDipilih = !isTerbooking && (
                          jamTerpilih.length === 0 || 
                          jamTerpilih.includes(jam.ke) || 
                          jam.ke === jamTerpilih[jamTerpilih.length - 1] + 1
                        )

                        return (
                          <div key={jam.ke} className="relative">
                            <button
                              type="button"
                              className={`
                                btn w-full
                                ${isSelected ? 'btn-primary' : 'btn-outline'}
                                ${isTerbooking ? 'btn-error' : ''}
                                ${!dapatDipilih && !isTerbooking ? 'btn-disabled opacity-50' : ''}
                              `}
                              onClick={() => handlePilihJam(jam.ke)}
                              disabled={!dapatDipilih || isTerbooking}
                            >
                              {jam.label}
                            </button>
                            {isTerbooking && (
                              <div className="absolute -top-2 -right-2">
                                <div className="badge badge-error badge-sm">
                                  Terisi
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {jamTerpilih.length > 0 && (
                      <div className="mt-2 p-2 bg-primary/10 rounded-lg">
                        <span className="text-sm text-primary font-medium">
                          Jam terpilih: {jamTerpilih.map(j => `Jam ke-${j}`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Keterangan dengan style yang lebih menarik */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Keterangan Kegiatan</span>
                    </label>
                    <textarea 
                      name="keterangan"
                      className="textarea textarea-bordered min-h-[120px] hover:border-primary focus:border-primary" 
                      placeholder="Contoh: Praktikum Komputer - Materi Microsoft Excel"
                      value={formData.keterangan}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        keterangan: e.target.value
                      }))}
                      required
                    ></textarea>
                  </div>

                  {/* Legenda status jam */}
                  <div className="alert bg-base-200/50 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Keterangan Status Jam:</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Terpilih</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-error"></div>
                          <span className="text-sm">Terisi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-accent"></div>
                          <span className="text-sm">Tidak Tersedia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-base-content"></div>
                          <span className="text-sm">Tersedia</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button dengan animasi */}
                  <div className="card-actions justify-end mt-8">
                    <button 
                      type="submit" 
                      className={`
                        btn btn-primary min-w-[200px]
                        ${loading ? 'loading' : ''}
                        hover:scale-105 transition-transform
                      `}
                      disabled={loading || jamTerpilih.length === 0}
                    >
                      {loading ? 'Memproses...' : 'Ajukan Pemesanan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FormPemesanan