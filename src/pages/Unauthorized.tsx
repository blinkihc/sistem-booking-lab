import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="hero min-h-[80vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-bold text-error">403</h1>
          <h2 className="text-2xl font-bold mt-4">Akses Ditolak</h2>
          <p className="py-6">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <Link to="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized