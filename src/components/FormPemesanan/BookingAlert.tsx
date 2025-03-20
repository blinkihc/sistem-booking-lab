interface BookingAlertProps {
    message: string
    type: 'error' | 'warning' | 'info'
  }
  
  export const BookingAlert = ({ message, type }: BookingAlertProps) => (
    <div className={`alert alert-${type} mt-2`}>
      <span>{message}</span>
    </div>
  )