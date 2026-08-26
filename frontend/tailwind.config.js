/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FAF7F0',
          canvas: '#F3EBDD',
          muted: '#E8DDCB',
          card: '#FFFFFF',
        },
        vit: {
          midnight: '#082B4C',
          navy: '#061D33',
          blue: '#0066A8',
          accent: '#4D91B8',
          gold: '#C99A3D',
          goldLight: '#E2C06A',
          charcoal: '#1A232E',
          ivory: '#FAF7F0',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        geist: ['Geist', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(201, 154, 61, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(0, 102, 168, 0.3)',
        'warm-card': '0 10px 40px -10px rgba(8, 43, 76, 0.08), 0 0 1px 1px rgba(201, 154, 61, 0.15)',
      },
    },
  },
  plugins: [],
};
