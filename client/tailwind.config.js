/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',   // small phones
      'sm': '640px',   // large phones / small tablets
      'md': '768px',   // tablets
      'lg': '1024px',  // laptops
      'xl': '1280px',  // desktops
      '2xl': '1536px', // large desktops
    },
    extend: {},
  },
  plugins: [],
}