/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "paragraph-color": "#c41c1c",
        "bg-color-main": "#c41c1c",
        "main-color": "#7fad39",
        "red-color": "#c41c1c",
      },
    },
    screens: {
      xsm: "240px",
      // => @media (min-width: 640px) { ... }
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      xxl: "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
