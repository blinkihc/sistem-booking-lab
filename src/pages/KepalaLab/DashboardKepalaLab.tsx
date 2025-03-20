import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import Footer from '../../components/dashboard/Footer'

// Tipe data untuk pemesanan
interface Pemesanan {
  id: string
  tanggal: string
  namaGuru: string
  mataPelajaran: string
  kelas: string
  jamPelajaran: number[]
  status: 'menunggu' | 'disetujui' | 'ditolak'
}

interface FilterState {
  tahun: string
  bulan: string
  namaGuru: string
  mataPelajaran: string
  kelas: string
}

// Konstanta untuk pagination
const ITEMS_PER_PAGE = 10

// Konstanta untuk mata pelajaran
const MATA_PELAJARAN = [
  { id: 'tik', nama: 'Teknologi Informasi dan Komunikasi' },
  { id: 'ipa', nama: 'Ilmu Pengetahuan Alam' },
  { id: 'mtk', nama: 'Matematika' },
  { id: 'bind', nama: 'Bahasa Indonesia' },
  { id: 'bing', nama: 'Bahasa Inggris' },
  { id: 'ips', nama: 'Ilmu Pengetahuan Sosial' }
] as const

// Konstanta untuk daftar kelas
const DAFTAR_KELAS = ['X', 'XI', 'XII'] as const

export const DashboardKepalaLab = () => {
  // State untuk tab dan halaman
  const [tabAktif, setTabAktif] = useState<'menunggu' | 'disetujui' | 'ditolak'>('menunggu')
  const [halamanSaatIni, setHalamanSaatIni] = useState(1)
  const [dataPemesanan, setDataPemesanan] = useState<Pemesanan[]>([])
  
  // State untuk filter
  const [filterPencarian, setFilterPencarian] = useState<FilterState>({
    tahun: new Date().getFullYear().toString(),
    bulan: 'semua',
    namaGuru: '',
    mataPelajaran: '',
    kelas: ''
  })

  // Effect untuk memuat data
  useEffect(() => {
    const dataTersimpan = localStorage.getItem('pemesananLab')
    if (dataTersimpan) {
      setDataPemesanan(JSON.parse(dataTersimpan))
    }
  }, [])

  // Format tanggal ke Bahasa Indonesia
  const formatTanggal = (tanggal: string): string => {
    const date = new Date(tanggal)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  // Handler untuk menyetujui pemesanan
  const handleSetujui = (id: string) => {
    const dataBaruPemesanan = dataPemesanan.map(item => 
      item.id === id ? { ...item, status: 'disetujui' as const } : item
    )
    setDataPemesanan(dataBaruPemesanan)
    localStorage.setItem('pemesananLab', JSON.stringify(dataBaruPemesanan))
    toast.success('Pemesanan berhasil disetujui')
  }

  // Handler untuk menolak pemesanan
  const handleTolak = (id: string) => {
    const dataBaruPemesanan = dataPemesanan.map(item => 
      item.id === id ? { ...item, status: 'ditolak' as const } : item
    )
    setDataPemesanan(dataBaruPemesanan)
    localStorage.setItem('pemesananLab', JSON.stringify(dataBaruPemesanan))
    toast.error('Pemesanan ditolak')
  }

  // Filter data pemesanan
  const dataFiltered = dataPemesanan.filter(p => {
    if (p.status !== tabAktif) return false
    if (filterPencarian.tahun && !p.tanggal.includes(filterPencarian.tahun)) return false
    if (filterPencarian.bulan !== 'semua' && !p.tanggal.includes(`-${filterPencarian.bulan}-`)) return false
    if (filterPencarian.namaGuru && !p.namaGuru.toLowerCase().includes(filterPencarian.namaGuru.toLowerCase())) return false
    if (filterPencarian.mataPelajaran && p.mataPelajaran !== filterPencarian.mataPelajaran) return false
    if (filterPencarian.kelas && p.kelas !== filterPencarian.kelas) return false
    return true
  })

  // Data untuk halaman saat ini
  const dataPaginasi = dataFiltered.slice(
    (halamanSaatIni - 1) * ITEMS_PER_PAGE,
    halamanSaatIni * ITEMS_PER_PAGE
  )

  // Generate tahun untuk filter (4 tahun terakhir)
  const tahunSekarang = new Date().getFullYear()
  const tahunFilter = Array.from(
    { length: 4 }, 
    (_, i) => (tahunSekarang - i).toString()
  )

  // Daftar bulan dalam bahasa Indonesia
  const bulanFilter = [
    { value: 'semua', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ]

  // Handler untuk ekspor PDF
  const handleEksporPDF = () => {
    const doc = new jsPDF({
      format: 'legal',
      unit: 'mm',
      orientation: 'landscape'
    })

    // Set font default
    doc.setFont('helvetica')
    
    // Kop surat dengan jarak yang sesuai
    doc.setFontSize(16)
    doc.text('UPT SMP NEGERI 1 BUAY RAWAN', 149, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Jl. Danau Halim Desa Gunung Cahya', 149, 27, { align: 'center' })
    doc.text('Telepon: (0735) 123456', 149, 34, { align: 'center' })
    
    // Garis pembatas
    doc.setLineWidth(0.5)
    doc.line(20, 40, 277, 40)
    doc.setLineWidth(0.1)
    doc.line(20, 41, 277, 41)
    
    // Judul laporan dengan jarak yang disesuaikan
    doc.setFontSize(14)
    doc.text(
      'LAPORAN PEMAKAIAN LABORATORIUM KOMPUTER',
      149,
      50,
      { align: 'center' }
    )
    
    doc.setFontSize(12)
    doc.text(
      `STATUS: ${tabAktif.toUpperCase()}`,
      149,
      57,
      { align: 'center' }
    )
    
    // Informasi filter yang digunakan dengan jarak yang sesuai
    doc.setFontSize(10)
    let y = 65 // Mulai dari y = 65 untuk informasi filter
    const filterInfo = []
    
    if (filterPencarian.tahun) {
      filterInfo.push(`Tahun: ${filterPencarian.tahun}`)
    }
    if (filterPencarian.bulan !== 'semua') {
      const namaBulan = bulanFilter.find(b => b.value === filterPencarian.bulan)?.label
      filterInfo.push(`Bulan: ${namaBulan}`)
    }
    if (filterPencarian.namaGuru) {
      filterInfo.push(`Nama Guru: ${filterPencarian.namaGuru}`)
    }
    if (filterPencarian.mataPelajaran) {
      const namaMapel = MATA_PELAJARAN.find(m => m.id === filterPencarian.mataPelajaran)?.nama
      filterInfo.push(`Mata Pelajaran: ${namaMapel}`)
    }
    if (filterPencarian.kelas) {
      filterInfo.push(`Kelas: ${filterPencarian.kelas}`)
    }
    
    if (filterInfo.length > 0) {
      doc.text('Filter yang digunakan:', 20, y)
      filterInfo.forEach((info, index) => {
        doc.text(`• ${info}`, 30, y + ((index + 1) * 5))
      })
      y = y + (filterInfo.length * 5) + 10 // Tambah jarak setelah filter
    } else {
      y = y + 10 // Jika tidak ada filter, tetap tambah jarak
    }
    
    // Header tabel dengan jarak yang disesuaikan
    const headers = ['No', 'Tanggal', 'Nama Guru', 'Mata Pelajaran', 'Kelas', 'Jam', 'Status']
    const cellWidth = [15, 40, 45, 60, 25, 35, 30] // Total = 250mm
    let x = 20
    
    // Background header tabel
    doc.setFillColor(240, 240, 240)
    doc.rect(x, y - 5, cellWidth.reduce((a, b) => a + b, 0), 8, 'F')
    
    // Teks header tabel
    doc.setFont('helvetica', 'bold')
    headers.forEach((header, i) => {
      doc.text(header, x + (cellWidth[i] / 2), y, { align: 'center' })
      x += cellWidth[i]
    })
    
    // Isi tabel
    doc.setFont('helvetica', 'normal')
    dataFiltered.forEach((item, index) => {
      y += 8 // Jarak antar baris
      x = 20
      
      // Nomor
      doc.text((index + 1).toString(), x + (cellWidth[0] / 2), y, { align: 'center' })
      x += cellWidth[0]
      
      // Tanggal
      doc.text(formatTanggal(item.tanggal), x + 5, y)
      x += cellWidth[1]
      
      // Nama Guru
      doc.text(item.namaGuru, x + 5, y)
      x += cellWidth[2]
      
      // Mata Pelajaran
      const namaMapel = MATA_PELAJARAN.find(m => m.id === item.mataPelajaran)?.nama || ''
      doc.text(namaMapel, x + 5, y, { maxWidth: cellWidth[3] - 10 })
      x += cellWidth[3]
      
      // Kelas
      doc.text(`Kelas ${item.kelas}`, x + (cellWidth[4] / 2), y, { align: 'center' })
      x += cellWidth[4]
      
      // Jam
      doc.text(item.jamPelajaran.join(', '), x + (cellWidth[5] / 2), y, { align: 'center' })
      x += cellWidth[5]
      
      // Status
      doc.text(
        item.status === 'disetujui' ? 'Disetujui' : 'Ditolak',
        x + (cellWidth[6] / 2),
        y,
        { align: 'center' }
      )
      
      // Tambah halaman baru jika mendekati batas bawah
      if (y >= 190) {
        doc.addPage()
        y = 20
      }
    })
    
    // Footer setiap halaman
    const totalHalaman = doc.getNumberOfPages()
    for (let i = 1; i <= totalHalaman; i++) {
      doc.setPage(i)
      
      // Informasi cetak
      const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      doc.setFontSize(8)
      doc.text(
        `Dicetak pada: ${tanggalCetak} WIB`,
        20,
        200
      )
      
      // Nomor halaman
      doc.text(
        `Halaman ${i} dari ${totalHalaman}`,
        277,
        200,
        { align: 'right' }
      )
    }
    // Tambah tanda tangan
  const ttdY = y + 20 // Beri jarak dari data terakhir
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  // Tempat dan tanggal
  const tempatDanTanggal = `Ciomas, ${new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })}`

  // Kolom tanda tangan kiri (Kepala Lab)
  doc.text(tempatDanTanggal, 40, ttdY)
  doc.text('Kepala Laboratorium Komputer', 40, ttdY + 5)
  doc.text('', 40, ttdY + 25) // Spasi untuk tanda tangan
  doc.text('Nama Kepala Lab', 40, ttdY + 30)
  doc.text('NIP. 123456789', 40, ttdY + 35)

  // Kolom tanda tangan kanan (Kepala Sekolah)
  doc.text('Mengetahui,', 200, ttdY)
  doc.text('Kepala Sekolah', 200, ttdY + 5)
  doc.text('', 200, ttdY + 25) // Spasi untuk tanda tangan
  doc.text('Nama Kepala Sekolah', 200, ttdY + 30)
  doc.text('NIP. 987654321', 200, ttdY + 35)

  // Tambahkan garis untuk tanda tangan
  doc.setLineWidth(0.5)
  doc.line(40, ttdY + 27, 120, ttdY + 27) // Garis tanda tangan Kepala Lab
  doc.line(200, ttdY + 27, 280, ttdY + 27) // Garis tanda tangan Kepala Sekolah

  
    // Simpan PDF
    const namaBulan = filterPencarian.bulan === 'semua' 
      ? 'semua-bulan'
      : bulanFilter.find(b => b.value === filterPencarian.bulan)?.label.toLowerCase()
      
    doc.save(`laporan-lab-${tabAktif}-${filterPencarian.tahun}-${namaBulan}.pdf`)
  }

  // Handler untuk membersihkan data
  const handleHapusData = () => {
    if (window.confirm('Anda yakin ingin menghapus semua data pemesanan?')) {
      localStorage.removeItem('pemesananLab')
      setDataPemesanan([])
      toast.success('Data pemesanan berhasil dibersihkan')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <div className="flex-1 p-6">
        {/* Header dan Tombol */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Data Pemesanan Lab</h1>
          <div className="flex gap-2">
            <button
              onClick={handleEksporPDF}
              className="btn btn-primary"
              disabled={tabAktif === 'menunggu'}
            >
              Ekspor PDF
            </button>
            <button
              onClick={handleHapusData}
              className="btn btn-error btn-outline"
            >
              Bersihkan Data
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${tabAktif === 'menunggu' ? 'tab-active' : ''}`}
            onClick={() => setTabAktif('menunggu')}
          >
            Menunggu
          </button>
          <button
            className={`tab ${tabAktif === 'disetujui' ? 'tab-active' : ''}`}
            onClick={() => setTabAktif('disetujui')}
          >
            Disetujui
          </button>
          <button
            className={`tab ${tabAktif === 'ditolak' ? 'tab-active' : ''}`}
            onClick={() => setTabAktif('ditolak')}
          >
            Ditolak
          </button>
        </div>

        {/* Bagian Filter */}
        {tabAktif !== 'menunggu' && (
          <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
            <h2 className="font-bold mb-4">Filter Pencarian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Filter Tahun */}
              <select
                className="select select-bordered w-full"
                value={filterPencarian.tahun}
                onChange={(e) => setFilterPencarian(prev => ({ ...prev, tahun: e.target.value }))}
              >
                {tahunFilter.map(tahun => (
                  <option key={tahun} value={tahun}>
                    Tahun {tahun}
                  </option>
                ))}
              </select>

              {/* Filter Bulan */}
              <select
                className="select select-bordered w-full"
                value={filterPencarian.bulan}
                onChange={(e) => setFilterPencarian(prev => ({ ...prev, bulan: e.target.value }))}
              >
                {bulanFilter.map(bulan => (
                  <option key={bulan.value} value={bulan.value}>
                    {bulan.label}
                  </option>
                ))}
              </select>

              {/* Filter Nama Guru */}
              <input
                type="text"
                placeholder="Nama Guru"
                className="input input-bordered w-full"
                value={filterPencarian.namaGuru}
                onChange={(e) => setFilterPencarian(prev => ({ ...prev, namaGuru: e.target.value }))}
              />

              {/* Filter Mata Pelajaran */}
              <select
                className="select select-bordered w-full"
                value={filterPencarian.mataPelajaran}
                onChange={(e) => setFilterPencarian(prev => ({ ...prev, mataPelajaran: e.target.value }))}
              >
                <option value="">Semua Mata Pelajaran</option>
                {MATA_PELAJARAN.map(mapel => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama}
                  </option>
                ))}
              </select>

              {/* Filter Kelas */}
              <select
                className="select select-bordered w-full"
                value={filterPencarian.kelas}
                onChange={(e) => setFilterPencarian(prev => ({ ...prev, kelas: e.target.value }))}
              >
                <option value="">Semua Kelas</option>
                {DAFTAR_KELAS.map(kelas => (
                  <option key={kelas} value={kelas}>
                    Kelas {kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tabel Data */}
        <div className="bg-base-100 rounded-lg shadow-md overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Guru</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
                <th>Jam</th>
                <th>Status</th>
                {tabAktif === 'menunggu' && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {dataPaginasi.map((item, index) => (
                <tr key={item.id}>
                  <td>{(halamanSaatIni - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>{formatTanggal(item.tanggal)}</td>
                  <td>{item.namaGuru}</td>
                  <td>{MATA_PELAJARAN.find(m => m.id === item.mataPelajaran)?.nama}</td>
                  <td>Kelas {item.kelas}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {item.jamPelajaran.map(jam => (
                        <span key={jam} className="badge badge-primary badge-sm">
                          Jam ke-{jam}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      item.status === 'menunggu' ? 'badge-warning' :
                      item.status === 'disetujui' ? 'badge-success' :
                      'badge-error'
                    }`}>
                      {item.status === 'menunggu' ? 'Menunggu' :
                       item.status === 'disetujui' ? 'Disetujui' :
                       'Ditolak'}
                    </span>
                  </td>
                  {tabAktif === 'menunggu' && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSetujui(item.id)}
                          className="btn btn-success btn-sm"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleTolak(item.id)}
                          className="btn btn-error btn-sm"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="join">
            <button 
              className="join-item btn"
              onClick={() => setHalamanSaatIni(p => Math.max(1, p - 1))}
              disabled={halamanSaatIni === 1}
            >
              «
            </button>
            <button className="join-item btn">
              Halaman {halamanSaatIni}
            </button>
            <button 
              className="join-item btn"
              onClick={() => setHalamanSaatIni(p => p + 1)}
              disabled={halamanSaatIni * ITEMS_PER_PAGE >= dataFiltered.length}
            >
              »
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardKepalaLab