/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            // Premium/Dark theme palette
            background: "#0a0a0f",
            // You can add more custom colors here based on the design
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }
