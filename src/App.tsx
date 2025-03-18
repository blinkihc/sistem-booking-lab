import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WaktuProvider } from './context/WaktuContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import DaftarLab from './pages/DaftarLab'
import DetailLab from './pages/DetailLab'
import FormPemesanan from './pages/FormPemesanan'
import RiwayatPemesanan from './pages/RiwayatPemesanan'
import DetailPemesanan from './pages/DetailPemesanan'
import Profil from './pages/Profil'
import Pengaturan from './pages/Pengaturan'
import Bantuan from './pages/Bantuan'
import Kontak from './pages/Kontak'
import AdminDashboard from './pages/Admin/Dashboard'

function App() {
  return (
    <WaktuProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/laboratorium" element={<DaftarLab />} />
            <Route path="/laboratorium/:id" element={<DetailLab />} />
            <Route path="/pemesanan/baru" element={<FormPemesanan />} />
            <Route path="/pemesanan/:id" element={<DetailPemesanan />} />
            <Route path="/riwayat" element={<RiwayatPemesanan />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="/bantuan" element={<Bantuan />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </Router>
    </WaktuProvider>
  )
}

export default App