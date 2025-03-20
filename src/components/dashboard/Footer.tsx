import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const Footer = () => {
  const tahunSekarang = new Date().getFullYear()
  const waktuSekarang = format(new Date(), 'HH:mm:ss', { locale: id })
  const tanggalSekarang = format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })

  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm opacity-80">
            {tanggalSekarang} • {waktuSekarang} WIB
          </div>
        </div>
        <div className="text-sm opacity-60">
          © {tahunSekarang} Sistem Peminjaman Laboratorium Komputer - UPT SMP Negeri 1 Buay Rawan
        </div>
        <div className="text-xs opacity-50">
          Dikembangkan oleh Tiga Sama Digital
        </div>
      </div>
    </footer>
  )
}

export default Footer