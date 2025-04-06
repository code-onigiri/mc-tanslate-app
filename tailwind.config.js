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
      keyframes: {
        'click': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        'slide-down': {
          '0%': { maxHeight: '0', opacity: '0', overflow: 'hidden' },
          '100%': { maxHeight: '500px', opacity: '1', overflow: 'hidden' },
        },
        'slide-up': {
          '0%': { maxHeight: '500px', opacity: '1', overflow: 'hidden' },
          '100%': { maxHeight: '0', opacity: '0', overflow: 'hidden' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'click': 'click 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',  // 時間を短縮
        'fade-in': 'fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards', // 時間を短縮
        'fade-out': 'fade-out 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards', // 時間を短縮
        'slide-fade-in': 'slide-fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards', // 時間を短縮
        'slide-fade-out': 'slide-fade-out 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards', // 時間を短縮
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.2s ease-in forwards',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
