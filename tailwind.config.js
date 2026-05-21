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
          primary:  '#FFFFFF',
          secondary:'#F9FAFB',
          card:     '#FFFFFF',
          hover:    '#FFF7ED',
        },
        brand: {
          orange:   '#F97316',
          dark:     '#C2410C',
          light:    '#FED7AA',
          soft:     '#FFF7ED',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light:   '#F3F4F6',
        },
        // Keep legacy names for backward compat
        cyan: {
          DEFAULT: '#F97316',
          dim:     'rgba(249,115,22,0.10)',
          glow:    'rgba(249,115,22,0.22)',
        },
        violet:  { DEFAULT: '#EA580C' },
        amber:   { DEFAULT: '#F59E0B' },
        emerald: { DEFAULT: '#10B981' },
        rose:    { DEFAULT: '#EF4444' },
        text: {
          primary:   '#111827',
          secondary: '#4B5563',
          muted:     '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'fade-up':    'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow: {
          from: { boxShadow: '0 0 10px rgba(249,115,22,0.20)' },
          to:   { boxShadow: '0 0 24px rgba(249,115,22,0.50)' },
        },
      },
      backdropBlur: { xs: '2px' },
      screens: {
        'xs': '380px',
      },
    },
  },
  plugins: [],
};
