import { Link } from 'react-router-dom'

const HeaderDashboard = () => {
  return (
    <div className="navbar bg-base-100 rounded-box shadow-sm mb-4">
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex-none">
          <h2 className="text-xl font-semibold">Statistik Peminjaman Lab</h2>
        </div>
        
        {/* Tombol Pinjam Lab */}
        <div className="flex-none">
          <Link 
            to="/pemesanan/baru"
            className="btn btn-primary btn-sm gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Pinjam Lab
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeaderDashboard