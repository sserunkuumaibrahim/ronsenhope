/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FE4FC3',   // Rose Pink
        secondary: '#FF1CB4', // Shocking Pink
        accent: '#FFFFFF',    // White
        silver: '#BBBAB8',    // Silver
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("daisyui"), require('@tailwindcss/aspect-ratio')],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#FE4FC3",
        "secondary": "#FF1CB4",
        "accent": "#FFFFFF",
        "neutral": "#000000",
        "base-100": "#FFFFFF",
        "base-200": "#F8F8F8",
        "base-300": "#EEEEEE",
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#F87272",
      },
    }],
  },
}