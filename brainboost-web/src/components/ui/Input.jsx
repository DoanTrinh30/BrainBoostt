export default function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
          ${error ? 'border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'}`}
        {...props}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  )
}
