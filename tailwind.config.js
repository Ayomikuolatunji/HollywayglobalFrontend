/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'paragraph-color': '#c41c1c',
        'bg-color-main': '#c41c1c',
      }
    },
  },
  plugins: [],
}
