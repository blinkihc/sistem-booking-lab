import { useState } from 'react'
import { Link } from 'react-router-dom'

interface FAQ {
  pertanyaan: string
  jawaban: string
  kategori: 'umum' | 'pemesanan' | 'laboratorium' | 'teknis'
}

const Bantuan = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('semua')

  // Data FAQ
  const faqs: FAQ[] = [
    {
      pertanyaan: "Bagaimana cara melakukan pemesanan laboratorium?",
      jawaban: "Untuk memesan laboratorium, ikuti langkah berikut:\n1. Login ke akun Anda\n2. Pilih menu 'Daftar Laboratorium'\n3. Pilih laboratorium yang tersedia\n4. Klik tombol 'Pesan Sekarang'\n5. Isi formulir pemesanan\n6. Tunggu konfirmasi dari admin",
      kategori: "pemesanan"
    },
    {
      pertanyaan: "Berapa lama proses persetujuan pemesanan?",
      jawaban: "Proses persetujuan pemesanan biasanya memakan waktu 1x24 jam kerja. Anda akan mendapatkan notifikasi setelah pemesanan disetujui atau ditolak.",
      kategori: "pemesanan"
    },
    {
      pertanyaan: "Apa yang harus dilakukan jika terjadi kerusakan peralatan?",
      jawaban: "Jika terjadi kerusakan peralatan:\n1. Segera laporkan ke petugas laboratorium\n2. Isi formulir laporan kerusakan\n3. Dokumentasikan kerusakan jika memungkinkan\n4. Tunggu instruksi lebih lanjut dari petugas",
      kategori: "laboratorium"
    },
    {
      pertanyaan: "Bagaimana cara mengubah password akun?",
      jawaban: "Untuk mengubah password:\n1. Masuk ke menu 'Pengaturan'\n2. Pilih tab 'Keamanan'\n3. Klik 'Ubah Password'\n4. Ikuti instruksi yang diberikan",
      kategori: "teknis"
    }
  ]

  // Filter FAQ berdasarkan pencarian dan kategori
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.jawaban.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'semua' || faq.kategori === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Pusat Bantuan</h2>
        <p className="text-gray-600 mt-2">
          Temukan jawaban untuk pertanyaan umum seputar penggunaan sistem
        </p>
      </div>

      {/* Pencarian */}
      <div className="form-control w-full max-w-xl mx-auto mb-8">
        <div className="relative">
          <input 
            type="text"
            placeholder="Cari bantuan..."
            className="input input-bordered w-full pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          className={`btn btn-sm ${selectedCategory === 'semua' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory('semua')}
        >
          Semua
        </button>
        <button 
          className={`btn btn-sm ${selectedCategory === 'umum' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory('umum')}
        >
          Umum
        </button>
        <button 
          className={`btn btn-sm ${selectedCategory === 'pemesanan' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory('pemesanan')}
        >
          Pemesanan
        </button>
        <button 
          className={`btn btn-sm ${selectedCategory === 'laboratorium' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory('laboratorium')}
        >
          Laboratorium
        </button>
        <button 
          className={`btn btn-sm ${selectedCategory === 'teknis' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSelectedCategory('teknis')}
        >
          Teknis
        </button>
      </div>

      {/* Daftar FAQ */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="font-semibold text-lg">Tidak Ada Hasil</h3>
            <p className="text-gray-600">
              Tidak ditemukan bantuan yang sesuai dengan pencarian Anda
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="collapse collapse-plus bg-base-100 shadow-lg">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                {faq.pertanyaan}
              </div>
              <div className="collapse-content">
                <p className="whitespace-pre-line text-gray-600">
                  {faq.jawaban}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Kontak Bantuan */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-center mb-4">
          Masih Butuh Bantuan?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-semibold">Email</h4>
              <p className="text-sm">bantuan@lab.ac.id</p>
              <Link to="mailto:bantuan@lab.ac.id" className="btn btn-sm btn-ghost mt-2">
                Kirim Email
              </Link>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h4 className="font-semibold">Telepon</h4>
              <p className="text-sm">0812-3456-7890</p>
              <Link to="tel:081234567890" className="btn btn-sm btn-ghost mt-2">
                Hubungi
              </Link>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h4 className="font-semibold">Live Chat</h4>
              <p className="text-sm">08:00 - 16:00 WIB</p>
              <button className="btn btn-sm btn-ghost mt-2">
                Mulai Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dokumen Panduan */}
      <div className="alert alert-info mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Dokumen Panduan</h3>
          <div className="text-sm">
            Unduh panduan lengkap penggunaan sistem dalam format PDF
            <div className="mt-2">
              <Link to="/docs/panduan-pengguna.pdf" className="btn btn-sm btn-ghost">
                Unduh Panduan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bantuan