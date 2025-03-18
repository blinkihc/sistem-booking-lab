interface InfoPenggunaProps {
    username: string
  }
  
  const InfoPengguna = ({ username }: InfoPenggunaProps) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
            <span className="text-xs">{username.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-medium">{username}</p>
          <p className="text-xs text-gray-500">Pengguna Aktif</p>
        </div>
      </div>
    )
  }
  
  export default InfoPengguna