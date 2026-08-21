/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gri: {
          green: "#518214",
          'green-light': "#6ba31e",
          'green-dark': "#3b610d",
          maroon: "#911C03",
          saffron: "#F16236",
          dark: "#0F172A",
          card: "#1E293B",
        },
        khadi: {
          blue: "#0D47A1",
          light: "#82B1FF",
          dark: "#002171",
        },
        saffron: {
          DEFAULT: "#E65100",
          light: "#FF9800",
        },
        sage: {
          DEFAULT: "#2E7D32",
          light: "#4CAF50",
        },
      },
    },
  },
  plugins: [],
};
