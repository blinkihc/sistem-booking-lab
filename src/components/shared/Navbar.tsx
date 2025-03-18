import { Link } from 'react-router-dom'
import { CONFIG } from '../../config/appConfig'

const Navbar = () => {
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      {/* Logo dan Nama Aplikasi */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          {CONFIG.namaAplikasi}
        </Link>
      </div>

      {/* Menu Navigasi */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li><Link to="/laboratorium">Laboratorium</Link></li>
          <li><Link to="/jadwal">Jadwal</Link></li>
          <li><Link to="/pemesanan">Pemesanan</Link></li>
        </ul>

        {/* Dropdown Profil */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img 
                src={`https://ui-avatars.com/api/?name=${CONFIG.userLogin}&background=random`} 
                alt="Avatar Pengguna" 
              />
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link to="/profil" className="justify-between">
                Profil
                <span className="badge badge-sm">{CONFIG.userLogin}</span>
              </Link>
            </li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/pengaturan">Pengaturan</Link></li>
            <div className="divider my-1"></div>
            <li><Link to="/logout" className="text-error">Keluar</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar