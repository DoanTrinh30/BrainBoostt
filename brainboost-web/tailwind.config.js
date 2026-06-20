export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D5CFF',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}