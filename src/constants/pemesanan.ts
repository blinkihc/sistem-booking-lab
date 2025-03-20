export const JAM_PELAJARAN = [
  { ke: 1, label: 'Jam ke-1', waktu: '07:30 - 08:10' },
  { ke: 2, label: 'Jam ke-2', waktu: '08:10 - 08:50' },
  { ke: 3, label: 'Jam ke-3', waktu: '08:50 - 09:30' },
  { ke: 4, label: 'Jam ke-4', waktu: '09:30 - 10:10' },
  { ke: 5, label: 'Jam ke-5', waktu: '10:30 - 11:10' },
  { ke: 6, label: 'Jam ke-6', waktu: '11:10 - 11:50' },
  { ke: 7, label: 'Jam ke-7', waktu: '11:50 - 12:30' }
] as const

export const MATA_PELAJARAN = [
  { id: 'tik', nama: 'Teknologi Informasi dan Komunikasi' },
  { id: 'ipa', nama: 'Ilmu Pengetahuan Alam' },
  { id: 'mtk', nama: 'Matematika' },
  { id: 'ips', nama: 'Ilmu Pengetahuan Sosial' },
  { id: 'pai', nama: 'Pendidikan Agama dan Budi Pekerti' },
  { id: 'pra', nama: 'Prakarya' }
] as const

export const DAFTAR_KELAS = [
  '7.1', '7.2', '7.3', '7.4', '7.5',
  '8.1', '8.2', '8.3', '8.4', '8.5',
  '9.1', '9.2', '9.3', '9.4', '9.5'
] as const

// Tipe untuk validasi
export type MataPelajaran = typeof MATA_PELAJARAN[number]['id']
export type JamPelajaran = typeof JAM_PELAJARAN[number]['ke']
export type Kelas = typeof DAFTAR_KELAS[number]