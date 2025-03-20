import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'

const AppHeader = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  const handleTemaChange = () => {
    const temaBaru = tema === 'light' ? 'dark' : 'light'
    setTema(temaBaru)
    localStorage.setItem('tema', temaBaru)
    document.documentElement.setAttribute('data-theme', temaBaru)
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Berhasil keluar dari sistem')
      navigate('/login')
    } catch (error) {
      toast.error('Gagal keluar dari sistem')
    }
  }


  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
          SistemLab
        </Link>
      </div>
      
      
      
      <div className="navbar-end flex items-center gap-2">
        {/* Toggle Tema */}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={tema === 'dark'}
            onChange={handleTemaChange}
            className="theme-controller"
          />
          {/* Ikon Matahari */}
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          {/* Ikon Bulan */}
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
       

        {/* Menu Pengguna */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2">
                <div className="flex flex-col">
                  <span className="font-bold">{user.name}</span>
                  <span className="text-xs opacity-70">
                    {user.role === 'admin' ? 'Administrator' : 'Kepala Lab'}
                  </span>
                </div>
              </li>
              <div className="divider my-0"></div>
              
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin">Dashboard Admin</Link></li>
                  <li><Link to="/admin/users">Kelola Pengguna</Link></li>
                </>
              )}
              
              {(user.role === 'admin' || user.role === 'kepala_lab') && (
                <li><Link to="/admin/approvals">Persetujuan Peminjaman</Link></li>
              )}
              
              <li><Link to="/pengaturan">Pengaturan</Link></li>
              <div className="divider my-0"></div>
              <li>
                <button 
                  onClick={handleLogout}
                  className="text-error hover:bg-error hover:text-white"
                >
                  Keluar dari Sistem
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link 
            to="/masuk" 
            className="btn btn-ghost btn-sm"
          >
            Masuk sebagai Admin/Kepala Lab
          </Link>
        )}
      </div>
    </div>
  )
}

export default AppHeader