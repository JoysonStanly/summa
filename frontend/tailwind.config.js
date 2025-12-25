/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Original colors
        background: "#0f0f0f",
        sidebar: "#1a1a1a",
        borders: "#2a2a2a",
        grayText: "#9ca3af",
        
        // Theme-aware colors
        primary: {
          DEFAULT: '#ff7000',
          dark: '#ff8f33',
          light: '#e56500'
        },
        bg: {
          dark: '#0f0f0f',
          light: '#ffffff'
        },
        surface: {
          dark: '#1a1a1a',
          light: '#f5f5f5'
        },
        border: {
          dark: '#2a2a2a',
          light: '#e5e5e5'
        },
        text: {
          dark: '#ffffff',
          light: '#121212',
          muted: {
            dark: '#9ca3af',
            light: '#6b7280'
          }
        }
      },
    },
  },
  plugins: [],
}
