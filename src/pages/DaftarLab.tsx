import { useState, useEffect } from 'react'
import { useLabConfig } from '../hooks/useLabConfig'
import FilterLaboratorium from '../components/FilterLaboratorium'
import type { Laboratorium, FilterLab } from '../types/laboratorium'

const DaftarLab = () => {
  const { getStatusBadge, getKategoriLab, getFasilitasLab } = useLabConfig()
  const [loading, setLoading] = useState(true)
  const [laboratorium, setLaboratorium] = useState<Laboratorium[]>([])
  const [filter, setFilter] = useState<FilterLab>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Di sini Anda akan memanggil API dengan filter
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Data dummy
        setLaboratorium([
          {
            id: 'LAB-001',
            nama: 'Lab Komputer A1',
            kategoriId: 'komputer',
            lokasi: 'Gedung A',
            lantai: 1,
            kapasitas: 30,
            fasilitas: ['komputer', 'proyektor', 'ac'],
            status: 'tersedia',
            gambar: ['https://placehold.co/600x400/png'],
            createdAt: '2025-03-18T18:27:47Z',
            updatedAt: '2025-03-18T18:27:47Z'
          }
          // ... data lab lainnya
        ])
      } catch (error) {
        console.error('Gagal memuat data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filter])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Filter */}
      <div className="md:col-span-1">
        <FilterLaboratorium onFilter={setFilter} />
      </div>

      {/* Daftar Lab */}
      <div className="md:col-span-3">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {laboratorium.map((lab) => {
              const status = getStatusBadge(lab.status)
              const kategori = getKategoriLab(lab.kategoriId)
              const fasilitas = getFasilitasLab(lab.fasilitas)

              return (
                <div key={lab.id} className="card bg-base-100 shadow-xl">
                  <figure>
                    <img 
                      src={lab.gambar[0]} 
                      alt={lab.nama}
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {lab.nama}
                      <span className={status.className}>
                        {status.label}
                      </span>
                    </h2>
                    <p>{kategori?.nama}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {fasilitas.map((fas, index) => (
                        <span key={index} className="badge badge-outline">
                          {fas?.nama}
                        </span>
                      ))}
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-ghost btn-sm">
                        Detail
                      </button>
                      {lab.status === 'tersedia' && (
                        <button className="btn btn-primary btn-sm">
                          Pesan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DaftarLab