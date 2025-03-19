// Format tanggal ke YYYY-MM-DD
export const formatTanggal = (tanggal: Date): string => {
    return tanggal.toLocaleDateString('en-CA')
  }
  
  // Cek apakah hari Minggu
  export const isHariMinggu = (tanggal: Date): boolean => {
    return tanggal.getDay() === 0
  }
  
  // Ambil data hari libur dari API
  export const ambilDataHariLibur = async (tahun: string): Promise<string[]> => {
    try {
      const response = await fetch(`https://myopentrip.com/api/public-holiday?year=${tahun}`)
      if (!response.ok) {
        throw new Error('Gagal mengambil data hari libur')
      }
      const data = await response.json()
      return data.map((libur: any) => new Date(libur.date).toLocaleDateString('en-CA'))
    } catch (error) {
      console.error('Error:', error)
      return []
    }
  }
  
  // Cek tanggal valid
  export const cekTanggalValid = (tanggal: string, hariLibur: string[]): boolean => {
    try {
      const tanggalObj = new Date(tanggal)
      if (isNaN(tanggalObj.getTime())) return false
      if (isHariMinggu(tanggalObj)) return false
      return !hariLibur.includes(tanggal)
    } catch (error) {
      console.error('Error validasi tanggal:', error)
      return false
    }
  }
  
  // Cek jadwal bentrok
  export const cekJadwalBentrok = (
    tanggal: string,
    jamPelajaran: number[],
    daftarPemesanan: any[]
  ): boolean => {
    return daftarPemesanan.some(pemesanan => 
      pemesanan.tanggal === tanggal && 
      pemesanan.jamPelajaran.some((jam: number) => jamPelajaran.includes(jam))
    )
  }