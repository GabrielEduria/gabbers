/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#7c3aed',
          soft: '#a78bfa',
          deep: '#5b21b6',
        },
      },
    },
  },
  plugins: [],
}
