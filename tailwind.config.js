/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF2E9',
          100: '#FCE4CA',
          200: '#F9C895',
          300: '#F6AC60',
          400: '#F3902B',
          500: '#D35400',
          600: '#B34700',
          700: '#933A00',
          800: '#732D00',
          900: '#532000',
        },
        secondary: {
          50: '#E8F6F3',
          100: '#D1ECE7',
          200: '#A3D9CF',
          300: '#75C6B7',
          400: '#47B39F',
          500: '#16A085',
          600: '#128070',
          700: '#0E605A',
          800: '#0A4045',
          900: '#062030',
        },
        accent: {
          50: '#FDF9E7',
          100: '#FBF3CF',
          200: '#F7E79F',
          300: '#F3DB6F',
          400: '#EFCF3F',
          500: '#F39C12',
          600: '#D1840E',
          700: '#B06C0B',
          800: '#8E5408',
          900: '#6C3C05',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'batik-pattern': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><g fill=\"%23F39C12\" fill-opacity=\"0.03\"><circle cx=\"20\" cy=\"20\" r=\"8\"/><circle cx=\"0\" cy=\"0\" r=\"8\"/><circle cx=\"40\" cy=\"0\" r=\"8\"/><circle cx=\"0\" cy=\"40\" r=\"8\"/><circle cx=\"40\" cy=\"40\" r=\"8\"/></g></svg>')",
      },
    },
  },
  plugins: [],
}