import { createContext, useContext, useState, useEffect } from 'react'

interface WaktuContextType {
  waktuSekarang: Date
  formatWaktuLengkap: (date: Date) => string
  formatWaktuSingkat: (date: Date) => string
  formatTanggal: (date: Date) => string
}

const WaktuContext = createContext<WaktuContextType | undefined>(undefined)

export const WaktuProvider = ({ children }: { children: React.ReactNode }) => {
  const [waktuSekarang, setWaktuSekarang] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktuSekarang(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatWaktuLengkap = (date: Date) => {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatWaktuSingkat = (date: Date) => {
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

  const formatTanggal = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <WaktuContext.Provider 
      value={{ 
        waktuSekarang, 
        formatWaktuLengkap, 
        formatWaktuSingkat,
        formatTanggal 
      }}
    >
      {children}
    </WaktuContext.Provider>
  )
}

export const useWaktu = () => {
  const context = useContext(WaktuContext)
  if (context === undefined) {
    throw new Error('useWaktu harus digunakan di dalam WaktuProvider')
  }
  return context
}