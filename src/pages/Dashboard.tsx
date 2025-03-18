import { Link } from 'react-router-dom'
import { CONFIG } from '../config/appConfig'

const Dashboard = () => {
  const stats = [
    { title: "Total Pemesanan", value: "15", desc: "Bulan ini" },
    { title: "Menunggu Persetujuan", value: "3", desc: "Perlu ditindak" },
    { title: "Lab Tersedia", value: "8", desc: "Dari 10 lab" },
    { title: "Lab Maintenance", value: "2", desc: "Sedang diperbaiki" }
  ]

  const pemesananTerbaru = [
    { id: 1, lab: "Lab Komputer A1", tanggal: "2025-03-19", status: "menunggu" },
    { id: 2, lab: "Lab Fisika B2", tanggal: "2025-03-20", status: "disetujui" },
    { id: 3, lab: "Lab Kimia C3", tanggal: "2025-03-21", status: "ditolak" }
  ]

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Selamat Datang, {CONFIG.userLogin}</h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <Link to="/pemesanan/baru" className="btn btn-primary">
          Buat Pemesanan Baru
        </Link>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Pemesanan Terbaru */}
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Pemesanan Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Laboratorium</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pemesananTerbaru.map((pemesanan) => (
                <tr key={pemesanan.id}>
                  <td>{pemesanan.id}</td>
                  <td>{pemesanan.lab}</td>
                  <td>{new Date(pemesanan.tanggal).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className={`badge ${
                      pemesanan.status === 'menunggu' ? 'badge-warning' :
                      pemesanan.status === 'disetujui' ? 'badge-success' :
                      'badge-error'
                    }`}>
                      {pemesanan.status}
                    </div>
                  </td>
                  <td>
                    <Link 
                      to={`/pemesanan/${pemesanan.id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Jadwal Laboratorium
            </h3>
            <p>Lihat jadwal penggunaan lab hari ini</p>
            <div className="card-actions justify-end">
              <Link to="/jadwal" className="btn btn-primary btn-sm">
                Lihat Jadwal
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Status Lab
            </h3>
            <p>Cek ketersediaan laboratorium</p>
            <div className="card-actions justify-end">
              <Link to="/laboratorium" className="btn btn-primary btn-sm">
                Cek Status
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Riwayat Pemesanan
            </h3>
            <p>Lihat riwayat pemesanan Anda</p>
            <div className="card-actions justify-end">
              <Link to="/riwayat" className="btn btn-primary btn-sm">
                Lihat Riwayat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard