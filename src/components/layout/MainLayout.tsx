import { useAuth } from '../../contexts/AuthContext'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Sistem Booking Lab</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.nama} alt="profile" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a>Profil</a></li>
              {user?.role === 'admin' && (
                <>
                  <li><a href="/admin/pengguna">Manajemen Pengguna</a></li>
                  <li><a href="/admin/laboratorium">Manajemen Lab</a></li>
                  <li><a href="/admin/pengaturan">Pengaturan</a></li>
                </>
              )}
              <li><a onClick={logout}>Keluar</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar dan Konten */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col p-4">
          {children}
        </div> 
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/pemesanan">Pemesanan Lab</a></li>
            {user?.role === 'admin' && (
              <>
                <li className="menu-title">
                  <span>Admin Menu</span>
                </li>
                <li><a href="/admin/pengguna">Manajemen Pengguna</a></li>
                <li><a href="/admin/laboratorium">Manajemen Lab</a></li>
                <li><a href="/admin/pengaturan">Pengaturan Sistem</a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MainLayout