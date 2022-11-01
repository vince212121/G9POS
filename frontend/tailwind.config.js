/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "1024px",
      // => @media (min-width: 1024px) { ... }

      lg: "1280px",
      // => @media (min-width: 1280px) { ... }

      xl: "1536px",
      // => @media (min-width: 1536px) { ... }

      "2xl": "1900px",
      // => @media (min-width: 1900px) { ... }
    },
  },
  plugins: [],
};
