/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',   // Orange
        secondary: '#000000', // Black
        accent: '#FFFFFF',    // White
      },
    },
  },
  plugins: [require("daisyui"), require('@tailwindcss/aspect-ratio')],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#FF6B00",
        "secondary": "#000000",
        "accent": "#FFFFFF",
        "neutral": "#333333",
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
};