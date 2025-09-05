/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafa',
          100: '#f1f5f5',
          200: '#e3ebeb',
          300: '#d1dcdc',
          400: '#7da2a9',
          500: '#6b9299',
          600: '#5a7d83',
          700: '#4a666c',
          800: '#3d5458',
          900: '#324549'
        },
        neutral: {
          50: '#fafafa',
          100: '#f7f7f7',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      }
    },
  },
  plugins: [],
}