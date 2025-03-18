import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Statistik {
  totalPemesanan: number
  menungguPersetujuan: number
  labTersedia: number
  labMaintenance: number
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Statistik>({
    totalPemesanan: 0,
    menungguPersetujuan: 0,
    labTersedia: 0,
    labMaintenance: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats({
          totalPemesanan: 150,
          menungguPersetujuan: 5,
          labTersedia: 8,
          labMaintenance: 2
        })
      } catch (error) {
        console.error('Gagal memuat data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Admin</h2>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Pemesanan</div>
          <div className="stat-value">{stats.totalPemesanan}</div>
          <div className="stat-desc">Bulan ini</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Menunggu Persetujuan</div>
          <div className="stat-value text-warning">{stats.menungguPersetujuan}</div>
          <div className="stat-desc">Perlu ditindak</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Lab Tersedia</div>
          <div className="stat-value text-success">{stats.labTersedia}</div>
          <div className="stat-desc">Dari 10 lab</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Lab Maintenance</div>
          <div className="stat-value text-error">{stats.labMaintenance}</div>
          <div className="stat-desc">Perlu perbaikan</div>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/pemesanan" className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Kelola Pemesanan
            </h3>
            <p>Persetujuan dan manajemen pemesanan lab</p>
          </div>
        </Link>

        <Link to="/admin/laboratorium" className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Kelola Laboratorium
            </h3>
            <p>Pengaturan dan maintenance lab</p>
          </div>
        </Link>

        <Link to="/admin/pengguna" className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body">
            <h3 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Kelola Pengguna
            </h3>
            <p>Manajemen akun pengguna</p>
          </div>
        </Link>
      </div>

      {/* Tabel Pemesanan Terbaru */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-xl font-semibold mb-4">Pemesanan Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pemohon</th>
                  <th>Laboratorium</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono">PMN-001</td>
                  <td>Budi Santoso</td>
                  <td>Lab Komputer A1</td>
                  <td>2025-03-19</td>
                  <td>
                    <span className="badge badge-warning">Menunggu</span>
                  </td>
                  <td>
                    <Link to="/admin/pemesanan/PMN-001" className="btn btn-sm btn-ghost">
                      Detail
                    </Link>
                  </td>
                </tr>
                {/* Tambahkan baris lain sesuai kebutuhan */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard