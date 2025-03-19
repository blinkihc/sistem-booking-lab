import { Link } from 'react-router-dom'
import WaktuIndonesia from './WaktuIndonesia'
import InfoPengguna from './InfoPengguna'
import { useEffect, useState } from 'react'

const AppHeader = () => {
  const [tema, setTema] = useState<string>(() => {
    return localStorage.getItem('tema') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('tema', tema)
    document.documentElement.setAttribute('data-theme', tema)
  }, [tema])

  const toggleTema = () => {
    setTema(tema === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">SistemLab</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <WaktuIndonesia />
      </div>
      
      <div className="navbar-end">
        {/* Tombol Form Peminjaman */}
        <Link 
          to="/pemesanan/baru" 
          className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200 ease-in-out mr-4"
        >
          Form Peminjaman
        </Link>

        {/* Toggle Tema */}
        <label className="swap swap-rotate mr-4">
          <input 
            type="checkbox" 
            onChange={toggleTema}
            checked={tema === 'dark'}
            className="theme-controller"
          />
          
          {/* Ikon Matahari */}
          <svg 
            className="swap-on fill-current w-6 h-6" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <title>Mode Terang</title>
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          
          {/* Ikon Bulan */}
          <svg 
            className="swap-off fill-current w-6 h-6" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <title>Mode Gelap</title>
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        <InfoPengguna username="blinkihc" />

        <div className="dropdown dropdown-end ml-4">
          <label tabIndex={0} className="btn btn-ghost btn-circle hover:bg-base-200">
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