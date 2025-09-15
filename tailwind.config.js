/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors
        'primary-purple': '#7A2FF0',
        'primary-pink': '#E23DAD',
        
        // Sidebar colors
        'sidebar-bg': '#F9FAFC',
        'sidebar-active': '#E9F1FF',
        
        // Card background colors
        'card-gross-sales': '#F8E9FB',
        'card-total-income': '#E9FDF6',
        'card-total-purchase': '#E8F0FF',
        'card-total-expense': '#FDF0E9',
        'card-gross-profit': '#E9F8FF',
        'card-orders': '#F3E9FD',
        
        // Icon colors
        'icon-gross-sales': '#E23DAD',
        'icon-total-income': '#38B36A',
        'icon-total-purchase': '#3578E5',
        'icon-total-expense': '#F29C38',
        'icon-gross-profit': '#2CB7E8',
        'icon-orders': '#9E47F5',
        
        // Graph colors
        'graph-line': '#7A59FF',
        
        // Legacy colors for backward compatibility
        primary: '#7A2FF0',
        secondary: '#E23DAD', 
        tertiary: '#655997',
        accent: '#7A59FF'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'baloo': ['Baloo 2', 'sans-serif'],
        'calibri': ['Calibri', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}

