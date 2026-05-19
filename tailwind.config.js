/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#060915',
          secondary: '#0C1220',
          card: '#0F1729',
          hover: '#141E30',
        },
        border: {
          DEFAULT: '#1E2D45',
          light: '#253550',
        },
        cyan: {
          DEFAULT: '#00D4FF',
          dim: 'rgba(0,212,255,0.15)',
          glow: 'rgba(0,212,255,0.35)',
        },
        violet: { DEFAULT: '#7C3AED' },
        amber: { DEFAULT: '#F59E0B' },
        emerald: { DEFAULT: '#10B981' },
        rose: { DEFAULT: '#F43F5E' },
        text: {
          primary: '#F0F4FF',
          secondary: '#8FA3C0',
          muted: '#4A6080',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 6s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow: {
          from: { boxShadow: '0 0 10px rgba(0,212,255,0.2)' },
          to: { boxShadow: '0 0 24px rgba(0,212,255,0.5)' },
        },
        scan: {
          '0%': { top: '-5%' }, '100%': { top: '105%' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
