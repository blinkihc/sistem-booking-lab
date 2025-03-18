import { LAB_CONFIG, VALIDASI_PEMESANAN } from '../config/labConfig'
import type { Laboratorium, FilterLab } from '../types/laboratorium'

export const useLabConfig = () => {
  // Fungsi untuk mendapatkan badge status
  const getStatusBadge = (status: Laboratorium['status']) => {
    const statusConfig = LAB_CONFIG.status[status]
    return {
      label: statusConfig.label,
      className: `badge badge-${statusConfig.warna}`
    }
  }

  // Fungsi untuk mendapatkan kategori lab
  const getKategoriLab = (kategoriId: string) => {
    return LAB_CONFIG.kategori.find(kat => kat.id === kategoriId)
  }

  // Fungsi untuk mendapatkan daftar fasilitas
  const getFasilitasLab = (fasilitasIds: string[]) => {
    return fasilitasIds.map(id => 
      LAB_CONFIG.fasilitas.find(fas => fas.id === id)
    ).filter(Boolean)
  }

  // Fungsi untuk mengecek jam operasional
  const isLabBuka = () => {
    const sekarang = new Date()
    const hari = sekarang.toLocaleDateString('id-ID', { weekday: 'long' })
    const jam = sekarang.getHours().toString().padStart(2, '0')
    return LAB_CONFIG.fungsi.isLabOperasional(`${jam}:00`, hari)
  }

  return {
    kategori: LAB_CONFIG.kategori,
    fasilitas: LAB_CONFIG.fasilitas,
    status: LAB_CONFIG.status,
    jamOperasional: LAB_CONFIG.jamOperasional,
    aturanPemesanan: LAB_CONFIG.aturanPemesanan,
    validasiPemesanan: VALIDASI_PEMESANAN,
    getStatusBadge,
    getKategoriLab,
    getFasilitasLab,
    isLabBuka
  }
}