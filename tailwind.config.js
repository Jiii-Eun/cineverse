/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0D0D12',
        surface: '#16161F',
        card: '#1A1A24',
        elevated: '#1F1F2B',
        primary: '#8B5CF6',
        accent: '#EC4899',
        muted: '#6B7280',
        foreground: '#FFFFFF',
        rating: '#FBBF24',
        border: 'rgba(255,255,255,0.08)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        chip: '20px',
      },
    },
  },
  plugins: [],
};
