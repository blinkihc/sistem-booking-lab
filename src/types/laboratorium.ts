export interface Laboratorium {
    id: string
    nama: string
    kategoriId: string
    lokasi: string
    lantai: number
    kapasitas: number
    fasilitas: string[] // array of fasilitas.id
    status: 'tersedia' | 'digunakan' | 'maintenance' | 'dipesan'
    gambar: string[]
    keterangan?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface JadwalLab {
    id: string
    labId: string
    tanggal: string
    jamMulai: string
    jamSelesai: string
    namaKegiatan: string
    penanggungJawab: string
    jumlahPeserta: number
    status: 'menunggu' | 'disetujui' | 'ditolak' | 'selesai'
    createdAt: string
    updatedAt: string
  }
  
  export interface FilterLab {
    kategori?: string
    status?: string
    kapasitasMin?: number
    kapasitasMax?: number
    fasilitas?: string[]
    tanggal?: string
    waktuMulai?: string
    waktuSelesai?: string
  }
  
  export interface HasilPencarianLab {
    data: Laboratorium[]
    total: number
    halaman: number
    totalHalaman: number
  }