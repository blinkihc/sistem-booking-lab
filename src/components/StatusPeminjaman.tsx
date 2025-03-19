interface StatusPeminjamanProps {
    status: 'menunggu' | 'disetujui' | 'ditolak'
    className?: string
  }
  
  const StatusPeminjaman = ({ status, className = '' }: StatusPeminjamanProps) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'menunggu':
          return {
            label: 'Menunggu Persetujuan',
            className: 'badge-warning',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        case 'disetujui':
          return {
            label: 'Disetujui',
            className: 'badge-success',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )
          }
        case 'ditolak':
          return {
            label: 'Ditolak',
            className: 'badge-error',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          }
      }
    }
  
    const config = getStatusConfig()
  
    return (
      <div className={`badge ${config.className} gap-1 ${className}`}>
        {config.icon}
        {config.label}
      </div>
    )
  }
  
  export default StatusPeminjaman