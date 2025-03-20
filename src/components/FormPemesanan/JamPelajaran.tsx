import { JAM_PELAJARAN } from '../../constants/pemesanan'

interface JamPelajaranProps {
  jamTerpilih: number[]
  jamTerisi: number[]
  onPilihJam: (jamKe: number) => void
}

export const JamPelajaran = ({ jamTerpilih, jamTerisi, onPilihJam }: JamPelajaranProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      {JAM_PELAJARAN.map((jam) => {
        const isSelected = jamTerpilih.includes(jam.ke)
        const isTerisi = jamTerisi.includes(jam.ke)
        const dapatDipilih = !isTerisi && (
          jamTerpilih.length === 0 || 
          jamTerpilih.includes(jam.ke) || 
          jam.ke === jamTerpilih[jamTerpilih.length - 1] + 1
        )

        return (
          <div key={jam.ke} className="relative">
            <div className="tooltip" data-tip={jam.waktu}>
              <button
                type="button"
                className={`
                  btn w-full
                  ${isSelected ? 'btn-primary' : 
                    isTerisi ? 'btn-error' : 
                    !dapatDipilih ? 'btn-disabled' : 
                    'btn-outline'
                  }
                `}
                onClick={() => onPilihJam(jam.ke)}
                disabled={!dapatDipilih || isTerisi}
              >
                {jam.label}
              </button>
            </div>
            {isTerisi && (
              <div className="absolute -top-2 -right-2">
                <div className="badge badge-error badge-sm">Terisi</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
    {jamTerpilih.length > 0 && (
      <div className="alert alert-info">
        <div>
          <span className="font-medium">Jam yang dipilih:</span>
          <div className="mt-1">
            {jamTerpilih.map(jamKe => {
              const jam = JAM_PELAJARAN.find(j => j.ke === jamKe)
              return (
                <div key={jamKe} className="badge badge-primary mr-2 mb-2">
                  {jam?.label} ({jam?.waktu})
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )}
  </div>
)