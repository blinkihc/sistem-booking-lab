import { useState } from 'react'

const Kontak = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Mengirim pesan:', formData)
      alert('Pesan berhasil dikirim!')
      setFormData({ nama: '', email: '', subjek: '', pesan: '' })
    } catch (error) {
      console.error('Gagal mengirim pesan:', error)
      alert('Gagal mengirim pesan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Hubungi Kami</h2>
        <p className="text-gray-600 mt-2">
          Punya pertanyaan atau masukan? Silakan hubungi kami
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informasi Kontak */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Alamat
              </h3>
              <p>Jl. Contoh No. 123</p>
              <p>Kota Contoh, 12345</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Telepon & Email
              </h3>
              <p>Telepon: (021) 1234-5678</p>
              <p>Email: info@labsys.ac.id</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Jam Operasional
              </h3>
              <p>Senin - Jumat: 08:00 - 16:00 WIB</p>
              <p>Sabtu: 08:00 - 12:00 WIB</p>
              <p>Minggu & Hari Libur: Tutup</p>
            </div>
          </div>
        </div>

        {/* Form Kontak */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Kirim Pesan</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Lengkap</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered w-full" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subjek</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={formData.subjek}
                  onChange={(e) => setFormData({...formData, subjek: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pesan</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-32" 
                  value={formData.pesan}
                  onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Peta Lokasi */}
      <div className="mt-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold mb-4">Lokasi Kami</h3>
            <div className="aspect-video">
              {/* Ganti dengan komponen peta yang sesuai */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Peta Lokasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">Pertanyaan Umum</h3>
          <p className="text-gray-600">Jawaban untuk pertanyaan yang sering ditanyakan</p>
        </div>

        <div className="space-y-4">
          <div className="collapse collapse-plus bg-base-100 shadow">
            <input type="radio" name="faq" /> 
            <div className="collapse-title text-lg font-medium">
              Bagaimana cara menghubungi admin laboratorium?
            </div>
            <div className="collapse-content">
              <p>Anda dapat menghubungi admin laboratorium melalui:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Email: admin@labsys.ac.id</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Datang langsung ke ruang admin pada jam kerja</li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 shadow">
            <input type="radio" name="faq" /> 
            <div className="collapse-title text-lg font-medium">
              Berapa lama waktu respon untuk pesan yang dikirim?
            </div>
            <div className="collapse-content">
              <p>Kami akan merespon pesan Anda dalam waktu 1x24 jam pada hari kerja.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Kontak