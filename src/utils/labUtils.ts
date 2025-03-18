import { LAB_CONFIG, PESAN_ERROR } from '../config/labConfig'
import type { FilterLab, Laboratorium } from '../types/laboratorium'

export const validatePemesanan = (
  lab: Laboratorium,
  tanggal: string,
  jamMulai: string,
  jamSelesai: string,
  jumlahPeserta: number
): string | null => {
  // Cek status lab
  if (lab.status === 'maintenance') {
    return PESAN_ERROR.maintenance
  }

  // Cek kapasitas
  if (jumlahPeserta > lab.kapasitas) {
    return `Jumlah peserta melebihi kapasitas lab (${lab.kapasitas} orang)`
  }

  // Cek jam operasional
  const hari = new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' })
  if (!LAB_CONFIG.fungsi.isLabOperasional(jamMulai, hari)) {
    return PESAN_ERROR.waktuOperasional
  }

  // Validasi lainnya...
  return null
}

export const getStatusBadgeClass = (status: Laboratorium['status']): string => {
  const statusConfig = LAB_CONFIG.status[status]
  return `badge badge-${statusConfig.warna}`
}