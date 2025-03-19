import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'
import FilterEkspor from '../components/FilterEkspor'
import StatusPeminjaman from '../components/StatusPeminjaman'
import { formatDateForExport, exportToExcel } from '../utils/exportData'

interface Peminjaman {
  id: string
  pengajar: string
  tanggal: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  status: 'menunggu' | 'disetujui' | 'ditolak'
  keterangan: string
  createdAt: string
}

interface ExportFilter {
  tanggalMulai?: string
  tanggalAkhir?: string
  status?: string[]
}

const ApprovalPeminjaman = () => {
  const { hasPermission } = useAuth()
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilterEkspor, setShowFilterEkspor] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [alasanPenolakan, setAlasanPenolakan] = useState('')
  const [refreshKey, setRefreshKey] = useState(0) // Untuk memaksa refresh data

  // Memindahkan fetchPeminjaman ke useCallback
  const fetchPeminjaman = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/peminjaman?status=menunggu')
      if (!response.ok) throw new Error('Gagal mengambil data')
      const data = await response.json()
      setPeminjaman(data)
    } catch (error) {
      toast.error('Gagal memuat data peminjaman')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPeminjaman()
  }, [fetchPeminjaman, refreshKey])

  const handleApproval = async (id: string, status: 'disetujui' | 'ditolak') => {
    try {
      const response = await fetch(`/api/peminjaman/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          keterangan: status === 'ditolak' ? alasanPenolakan : ''
        })
      })

      if (!response.ok) throw new Error('Gagal memperbarui status')

      toast.success(
        status === 'disetujui' 
          ? 'Peminjaman berhasil disetujui' 
          : 'Peminjaman berhasil ditolak'
      )
      
      setRefreshKey(prev => prev + 1) // Memicu refresh data
      setSelectedId(null)
      setAlasanPenolakan('')
    } catch (error) {
      toast.error('Gagal memperbarui status peminjaman')
      console.error(error)
    }
  }

  const handleExport = useCallback((filter: ExportFilter) => {
    try {
      let dataToExport = [...peminjaman]

      if (filter.tanggalMulai) {
        dataToExport = dataToExport.filter(p => 
          new Date(p.tanggal) >= new Date(filter.tanggalMulai!)
        )
      }

      if (filter.tanggalAkhir) {
        dataToExport = dataToExport.filter(p => 
          new Date(p.tanggal) <= new Date(filter.tanggalAkhir!)
        )
      }

      if (filter.status?.length) {
        dataToExport = dataToExport.filter(p => 
          filter.status!.includes(p.status)
        )
      }

      const formattedData = dataToExport.map(p => ({
        'Tanggal': formatDateForExport(p.tanggal),
        'Pengajar': p.pengajar,
        'Kelas': p.kelas,
        'Mata Pelajaran': p.mataPelajaran,
        'Jam Pelajaran': p.jamPelajaran.join(', '),
        'Status': p.status.charAt(0).toUpperCase() + p.status.slice(1),
        'Keterangan': p.keterangan,
        'Dibuat Pada': formatDateForExport(p.createdAt)
      }))

      const filename = `Laporan_Peminjaman_${new Date().toISOString().split('T')[0]}`
      
      exportToExcel(formattedData, {
        filename,
        sheetName: 'Data Peminjaman'
      })

      toast.success('Data berhasil diekspor ke Excel')
      setShowFilterEkspor(false)
    } catch (error) {
      toast.error('Gagal mengekspor data')
      console.error(error)
    }
  }, [peminjaman])

  if (!hasPermission('approve:peminjaman')) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4 stroke-current text-error">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Akses Ditolak</h3>
          <p className="text-base-content/70">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Bagian header card dengan judul dan tombol aksi */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">
              Persetujuan Peminjaman Lab
              <div className="badge badge-primary">{peminjaman.length}</div>
            </h2>
  
            <div className="flex gap-2">
              {/* Tambahkan dropdown ekspor di sini */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Ekspor
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={() => setShowFilterEkspor(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                      </svg>
                      Ekspor dengan Filter
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleExport({})}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5" />
                      </svg>
                      Ekspor Semua Data
                    </button>
                  </li>
                </ul>
              </div>
  
              {/* Tombol refresh yang sudah ada */}
              <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="btn btn-ghost btn-sm"
                aria-label="Muat ulang data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : peminjaman.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Permintaan</h3>
              <p className="text-base-content/70">
                Saat ini tidak ada peminjaman yang perlu disetujui
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Pengajar</th>
                    <th>Kelas</th>
                    <th>Mata Pelajaran</th>
                    <th>Jam</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {peminjaman.map((p) => (
                    <tr key={p.id}>
                      <td className="whitespace-nowrap">
                        {new Date(p.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td>{p.pengajar}</td>
                      <td>{p.kelas}</td>
                      <td>{p.mataPelajaran}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {p.jamPelajaran.map(jam => (
                            <span key={jam} className="badge badge-sm badge-ghost">
                              Jam {jam}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <StatusPeminjaman status={p.status} />
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproval(p.id, 'disetujui')}
                            className="btn btn-success btn-sm"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => setSelectedId(p.id)}
                            className="btn btn-error btn-sm"
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Filter Ekspor */}
      <dialog className={`modal ${showFilterEkspor ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <FilterEkspor
            tipe="peminjaman"
            onExport={handleExport}
            onClose={() => setShowFilterEkspor(false)}
          />
        </div>
      </dialog>

      {/* Modal Konfirmasi Penolakan */}
      <dialog className={`modal ${selectedId ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Konfirmasi Penolakan
          </h3>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Alasan Penolakan</span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-24"
              value={alasanPenolakan}
              onChange={(e) => setAlasanPenolakan(e.target.value)}
              placeholder="Tuliskan alasan penolakan peminjaman..."
              required
            ></textarea>
          </div>

          <div className="modal-action">
            <button 
              className="btn btn-ghost"
              onClick={() => {
                setSelectedId(null)
                setAlasanPenolakan('')
              }}
            >
              Batal
            </button>
            <button
              className="btn btn-error"
              onClick={() => selectedId && handleApproval(selectedId, 'ditolak')}
              disabled={!alasanPenolakan.trim()}
            >
              Konfirmasi Penolakan
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default ApprovalPeminjaman