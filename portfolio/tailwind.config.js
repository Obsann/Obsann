/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Allow dynamic class names used in App.jsx (color interpolation)
  safelist: [
    { pattern: /^(bg|text|border|from|to)-(indigo|cyan|emerald|rose|purple|orange|neutral|green|yellow|indigo|red)-(300|400|500|600|700|800|900)(\/\d+)?$/ },
    { pattern: /^(group-hover:)?(bg|text|border|from|to)-(indigo|cyan|emerald|rose|purple|orange)-(400|500)(\/\d+)?$/ },
  ],
}
