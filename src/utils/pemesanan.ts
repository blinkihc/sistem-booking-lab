export interface PemesananLab {
    id: string
    tanggal: string
    pengajar: string
    kelas: string
    mataPelajaran: string
    jamPelajaran: number[]
    keterangan: string
    status: 'menunggu' | 'disetujui' | 'ditolak'
    waktuPengajuan: string
  }
  
  // Fungsi untuk mengambil semua data pemesanan
  export const ambilSemuaPemesanan = (): PemesananLab[] => {
    const dataTersimpan = localStorage.getItem('pemesananLab')
    return dataTersimpan ? JSON.parse(dataTersimpan) : []
  }
  
  // Fungsi untuk mengambil pemesanan hari ini
  export const ambilPemesananHariIni = (): PemesananLab[] => {
    const tanggalHariIni = new Date().toLocaleDateString('en-CA')
    return ambilSemuaPemesanan().filter(
      pemesanan => pemesanan.tanggal === tanggalHariIni
    )
  }
  
  // Fungsi untuk menghitung statistik pemesanan
  export const hitungStatistikPemesanan = () => {
    const semuaPemesanan = ambilSemuaPemesanan()
    return {
      total: semuaPemesanan.length,
      menunggu: semuaPemesanan.filter(p => p.status === 'menunggu').length,
      disetujui: semuaPemesanan.filter(p => p.status === 'disetujui').length,
      ditolak: semuaPemesanan.filter(p => p.status === 'ditolak').length
    }
  }