/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'peach': '#FED1BD',
        'candy-pink': '#fb8f9c',
        'nba-orange': '#fc5203',
      },
      fontFamily: {
        karla: ['var(--font-karla)'],
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(-45%, -45%) rotate(0deg)' },
          '50%': { transform: 'translate(-45%, -45%) rotate(15deg)' },
          '100%': { transform: 'translate(-45%, -45%) rotate(-15deg)' },
        },
        'blob-bottom': {
          '0%': { transform: 'translate(45%, 45%) rotate(0deg)' },
          '50%': { transform: 'translate(45%, 45%) rotate(-25deg)' },
          '100%': { transform: 'translate(45%, 45%) rotate(25deg)' },
        },
        'blob-top-right': {
          '0%': { transform: 'translate(45%, -35%) rotate(-25deg)' },
          '50%': { transform: 'translate(45%, -35%) rotate(0deg)' },
          '100%': { transform: 'translate(45%, -35%) rotate(25deg)' },
        },
        'blob-middle': {
          '0%': { transform: 'translate(-45%, -50%) rotate(-5deg)' },
          '50%': { transform: 'translate(-45%, -50%) rotate(5deg)' },
          '100%': { transform: 'translate(-45%, -50%) rotate(-5deg)' },
        },
        'blob-right': {
          '0%': { transform: 'translate(45%, -50%) rotate(5deg)' },
          '50%': { transform: 'translate(45%, -50%) rotate(-5deg)' },
          '100%': { transform: 'translate(45%, -50%) rotate(5deg)' },
        },
      },
      animation: {
        'blob': 'blob 6.72s ease-in-out infinite alternate',
        'blob-delayed': 'blob-bottom 6.72s ease-in-out infinite alternate-reverse',
        'blob-top-right': 'blob-top-right 8.4s ease-in-out infinite alternate',
        'blob-middle': 'blob-middle 8.08s ease-in-out infinite alternate',
        'blob-right': 'blob-right 8.96s ease-in-out infinite alternate-reverse',
      },
    },
  },
  plugins: [],
};

export default config;
