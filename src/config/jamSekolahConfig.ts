export interface JamPelajaran {
    ke: number
    mulai: string
    selesai: string
    keterangan?: string
  }
  
  export const JAM_SEKOLAH_CONFIG = {
    jamPelajaran: [
      { ke: 1, mulai: '07:30', selesai: '08:10' },
      { ke: 2, mulai: '08:10', selesai: '08:50' },
      { ke: 3, mulai: '08:50', selesai: '09:30' },
      { ke: 4, mulai: '09:30', selesai: '10:10' },
      { ke: 5, mulai: '10:30', selesai: '11:10' },
      { ke: 6, mulai: '11:10', selesai: '11:50' },
      { ke: 7, mulai: '11:50', selesai: '12:30' }
    ] as JamPelajaran[],
  
    // Aturan pemesanan laboratorium
    aturanPemesanan: {
      minJamPelajaran: 1, // minimal 1 jam pelajaran
      maxJamPelajaran: 4, // maksimal 4 jam pelajaran
      batasWaktuPembatalan: 24, // dalam jam
      maksimalMingguPemesanan: 4 // guru dapat memesan hingga 4 minggu ke depan
    },
  
    // Fungsi helper
    fungsi: {
      // Mendapatkan detail jam pelajaran
      getDetailJamPelajaran: (jamKe: number): JamPelajaran | undefined => {
        return JAM_SEKOLAH_CONFIG.jamPelajaran.find(jam => jam.ke === jamKe)
      },
  
      // Format jam pelajaran untuk tampilan
      formatJamPelajaran: (jamKe: number[]): string => {
        const jamPertama = JAM_SEKOLAH_CONFIG.jamPelajaran.find(j => j.ke === jamKe[0])
        const jamTerakhir = JAM_SEKOLAH_CONFIG.jamPelajaran.find(j => j.ke === jamKe[jamKe.length - 1])
        if (jamPertama && jamTerakhir) {
          return `Jam ke ${jamKe.join(',')} (${jamPertama.mulai}-${jamTerakhir.selesai})`
        }
        return 'Waktu tidak valid'
      },
  
      // Cek apakah jam yang dipilih berurutan
      isJamBerurutan: (jamKe: number[]): boolean => {
        for (let i = 1; i < jamKe.length; i++) {
          if (jamKe[i] !== jamKe[i-1] + 1) return false
        }
        return true
      }
    }
  }