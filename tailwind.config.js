// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        adina: {
          orange: "#F97316",
          black: "#1E1E1E"
        }
      }
    }
  },
  plugins: [],
}
