export const getTanggalMinimal = (): string => {
    const date = new Date()
    date.setDate(date.getDate() + 2) // Minimal 2 hari dari sekarang
    return date.toISOString().split('T')[0]
  }
  
  export const isTanggalValid = (tanggal: string, hariLibur: string[]): boolean => {
    const selectedDate = new Date(tanggal)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    
    // Reset waktu ke 00:00:00
    selectedDate.setHours(0, 0, 0, 0)
    minDate.setHours(0, 0, 0, 0)
    
    return selectedDate >= minDate && !hariLibur.includes(tanggal)
  }
  
  export const hitungJamTerisi = (tanggal: string): number[] => {
    const dataTersimpan = localStorage.getItem('pemesananLab')
    if (!dataTersimpan) return []
  
    const pemesanan = JSON.parse(dataTersimpan)
    return pemesanan
      .filter((p: any) => p.tanggal === tanggal && p.status !== 'dibatalkan')
      .reduce((acc: number[], curr: any) => [...acc, ...curr.jamPelajaran], [])
  }