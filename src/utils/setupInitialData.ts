export const initialUsers = [
    {
      id: "admin-001",
      username: "admin",
      nama: "Administrator Sistem",
      email: "admin@lab.ac.id",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: "2025-03-19T07:55:06Z",
      lastLogin: null
    },
    {
      id: "kalab-001",
      username: "kepalalab",
      nama: "Kepala Laboratorium",
      email: "kalab@lab.ac.id",
      password: "kalab123",
      role: "kepala_lab",
      active: true,
      createdAt: "2025-03-19T07:55:06Z",
      lastLogin: null
    },
    {
      id: "guru-001",
      username: "guru",
      nama: "Guru Demo",
      email: "guru@lab.ac.id",
      password: "guru123",
      role: "guru",
      active: true,
      createdAt: "2025-03-19T07:55:06Z",
      lastLogin: null
    }
  ]
  
  export const setupInitialData = () => {
    const hasInitialData = localStorage.getItem('initialDataLoaded')
    
    if (!hasInitialData) {
      localStorage.setItem('users', JSON.stringify(initialUsers))
      localStorage.setItem('initialDataLoaded', 'true')
      console.log('Data awal berhasil dimuat')
    }
  }