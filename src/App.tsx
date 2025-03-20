import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './hooks/useAuth'
import { useNavigate, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './pages/Login'
import FormPemesanan from './pages/FormPemesanan'
import Dashboard from './pages/Dashboard'
import DashboardAdmin from './pages/Admin/DashboardAdmin'
import { DashboardKepalaLab } from './pages/KepalaLab/DashboardKepalaLab'
import ProtectedRoute from './components/ProtectedRoute'


const App = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        {/* Rute untuk non-user - Dashboard Publik */}
        <Route path="/" element={<Dashboard />} />

        {/* Rute untuk login admin/kepala lab */}
        <Route 
          path="/masuk" 
          element={
            user ? <Navigate to="/redirect" replace /> : <Login />
          } 
        />

            {/* Rute untuk Pemesanan */}
        <Route path="/pemesanan/baru" element={<FormPemesanan />} />

        {/* Rute terproteksi untuk Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Rute terproteksi untuk Kepala Lab */}
        <Route
          path="/kepala-lab/*"
          element={
            <ProtectedRoute allowedRoles={['kepala_lab']}>
              <DashboardKepalaLab />
            </ProtectedRoute>
          }
        />

        {/* Rute pengalihan setelah login */}
        <Route 
          path="/redirect" 
          element={<PengalihanBerdasarkanPeran />} 
        />

        {/* Rute 404 - untuk path yang tidak ditemukan */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>

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
        theme="light"
      />
    </div>
  )
}

const PengalihanBerdasarkanPeran = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    switch (user.role) {
      case 'admin':
        navigate('/admin/dasbor')
        break
      case 'kepala_lab':
        navigate('/kepala-lab/dasbor')
        break
      default:
        navigate('/')
    }
  }, [user, navigate])

  return null
}

export default App