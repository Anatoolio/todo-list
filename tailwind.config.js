/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5DBEA3",
          dark: "#4FA88F",
        },
        surface: {
          DEFAULT: "#1A1A1A",
          raised: "#242424",
        },
      },
    },
  },
  plugins: [],
};
