/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwindの標準的なdarkModeクラスとカスタム属性の両方をサポート
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
