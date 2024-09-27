/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'openSans': ['Open Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        customBlue: '#0077BB',
        customBg:'#CFCFCF',
        customHover: '#B0B0B0',
        customButton: '#E4E4E4',
      }
    },
  },
  plugins: [],
}

