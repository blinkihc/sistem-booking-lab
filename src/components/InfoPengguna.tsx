import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const InfoPengguna = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama)}&background=random`}
            alt={user.nama}
          />
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li className="menu-title px-4 py-2">
          <div className="flex flex-col">
            <span className="font-bold">{user.nama}</span>
            <span className="text-xs opacity-70">
              {user.role === 'admin' ? 'Administrator' : 'Kepala Lab'}
            </span>
          </div>
        </li>
        <div className="divider my-0"></div>
        
        {user.role === 'admin' && (
          <li><Link to="/admin">Dashboard Admin</Link></li>
        )}
        
        {user.role === 'kepala_lab' && (
          <li><Link to="/admin/approvals">Persetujuan Peminjaman</Link></li>
        )}
        
        <li><Link to="/profile">Profil Saya</Link></li>
        <li><Link to="/pengaturan">Pengaturan</Link></li>
        <div className="divider my-0"></div>
        <li>
          <button className="text-error">
            Keluar
          </button>
        </li>
      </ul>
    </div>
  )
}

export default InfoPengguna