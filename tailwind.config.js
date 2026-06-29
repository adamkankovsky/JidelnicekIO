/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        camp: {
          primary: '#2D6A4F',
          secondary: '#40916C',
          accent: '#D8F3DC',
          warm: '#F4A261',
          bg: '#F8FAF9',
          card: '#FFFFFF',
          text: '#1B4332',
          muted: '#6B9080',
        },
      },
    },
  },
  plugins: [],
};
