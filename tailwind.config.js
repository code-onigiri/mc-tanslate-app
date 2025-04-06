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
      // アニメーション関連の設定は一時的に無効化されています
      keyframes: {
        // 無効化
      },
      animation: {
        // 無効化
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
