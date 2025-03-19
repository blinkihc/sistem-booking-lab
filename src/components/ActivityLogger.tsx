import { useState, useEffect } from 'react'
import { ActivityLog } from '../types/auth'
import { useAuth } from '../hooks/useAuth'

const ActivityLogger = () => {
  const { hasPermission } = useAuth()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs')
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Gagal mengambil log aktivitas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission('view:logs')) {
    return <div>Anda tidak memiliki akses ke halaman ini</div>
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex justify-between items-center">
          Log Aktivitas
          <button 
            onClick={fetchLogs}
            className="btn btn-square btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pengguna</th>
                  <th>Aksi</th>
                  <th>Detail</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                    <td>{log.username}</td>
                    <td>
                      <span className={`badge ${
                        log.action === 'LOGIN' ? 'badge-success' :
                        log.action === 'LOGOUT' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.details}</td>
                    <td className="font-mono text-sm">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLogger