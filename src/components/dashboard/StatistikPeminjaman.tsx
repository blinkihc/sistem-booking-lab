import { useEffect, useState } from 'react'

interface StatistikData {
  jamMingguIni: number
  totalJamPemakaian: number
  guruMingguIni: number
  totalGuru: number
}

interface Peminjaman {
  id: string
  tanggal: string
  namaGuru: string
  mataPelajaran: string
  kelas: string
  jamPelajaran: number[]
  status: 'menunggu' | 'disetujui' | 'ditolak'
}

const StatistikPeminjaman = () => {
  const [statistik, setStatistik] = useState<StatistikData>({
    jamMingguIni: 0,
    totalJamPemakaian: 0,
    guruMingguIni: 0,
    totalGuru: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const hitungStatistik = () => {
    setIsLoading(true)
    const dataTersimpan = localStorage.getItem('pemesananLab')
    
    if (dataTersimpan) {
      const semuaPeminjaman: Peminjaman[] = JSON.parse(dataTersimpan)
      
      // Filter hanya peminjaman yang disetujui
      const peminjamanDisetujui = semuaPeminjaman.filter(
        (p) => p.status === 'disetujui'
      )

      // Hitung rentang minggu ini
      const hariIni = new Date()
      const awalMinggu = new Date(hariIni)
      awalMinggu.setDate(hariIni.getDate() - hariIni.getDay())
      awalMinggu.setHours(0, 0, 0, 0)
      
      const akhirMinggu = new Date(awalMinggu)
      akhirMinggu.setDate(awalMinggu.getDate() + 6)
      akhirMinggu.setHours(23, 59, 59, 999)

      // Filter peminjaman minggu ini
      const peminjamanMingguIni = peminjamanDisetujui.filter((p) => {
        const tanggalPeminjaman = new Date(p.tanggal)
        return tanggalPeminjaman >= awalMinggu && tanggalPeminjaman <= akhirMinggu
      })

      // Hitung jumlah guru unik (menggunakan Set untuk menghindari duplikasi)
      const guruMingguIni = new Set(peminjamanMingguIni.map(p => p.namaGuru))
      const totalGuru = new Set(peminjamanDisetujui.map(p => p.namaGuru))

      setTimeout(() => {
        setStatistik({
          jamMingguIni: peminjamanMingguIni.reduce(
            (total, p) => total + p.jamPelajaran.length, 
            0
          ),
          totalJamPemakaian: peminjamanDisetujui.reduce(
            (total, p) => total + p.jamPelajaran.length, 
            0
          ),
          guruMingguIni: guruMingguIni.size,
          totalGuru: totalGuru.size
        })
        setIsLoading(false)
      }, 500)
    } else {
      // Jika tidak ada data, set statistik ke 0
      setStatistik({
        jamMingguIni: 0,
        totalJamPemakaian: 0,
        guruMingguIni: 0,
        totalGuru: 0
      })
      setIsLoading(false)
    }
  }

  // Effect untuk memantau perubahan data
  useEffect(() => {
    hitungStatistik()
    
    // Tambahkan event listener untuk localStorage
    window.addEventListener('storage', hitungStatistik)
    
    // Tambahkan interval untuk update otomatis setiap menit
    const interval = setInterval(hitungStatistik, 60000)
    
    return () => {
      window.removeEventListener('storage', hitungStatistik)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Kartu 1: Jam Pemakaian Minggu Ini */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title text-base-content/70 text-sm font-medium">
                Jam Pemakaian Minggu Ini
              </h2>
              <p className={`text-2xl font-bold text-primary mt-1 transition-all duration-500 ${
                isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isLoading ? '...' : `${statistik.jamMingguIni} Jam`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu 2: Total Jam Pemakaian */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="card-title text-base-content/70 text-sm font-medium">
                Total Jam Pemakaian
              </h2>
              <p className={`text-2xl font-bold text-secondary mt-1 transition-all duration-500 ${
                isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isLoading ? '...' : `${statistik.totalJamPemakaian} Jam`}
              </p>
            </div>
          </div>
        </div>
      </div>
    
      {/* Kartu 3: Guru Minggu Ini */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title text-base-content/70 text-sm font-medium">
                Guru Minggu Ini
              </h2>
              <p className={`text-2xl font-bold text-accent mt-1 transition-all duration-500 ${
                isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isLoading ? '...' : `${statistik.guruMingguIni} Guru`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu 4: Total Guru */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title text-base-content/70 text-sm font-medium">
                Total Guru
              </h2>
              <p className={`text-2xl font-bold text-success mt-1 transition-all duration-500 ${
                isLoading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isLoading ? '...' : `${statistik.totalGuru} Guru`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatistikPeminjaman