import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import Header from '../../components/Header'


// Registrasi Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface PemesananData {
  id: string
  namaGuru: string
  tanggal: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan'
  pengaju: string
  waktuPengajuan: string
}

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    total: 0,
    disetujui: 0,
    ditolak: 0,
    menunggu: 0,
    dibatalkan: 0
  })
  const [pemesananPerKelas, setPemesananPerKelas] = useState<Record<string, number>>({})
  const [pemesananPerMapel, setPemesananPerMapel] = useState<Record<string, number>>({})
  const [trendPemesanan, setTrendPemesanan] = useState<Record<string, number>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const dataTersimpan = localStorage.getItem('pemesananLab')
      if (!dataTersimpan) {
        setLoading(false)
        return
      }

      const pemesanan: PemesananData[] = JSON.parse(dataTersimpan)
      
      // Hitung statistik
      const stats = pemesanan.reduce((acc, curr) => ({
        total: acc.total + 1,
        disetujui: acc.disetujui + (curr.status === 'disetujui' ? 1 : 0),
        ditolak: acc.ditolak + (curr.status === 'ditolak' ? 1 : 0),
        menunggu: acc.menunggu + (curr.status === 'menunggu' ? 1 : 0),
        dibatalkan: acc.dibatalkan + (curr.status === 'dibatalkan' ? 1 : 0)
      }), {
        total: 0,
        disetujui: 0,
        ditolak: 0,
        menunggu: 0,
        dibatalkan: 0
      })

      // Hitung pemesanan per kelas
      const perKelas = pemesanan.reduce((acc, curr) => {
        acc[curr.kelas] = (acc[curr.kelas] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Hitung pemesanan per mata pelajaran
      const perMapel = pemesanan.reduce((acc, curr) => {
        acc[curr.mataPelajaran] = (acc[curr.mataPelajaran] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Hitung trend pemesanan (7 hari terakhir)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
      }).reverse()

      const trend = last7Days.reduce((acc, date) => {
        acc[date] = pemesanan.filter(p => p.tanggal === date).length
        return acc
      }, {} as Record<string, number>)

      setStatistics(stats)
      setPemesananPerKelas(perKelas)
      setPemesananPerMapel(perMapel)
      setTrendPemesanan(trend)
    } catch (error) {
      console.error('Gagal memuat data:', error)
      toast.error('Gagal memuat data statistik')
    } finally {
      setLoading(false)
    }
  }

  const statusChartData = {
    labels: ['Disetujui', 'Ditolak', 'Menunggu', 'Dibatalkan'],
    datasets: [{
      data: [
        statistics.disetujui,
        statistics.ditolak,
        statistics.menunggu,
        statistics.dibatalkan
      ],
      backgroundColor: [
        '#36D399', // success
        '#F87272', // error
        '#FBBD23', // warning
        '#6B7280', // neutral
      ]
    }]
  }

  const trendChartData = {
    labels: Object.keys(trendPemesanan),
    datasets: [{
      label: 'Jumlah Pemesanan',
      data: Object.values(trendPemesanan),
      backgroundColor: '#3ABFF8'
    }]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
    
    <div className="p-6">
      {/* Tombol Pengaturan */}
<div className="flex justify-end mb-6">
  <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Pengaturan
    </label>
    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <Link to="/admin/pengaturan/cetakan" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Pengaturan Cetakan
        </Link>
      </li>
    </ul>
  </div>
</div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {/* Statistik Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Pemesanan</div>
            <div className="stat-value text-primary">{statistics.total}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Disetujui</div>
            <div className="stat-value text-success">{statistics.disetujui}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Menunggu</div>
            <div className="stat-value text-warning">{statistics.menunggu}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Ditolak</div>
            <div className="stat-value text-error">{statistics.ditolak}</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Status Pemesanan</h2>
            <div className="h-[300px] flex justify-center items-center">
              <Pie 
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Trend Pemesanan (7 Hari Terakhir)</h2>
            <div className="h-[300px] flex justify-center items-center">
              <Bar 
                data={trendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data per Kelas dan Mapel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Pemesanan per Kelas</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Kelas</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pemesananPerKelas).map(([kelas, jumlah]) => (
                    <tr key={kelas}>
                      <td>Kelas {kelas}</td>
                      <td>{jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Pemesanan per Mata Pelajaran</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Mata Pelajaran</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pemesananPerMapel).map(([mapel, jumlah]) => (
                    <tr key={mapel}>
                      <td>{mapel}</td>
                      <td>{jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default DashboardAdmin