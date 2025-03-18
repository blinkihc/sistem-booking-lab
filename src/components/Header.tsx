import { Link } from 'react-router-dom'
import WaktuIndonesia from './WaktuIndonesia'

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/dashboard">Beranda</Link></li>
            <li><Link to="/laboratorium">Laboratorium</Link></li>
            <li><Link to="/jadwal">Jadwal</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">SistemLab</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <WaktuIndonesia />
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://placehold.co/100x100/png" alt="Avatar" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span>Selamat datang,</span>
              <span className="font-bold">blinkihc</span>
            </li>
            <div className="divider my-0"></div>
            <li><Link to="/profil">Profil Saya</Link></li>
            <li><Link to="/pengaturan">Pengaturan</Link></li>
            <li><Link to="/bantuan">Bantuan</Link></li>
            <div className="divider my-0"></div>
            <li><button className="text-error">Keluar</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header