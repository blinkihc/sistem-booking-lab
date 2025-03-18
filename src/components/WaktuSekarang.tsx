import { useState, useEffect } from 'react'

const WaktuSekarang = () => {
  const [waktu, setWaktu] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTanggal = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }

    return date.toLocaleDateString('id-ID', options)
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="badge badge-primary">UTC</div>
      <span className="font-mono">{waktu.toISOString().slice(0, 19).replace('T', ' ')}</span>
    </div>
  )
}

export default WaktuSekarang