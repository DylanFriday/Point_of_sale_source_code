export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0d1117',
          800: '#121826',
          700: '#1a2233',
          600: '#212b40',
        },
        ocean: {
          500: '#1d4ed8',
          400: '#3b82f6',
          300: '#60a5fa',
        },
        coral: {
          500: '#f97316',
          400: '#fb923c',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        body: ['Work Sans', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 23, 42, 0.35)',
        card: '0 20px 50px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
