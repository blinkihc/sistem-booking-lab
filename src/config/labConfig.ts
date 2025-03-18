import { CONFIG } from './appConfig'

export interface KategoriLab {
  id: string
  nama: string
  deskripsi: string
  warna: string // untuk badge dan highlight
}

export interface FasilitasLab {
  id: string
  nama: string
  icon: string // nama icon dari heroicons atau icon lainnya
}

export interface PeralatanLab {
  id: string
  nama: string
  jumlah: number
  satuan: string
  kondisi: 'baik' | 'rusak-ringan' | 'rusak-berat'
}

export interface StatusLab {
  kode: 'tersedia' | 'digunakan' | 'maintenance' | 'dipesan'
  label: string
  warna: string // untuk styling badge
}

export interface JamOperasional {
  hari: string
  buka: string
  tutup: string
  keterangan?: string
}

export const LAB_CONFIG = {
  kategori: [
    {
      id: 'komputer',
      nama: 'Laboratorium Komputer',
      deskripsi: 'Lab untuk praktikum pemrograman dan jaringan',
      warna: 'primary'
    },
    {
      id: 'fisika',
      nama: 'Laboratorium Fisika',
      deskripsi: 'Lab untuk praktikum fisika dasar',
      warna: 'secondary'
    },
    {
      id: 'kimia',
      nama: 'Laboratorium Kimia',
      deskripsi: 'Lab untuk praktikum kimia dasar dan analisis',
      warna: 'accent'
    }
  ] as KategoriLab[],

  fasilitas: [
    {
      id: 'komputer',
      nama: 'Komputer',
      icon: 'computer-desktop'
    },
    {
      id: 'proyektor',
      nama: 'Proyektor',
      icon: 'presentation-chart-bar'
    },
    {
      id: 'ac',
      nama: 'AC',
      icon: 'sun'
    },
    {
      id: 'wifi',
      nama: 'Wifi',
      icon: 'wifi'
    },
    {
      id: 'papan-tulis',
      nama: 'Papan Tulis',
      icon: 'rectangle-group'
    }
  ] as FasilitasLab[],

  status: {
    tersedia: {
      kode: 'tersedia',
      label: 'Tersedia',
      warna: 'success'
    },
    digunakan: {
      kode: 'digunakan',
      label: 'Sedang Digunakan',
      warna: 'warning'
    },
    maintenance: {
      kode: 'maintenance',
      label: 'Maintenance',
      warna: 'error'
    },
    dipesan: {
      kode: 'dipesan',
      label: 'Sudah Dipesan',
      warna: 'info'
    }
  } as Record<string, StatusLab>,

  jamOperasional: [
    {
      hari: 'Senin',
      buka: '08:00',
      tutup: '16:00'
    },
    {
      hari: 'Selasa',
      buka: '08:00',
      tutup: '16:00'
    },
    {
      hari: 'Rabu',
      buka: '08:00',
      tutup: '16:00'
    },
    {
      hari: 'Kamis',
      buka: '08:00',
      tutup: '16:00'
    },
    {
      hari: 'Jumat',
      buka: '08:00',
      tutup: '15:30',
      keterangan: 'Tutup saat waktu sholat Jumat (11:30 - 13:00)'
    },
    {
      hari: 'Sabtu',
      buka: '08:00',
      tutup: '12:00'
    },
    {
      hari: 'Minggu',
      buka: '-',
      tutup: '-',
      keterangan: 'Tutup'
    }
  ] as JamOperasional[],

  aturanPemesanan: {
    minDurasiPemesanan: 1, // dalam jam
    maxDurasiPemesanan: 4, // dalam jam
    minHariSebelumPesan: 1, // minimal pesan H-1
    maxHariSebelumPesan: 30, // maksimal pesan 30 hari ke depan
    batasWaktuPembatalan: 24, // dalam jam sebelum jadwal
    maksimalPemesananPerMinggu: 3 // per user
  },

  fungsi: {
    // Fungsi untuk mengecek apakah lab sedang beroperasi
    isLabOperasional: (jam: string, hari: string): boolean => {
      const operasional = LAB_CONFIG.jamOperasional.find(
        (jadwal) => jadwal.hari === hari
      )
      if (!operasional || operasional.buka === '-') return false
      
      const [jamSekarang] = jam.split(':')
      const [jamBuka] = operasional.buka.split(':')
      const [jamTutup] = operasional.tutup.split(':')
      
      return parseInt(jamSekarang) >= parseInt(jamBuka) && 
             parseInt(jamSekarang) < parseInt(jamTutup)
    },

    // Fungsi untuk memformat durasi
    formatDurasi: (durasiMenit: number): string => {
      const jam = Math.floor(durasiMenit / 60)
      const menit = durasiMenit % 60
      return `${jam} jam${menit > 0 ? ` ${menit} menit` : ''}`
    },

    // Fungsi untuk mengecek ketersediaan lab
    cekKetersediaan: (
      tanggal: string,
      jamMulai: string,
      jamSelesai: string
    ): Promise<boolean> => {
      // Implementasi pengecekan ke API atau database
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true) // dummy response
        }, 1000)
      })
    }
  }
}

// Konstanta untuk validasi form pemesanan
export const VALIDASI_PEMESANAN = {
  minPeserta: 1,
  maxPeserta: 40,
  karakterMinimal: {
    namaKegiatan: 5,
    keterangan: 10
  },
  formatFile: ['.pdf', '.doc', '.docx'],
  maxUkuranFile: 5 * 1024 * 1024 // 5MB dalam bytes
}

// Pesan error yang umum digunakan
export const PESAN_ERROR = {
  labTidakTersedia: 'Laboratorium tidak tersedia pada waktu yang dipilih',
  waktuTidakValid: 'Waktu pemesanan tidak valid',
  kuotaPenuhHarian: 'Kuota pemesanan harian sudah penuh',
  kuotaPenuhMingguan: `Anda telah mencapai batas maksimal pemesanan (${LAB_CONFIG.aturanPemesanan.maksimalPemesananPerMinggu}x) dalam seminggu`,
  waktuOperasional: 'Waktu pemesanan di luar jam operasional',
  maintenance: 'Laboratorium sedang dalam maintenance'
}