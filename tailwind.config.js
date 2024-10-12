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
        mainBgDark: '#242424',
        mainBgLight: '#ffffff',
        secondaryBgDark: '#707070',
        secondaryBgLight: '#DDDDDD',
        thirdBgDark: '#424242',
        customBlue: '#0077BB',
        customBg:'#DDDDDD',
        customHover: '#B0B0B0',
        customButton: '#E4E4E4',
      }
    },
  },
  plugins: [],
}

