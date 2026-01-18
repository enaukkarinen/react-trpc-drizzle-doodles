/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        brand: {
          100: "#f0eaff",
          200: "#e0d4ff",
          300: "#cfaeff", // vibrant primary
          400: "#b388ff",
          500: "#9f6bff", // strong accent
        },
      },
    },
  },
};
