/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futuristic: ['"Orbitron"', 'sans-serif'],
      },
      colors: {
        accent: "#00FFE0",
      },
      keyframes: {
        fadeDown: {
          "0%": { opacity: 0, transform: "translateY(-50px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        rotate360: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeDown: "fadeDown 1s ease forwards",
        fadeIn: "fadeIn 1.5s ease forwards",
        rotate360: "rotate360 20s linear infinite",
      },
    },
  },
  plugins: [],
};
