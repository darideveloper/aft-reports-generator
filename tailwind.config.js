/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#0e3c54',
        green: '#bdd5cd',
        yellow: '#f5d49f',
        black: '#1c1c1b',
        white: '#ffffff',
      }
    },
  },
  plugins: [],
}