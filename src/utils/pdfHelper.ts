import { jsPDF } from 'jspdf'
import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'

export const generateHeaderPDF = (doc: jsPDF, logo: string) => {
  // Kop surat
  doc.addImage(logo, 'PNG', 20, 10, 30, 30)
  doc.setFontSize(16)
  doc.text('NAMA SEKOLAH', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Alamat: Jalan Sekolah No. 123', 105, 30, { align: 'center' })
  doc.text('Telepon: (021) 1234567', 105, 35, { align: 'center' })
  
  // Garis pembatas
  doc.line(20, 45, 190, 45)
}

export const formatTanggal = (tanggal: string) => {
  return format(new Date(tanggal), 'dd MMMM yyyy', { locale: id })
}