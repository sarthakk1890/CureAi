/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#06d6ac", // Base primary color
          dark: "#00614e", // Dark variant
          semidark: "#038e7d", // Semi-dark variant
          light: "#e9f7f7", // Light variant
        },
        secondary: {
          DEFAULT: "#fb8729",
          dark: "#E26F20",
        }, // Secondary color
        text: {
          dark: "#333333", // Dark text
          light: "#767268", // Light text
        },
      },
      backgroundImage: {
        "header-gradient":
          'linear-gradient(to right, rgba(18, 172, 142, 1), rgba(18, 172, 142, 1)), url("assets/header.jpg")',
      },
    },
  },
  plugins: [],
};
