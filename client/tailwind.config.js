/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 36px rgba(0,0,0,0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.08)"
      }
    }
  },
  plugins: []
};
