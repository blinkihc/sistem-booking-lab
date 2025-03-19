const AksesDitolak = () => {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="card-title text-2xl mb-2">Akses Ditolak!</h2>
            <p className="mb-4">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <div className="card-actions">
              <a href="/" className="btn btn-primary">Kembali ke Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default AksesDitolak