import { createContext, useContext, useState, useEffect } from 'react'

interface BookingData {
  id: number
  laboratorium: string
  tanggal: string
  waktu: string
  peminjam: string
  kelas: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
}

interface LabStats {
  totalLab: number
  tersedia: number
  digunakan: number
  totalBooking: number
}

interface DashboardContextType {
  stats: LabStats
  bookings: BookingData[]
  isLoading: boolean
  error: string | null
  refreshData: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<LabStats>({
    totalLab: 3,
    tersedia: 2,
    digunakan: 1,
    totalBooking: 12
  })

  const [bookings, setBookings] = useState<BookingData[]>([
    {
      id: 1,
      laboratorium: 'Lab Komputer 1',
      tanggal: '2025-03-18',
      waktu: '08:00 - 10:00',
      peminjam: 'Budi Santoso',
      kelas: 'XII RPL 1',
      status: 'approved'
    },
    {
      id: 2,
      laboratorium: 'Lab Komputer 2',
      tanggal: '2025-03-18',
      waktu: '10:00 - 12:00',
      peminjam: 'Ani Wijaya',
      kelas: 'XI TKJ 2',
      status: 'pending'
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Nanti di sini akan ada pemanggilan API
      // Untuk sementara gunakan data dummy
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update stats dan bookings
      setStats({
        totalLab: 3,
        tersedia: 2,
        digunakan: 1,
        totalBooking: bookings.length
      })
    } catch (err) {
      setError('Gagal memuat data dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <DashboardContext.Provider value={{ stats, bookings, isLoading, error, refreshData }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}