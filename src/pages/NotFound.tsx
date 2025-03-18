import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="hero min-h-[calc(100vh-200px)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="py-6">Maaf, halaman yang Anda cari tidak ditemukan.</p>
          <Link to="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound