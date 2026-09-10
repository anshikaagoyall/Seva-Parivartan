/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B192C',
          navyLight: '#1E3A8A',
          navyDark: '#070F1E',
          emerald: '#059669',
          emeraldLight: '#10B981',
          emeraldDark: '#047857',
          emeraldBg: '#ECFDF5',
          gold: '#D97706',
          goldLight: '#F59E0B',
          saffron: '#FF9933',
          slate: '#334155',
          bgLight: '#F8FAFC',
          white: '#FFFFFF',
          lightGray: '#F9FAFB',
          grayBorder: '#E5E7EB',
          darkText: '#1F2937',
          mediumText: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'base': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.7' }],
        'xl': ['20px', { lineHeight: '1.8' }],
      },
      spacing: {
        'page-x': '1.5rem',
        'page-y': '2rem',
      },
      boxShadow: {
        govCard: '0 4px 20px -2px rgba(11, 25, 44, 0.08)',
        govGlow: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
