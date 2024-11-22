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
        mainBgDark: '#262521',
        mainBgLight: '#F2F2F2',
        secondaryBgDark: '#595856',
        secondaryBgLight: '#DFDFDF',
        thirdBgDark: '#403f3c',
        customBlue: '#0077BB',
        customBg:'#F2F2F2',
        customHover: '#B0B0B0',
        customButton: '#E4E4E4',
      }
    },
  },
  plugins: [],
}

