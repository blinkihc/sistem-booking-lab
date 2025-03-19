import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WaktuProvider } from './contexts/WaktuContext'
import { AuthProvider } from './providers/AuthProvider'
import { ToastContainer } from 'react-toastify' // Untuk notifikasi
import 'react-toastify/dist/ReactToastify.css'


// Komponen yang sudah ada
import AppHeader from './components/AppHeader'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import DaftarLab from './pages/DaftarLab'
import DetailLab from './pages/DetailLab'
import FormPemesanan from './pages/FormPemesanan'
import RiwayatPemesanan from './pages/RiwayatPemesanan'
import DetailPemesanan from './pages/DetailPemesanan'
import Profile from './pages/Profile'
import Pengaturan from './pages/Pengaturan'
import Bantuan from './pages/Bantuan'
import Kontak from './pages/Kontak'
import AdminDashboard from './pages/Admin/Dashboard'

// Komponen baru untuk manajemen peran
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized' // Ensure this file exists and is correctly named
import ActivityLogs from './pages/Admin/ActivityLogs'
import ApprovalPeminjaman from './pages/Admin/ApprovalPeminjaman'
import UserManagement from './pages/Admin/UserManagement'

const App = () => {
  // Inisialisasi tema saat aplikasi dimuat
  useEffect(() => {
    const temaTersimpan = localStorage.getItem('tema') || 'light'
    document.documentElement.setAttribute('data-theme', temaTersimpan)
  }, [])

  return (
    <AuthProvider>
      <WaktuProvider>
        <Router>
          <div className="min-h-screen bg-base-200">
            <AppHeader />
            <Routes>
              {/* Rute Publik */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Rute yang dilindungi - Umum */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/laboratorium" element={
                <ProtectedRoute>
                  <DaftarLab />
                </ProtectedRoute>
              } />
              <Route path="/laboratorium/:id" element={
                <ProtectedRoute>
                  <DetailLab />
                </ProtectedRoute>
              } />

              {/* Rute Pemesanan - Guru */}
              <Route path="/pemesanan/baru" element={
                <ProtectedRoute requiredPermission="create:peminjaman">
                  <FormPemesanan />
                </ProtectedRoute>
              } />
              <Route path="/pemesanan/:id" element={
                <ProtectedRoute requiredPermission="view:peminjaman_sendiri">
                  <DetailPemesanan />
                </ProtectedRoute>
              } />
              <Route path="/riwayat" element={
                <ProtectedRoute requiredPermission="view:peminjaman_sendiri">
                  <RiwayatPemesanan />
                </ProtectedRoute>
              } />

              {/* Rute Profil dan Pengaturan */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/pengaturan" element={
                <ProtectedRoute>
                  <Pengaturan />
                </ProtectedRoute>
              } />
              <Route path="/bantuan" element={<Bantuan />} />
              <Route path="/kontak" element={<Kontak />} />

              {/* Rute Admin */}
              <Route path="/admin" element={
                <ProtectedRoute requiredPermission="view:admin_dashboard">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/logs" element={
                <ProtectedRoute requiredPermission="view:logs">
                  <ActivityLogs />
                </ProtectedRoute>
              } />
              <Route path="/admin/approvals" element={
                <ProtectedRoute requiredPermission="approve:peminjaman">
                  <ApprovalPeminjaman />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredPermission="manage:users">
                  <UserManagement />
                </ProtectedRoute>
              } />

              {/* Rute 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            
            {/* Notifikasi Toast */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'}
            />
          </div>
        </Router>
      </WaktuProvider>
    </AuthProvider>
  )
}

export default App