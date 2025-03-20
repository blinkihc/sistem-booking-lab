import { useAuth } from '../hooks/useAuth'

const ExampleComponent = () => {
  const { user, login, logout } = useAuth()
  
  // Gunakan fungsi dan data yang diperlukan
  return (
    <div>
      {/* JSX komponen */}
    </div>
  )
}

export default ExampleComponent