import { useState } from 'react'
import { useLabConfig } from '../hooks/useLabConfig'
import type { FilterLab } from '../types/laboratorium'

interface FilterLaboratoriumProps {
  onFilter: (filter: FilterLab) => void
}

const FilterLaboratorium = ({ onFilter }: FilterLaboratoriumProps) => {
  const { kategori, fasilitas, status } = useLabConfig()
  const [filter, setFilter] = useState<FilterLab>({})

  const handleFilter = () => {
    onFilter(filter)
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">Filter Pencarian</h3>
        
        {/* Filter Kategori */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Kategori</span>
          </label>
          <select 
            className="select select-bordered"
            value={filter.kategori || ''}
            onChange={(e) => setFilter({...filter, kategori: e.target.value})}
          >
            <option value="">Semua Kategori</option>
            {kategori.map((kat) => (
              <option key={kat.id} value={kat.id}>{kat.nama}</option>
            ))}
          </select>
        </div>

        {/* Filter Fasilitas */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Fasilitas</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {fasilitas.map((fas) => (
              <label key={fas.id} className="label cursor-pointer">
                <input 
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={filter.fasilitas?.includes(fas.id)}
                  onChange={(e) => {
                    const current = filter.fasilitas || []
                    setFilter({
                      ...filter,
                      fasilitas: e.target.checked 
                        ? [...current, fas.id]
                        : current.filter(id => id !== fas.id)
                    })
                  }}
                />
                <span className="label-text ml-2">{fas.nama}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Kapasitas */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Kapasitas Minimal</span>
          </label>
          <input 
            type="number"
            className="input input-bordered"
            value={filter.kapasitasMin || ''}
            onChange={(e) => setFilter({
              ...filter,
              kapasitasMin: parseInt(e.target.value) || undefined
            })}
          />
        </div>

        {/* Tombol Filter */}
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-ghost"
            onClick={() => {
              setFilter({})
              onFilter({})
            }}
          >
            Reset
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleFilter}
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterLaboratorium