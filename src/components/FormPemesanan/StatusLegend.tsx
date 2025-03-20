export const StatusLegend = () => (
    <div className="alert bg-base-200">
      <div className="flex flex-col gap-2">
        <span className="font-medium">Keterangan Status Jam:</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { type: 'primary', label: 'Terpilih' },
            { type: 'error', label: 'Terisi' },
            { type: 'outline', label: 'Tersedia' },
            { type: 'ghost', label: 'Tidak Tersedia' },
          ].map(({ type, label }) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`badge badge-${type} badge-xs`}></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )