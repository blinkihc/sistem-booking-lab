import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementasi logika login
    console.log('Login dengan:', formData)
    navigate('/dashboard')
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Masuk ke Sistem</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nama Pengguna</span>
              </label>
              <input 
                type="text" 
                placeholder="Masukkan nama pengguna"
                className="input input-bordered w-full" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Kata Sandi</span>
              </label>
              <input 
                type="password" 
                placeholder="Masukkan kata sandi"
                className="input input-bordered w-full" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Masuk</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login