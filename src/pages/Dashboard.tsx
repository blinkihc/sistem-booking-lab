import HeaderDashboard from '../components/dashboard/HeaderDashboard'
import StatistikPeminjaman from '../components/dashboard/StatistikPeminjaman'
import TabelPeminjaman from '../components/dashboard/TabelPeminjaman'

const Dashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <HeaderDashboard />
      <StatistikPeminjaman />
      <TabelPeminjaman />
    </div>
  )
}

export default Dashboard