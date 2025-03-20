import { useEffect, useState } from 'react'
import { format } from 'date-fns-tz'
import { id } from 'date-fns/locale'

const WaktuSekarang = () => {
  const [waktu, setWaktu] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-base-content/70">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span className="font-mono">
        {format(waktu, 'EEEE, dd MMMM yyyy - HH:mm:ss', { locale: id })}
      </span>
    </div>
  )
}

export default WaktuSekarang