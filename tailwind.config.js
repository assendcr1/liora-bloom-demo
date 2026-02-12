/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#c5a059',
          black: '#000000',
        }
      },
    },
  },
  plugins: [],
}