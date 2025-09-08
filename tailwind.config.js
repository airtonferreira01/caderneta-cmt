/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a651', // Verde
          dark: '#008c44',
        },
        secondary: {
          DEFAULT: '#ffc107', // Amarelo
          hover: '#ffca28',
        },
        accent: {
          DEFAULT: '#0a3866', // Azul
          dark: '#0d47a1',
        },
      },
    },
  },
  plugins: [],
};