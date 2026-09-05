/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rwanda-green': '#00A651',
        'rwanda-yellow': '#FCD116',
        'rwanda-blue': '#0066B3',
      }
    },
  },
  plugins: [],
}