export interface Pemesanan {
    id: string
    tanggal: string
    pengajar: string
    kelas: string
    mataPelajaran: {
      id: string
      nama: string
    }
    jamPelajaran: number[]
    keterangan: string
    status: 'menunggu' | 'disetujui' | 'ditolak'
    tanggalPengajuan: string
  }