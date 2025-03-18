interface LoadingProps {
    message?: string
  }
  
  const Loading = ({ message = 'Sabar ya...' }: LoadingProps) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    )
  }
  
  export default Loading