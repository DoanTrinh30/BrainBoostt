export default function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow',
    light: 'bg-blue-50 rounded-2xl border border-blue-100 p-4',
    elevated: 'bg-white rounded-2xl border border-gray-100 shadow-md p-4',
  }
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
