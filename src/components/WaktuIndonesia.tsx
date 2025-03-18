import { useState, useEffect } from 'react'

const WaktuIndonesia = () => {
  const [waktu, setWaktu] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatWaktuIndonesia = (date: Date) => {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatTanggalSingkat = (date: Date) => {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="badge badge-primary">WIB</div>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <span className="text-sm font-medium hidden md:inline">
          {formatWaktuIndonesia(waktu)}
        </span>
        <span className="text-sm font-mono md:hidden">
          {formatTanggalSingkat(waktu)}
        </span>
      </div>
    </div>
  )
}

export default WaktuIndonesia