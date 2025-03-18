import { Link } from 'react-router-dom'
import WaktuSekarang from './WaktuSekarang'
import InfoPengguna from './InfoPengguna'

const AppHeader = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">SistemLab</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <WaktuSekarang />
      </div>
      
      <div className="navbar-end">
        <InfoPengguna username="blinkihc" />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/profil">Profil</Link></li>
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

export default AppHeader