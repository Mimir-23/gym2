/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F4C812",     // Amarillo Pro Active
        secondary: "#0f172a",   // Azul oscuro
        accent: "#83F412",      // Verde acento
        light: "#f8fafc",       // Blanco grisáceo
      },
      fontFamily: {
        sans: ["'Montserrat'", "sans-serif"], // texto
        display: ["'Akira Expanded'", "sans-serif"], // títulos
      }
      ,
    },
  },
  plugins: [],
};
