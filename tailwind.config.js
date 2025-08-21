/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2596be',
        secondary: '#973894', 
        tertiary: '#655997',
        accent: '#cc3266'
      },
      fontFamily: {
        'baloo': ['Baloo 2', 'sans-serif'],
        'calibri': ['Calibri', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}

