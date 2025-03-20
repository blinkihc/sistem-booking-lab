import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WaktuContextType {
  waktu: Date
}

const WaktuContext = createContext<WaktuContextType | null>(null)

export const useWaktu = () => {
  const context = useContext(WaktuContext)
  if (!context) {
    throw new Error('useWaktu harus digunakan di dalam WaktuProvider')
  }
  return context
}

interface WaktuProviderProps {
  children: ReactNode
}

export const WaktuProvider = ({ children }: WaktuProviderProps) => {
  const [waktu, setWaktu] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <WaktuContext.Provider value={{ waktu }}>
      {children}
    </WaktuContext.Provider>
  )
}