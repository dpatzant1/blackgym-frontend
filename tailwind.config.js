/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // BLACK GYM Color Palette
        'primary-black': '#000000',
        'secondary-black': '#1a1a1a',
        'dark-gray': '#2d2d2d',
        'light-gray': '#9f9f9f',
        'neon-green': '#00ff41',
        'neon-green-light': '#39ff14',
        'neon-green-dark': '#00cc33',
        'text-light': '#f5f5f5',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'hero': ['5.5rem', { lineHeight: '1.1', letterSpacing: '3px' }],
        'hero-mobile': ['2.5rem', { lineHeight: '1.1' }],
        'section-title': ['3rem', { lineHeight: '1.2', letterSpacing: '2px' }],
      },
      height: {
        'hero-height': '100vh',
      },
      backdropBlur: {
        'header': '10px',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 65, 0.5)',
        'neon-strong': '0 0 15px rgba(0, 255, 65, 0.8)',
        'card': '0 10px 25px rgba(0, 255, 65, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'mobile': '480px',
        'tablet': '768px',
      },
    },
  },
  plugins: [],
}
