// Mock API untuk simulasi server
export const mockApi = {
    login: async (credentials: { username: string; password: string }) => {
      // Simulasi delay network
      await new Promise(resolve => setTimeout(resolve, 800))
  
      // Ambil data users dari localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Cari user yang sesuai
      const user = users.find((u: any) => 
        u.username === credentials.username && 
        u.password === credentials.password && 
        u.active
      )
  
      if (!user) {
        throw new Error('Username atau password salah')
      }
  
      // Buat token simulasi
      const token = btoa(`${user.username}-${Date.now()}`)
  
      // Update lastLogin
      user.lastLogin = new Date().toISOString()
      localStorage.setItem('users', JSON.stringify(users.map((u: any) => 
        u.id === user.id ? user : u
      )))
  
      return {
        user: {
          id: user.id,
          username: user.username,
          nama: user.nama,
          email: user.email,
          role: user.role,
          active: user.active,
          lastLogin: user.lastLogin
        },
        token
      }
    }
  }