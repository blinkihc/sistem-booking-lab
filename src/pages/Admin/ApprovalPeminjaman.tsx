import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { exportToExcel, formatDateForExport } from '../../utils/exportData'

interface Peminjaman {
  id: string
  tanggal: string
  pengajar: string
  kelas: string
  mataPelajaran: string
  jamPelajaran: number[]
  keterangan: string
  status: 'menunggu' | 'disetujui' | 'ditolak'
  createdAt: string
}

const ApprovalPeminjaman = () => {
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [alasanPenolakan, setAlasanPenolakan] = useState('')

  useEffect(() => {
    fetchPeminjaman()
  }, [])

  const fetchPeminjaman = async () => {
    try {
      setLoading(true)
      // Implementasi fetch data dari API
      const response = await fetch('/api/peminjaman?status=menunggu')
      const data = await response.json()
      setPeminjaman(data)
    } catch (error) {
      toast.error('Gagal memuat data peminjaman')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (id: string, status: 'disetujui' | 'ditolak') => {
    try {
      const response = await fetch(`/api/peminjaman/${id}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          alasanPenolakan: status === 'ditolak' ? alasanPenolakan : ''
        })
      })

      if (response.ok) {
        toast.success(
          status === 'disetujui' 
            ? 'Peminjaman berhasil disetujui' 
            : 'Peminjaman berhasil ditolak'
        )
        fetchPeminjaman()
        setSelectedId(null)
        setAlasanPenolakan('')
      } else {
        throw new Error('Gagal memperbarui status')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memproses persetujuan')
    }
  }

  const handleExport = () => {
    const dataForExport = peminjaman.map(p => ({
      'Tanggal': formatDateForExport(p.tanggal),
      'Pengajar': p.pengajar,
      'Kelas': p.kelas,
      'Mata Pelajaran': p.mataPelajaran,
      'Jam Pelajaran': p.jamPelajaran.join(', '),
      'Keterangan': p.keterangan,
      'Status': p.status,
      'Dibuat Pada': formatDateForExport(p.createdAt)
    }))

    exportToExcel(dataForExport, {
      filename: `Laporan_Peminjaman_${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Data Peminjaman'
    })

    toast.success('Data berhasil diekspor ke Excel')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">
              Persetujuan Peminjaman Laboratorium
              <div className="badge badge-primary">{peminjaman.length}</div>
            </h2>

            <div className="flex gap-2">
              {/* Tombol Ekspor */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Ekspor
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={handleExport}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                      </svg>
                      Ekspor ke Excel
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tombol Muat Ulang yang sudah ada */}
              <button 
                onClick={fetchPeminjaman}
                className="btn btn-ghost btn-sm"
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
                    <th>Keterangan</th>
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
                            <span key={jam} className="badge badge-ghost badge-sm">
                              Jam {jam}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs truncate">
                          {p.keterangan}
                        </div>
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

      {/* Modal Konfirmasi Penolakan */}
      <dialog id="modal_penolakan" className={`modal ${selectedId ? 'modal-open' : ''}`}>
        <form method="dialog" className="modal-box">
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
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSelectedId(null)
                setAlasanPenolakan('')
              }}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={() => selectedId && handleApproval(selectedId, 'ditolak')}
              disabled={!alasanPenolakan.trim()}
            >
              Konfirmasi Penolakan
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default ApprovalPeminjaman