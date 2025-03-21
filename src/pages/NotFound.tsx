import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="hero min-h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <p className="py-6 text-xl">
            Maaf, halaman yang Anda cari tidak ditemukan.
          </p>
          <Link to="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound