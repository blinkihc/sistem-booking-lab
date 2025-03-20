import AppHeader from '../components/AppHeader'
import HeaderDashboard from '../components/dashboard/HeaderDashboard'
import StatistikPeminjaman from '../components/dashboard/StatistikPeminjaman'
import TabelPeminjaman from '../components/dashboard/TabelPeminjaman'
import Footer from '../components/dashboard/Footer'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="p-4 space-y-4">
        <HeaderDashboard />
        <StatistikPeminjaman />
        <TabelPeminjaman />
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard