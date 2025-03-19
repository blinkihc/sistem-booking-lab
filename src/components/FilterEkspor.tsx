import { useState } from 'react'

interface FilterEksporProps {
  onExport: (filter: ExportFilter) => void
  tipe: 'peminjaman' | 'pengguna'
  onClose: () => void
}

interface ExportFilter {
  tanggalMulai?: string
  tanggalAkhir?: string
  status?: string[]
  peran?: string[]
}

const FilterEkspor = ({ onExport, tipe, onClose }: FilterEksporProps) => {
  const [filter, setFilter] = useState<ExportFilter>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExport(filter)
    onClose()
  }

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Filter Data Ekspor</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {tipe === 'peminjaman' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal Mulai</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  onChange={(e) => setFilter({
                    ...filter,
                    tanggalMulai: e.target.value
                  })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal Akhir</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  onChange={(e) => setFilter({
                    ...filter,
                    tanggalAkhir: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['menunggu', 'disetujui', 'ditolak'].map((status) => (
                  <label key={status} className="cursor-pointer label gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      onChange={(e) => {
                        const currentStatus = filter.status || []
                        setFilter({
                          ...filter,
                          status: e.target.checked
                            ? [...currentStatus, status]
                            : currentStatus.filter(s => s !== status)
                        })
                      }}
                    />
                    <span className="label-text">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {tipe === 'pengguna' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Peran</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'guru', label: 'Guru' },
                { id: 'kepala_lab', label: 'Kepala Lab' },
                { id: 'admin', label: 'Admin' }
              ].map(({ id, label }) => (
                <label key={id} className="cursor-pointer label gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    onChange={(e) => {
                      const currentPeran = filter.peran || []
                      setFilter({
                        ...filter,
                        peran: e.target.checked
                          ? [...currentPeran, id]
                          : currentPeran.filter(p => p !== id)
                      })
                    }}
                  />
                  <span className="label-text">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Ekspor Data
          </button>
        </div>
      </form>
    </div>
  )
}

export default FilterEkspor