import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss({
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
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
