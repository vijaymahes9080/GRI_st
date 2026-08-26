/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D', // Deep academic green
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F8FAFC',
          muted: '#F1F5F9',
        },
        brand: {
          green: '#14532D', // Deep Academic Green
          maroon: '#911C03', // Traditional GRI Maroon
          saffron: '#E65100', // Traditional Saffron
          sand: '#E6DFD4', // Earthy tone
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        ui: {
          border: '#E2E8F0',
          divider: '#F1F5F9',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '0': '0px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '8px',
        DEFAULT: '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(15, 23, 42, 0.04)',
        DEFAULT: '0 4px 16px rgba(15, 23, 42, 0.06)',
        'md': '0 8px 24px rgba(15, 23, 42, 0.08)',
        'lg': '0 16px 32px rgba(15, 23, 42, 0.1)',
        'xl': '0 24px 48px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
