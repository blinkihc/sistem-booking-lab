const Footer = () => {
    return (
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <h2 className="font-bold text-lg">SistemLab</h2>
          <p className="font-light">
            Sistem Peminjaman Lab Komputer UPT SMPN 1 Buay Rawan
          </p>
          <p>Copyright © {new Date().getFullYear()} - Yusuf Puluco - Tiga Sama Digital</p>
        </div> 
        <div>
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">Tentang Kami</a>
            <a className="link link-hover">Kontak</a>
            <a className="link link-hover">Kebijakan Privasi</a>
            <a className="link link-hover">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer