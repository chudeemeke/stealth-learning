/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple System Colors
        'system-blue': '#007AFF',
        'system-green': '#34C759',
        'system-indigo': '#5856D6',
        'system-orange': '#FF9500',
        'system-pink': '#FF2D92',
        'system-purple': '#AF52DE',
        'system-red': '#FF3B30',
        'system-teal': '#5AC8FA',
        'system-yellow': '#FFCC00',
        'system-gray': '#8E8E93',

        // Apple Dark Mode Colors
        'system-blue-dark': '#0A84FF',
        'system-green-dark': '#30D158',
        'system-indigo-dark': '#5E5CE6',
        'system-orange-dark': '#FF9F0A',
        'system-pink-dark': '#FF375F',
        'system-purple-dark': '#BF5AF2',
        'system-red-dark': '#FF453A',
        'system-teal-dark': '#64D2FF',
        'system-yellow-dark': '#FFD60A',

        // Apple Gray Scale
        'apple-gray': {
          50: '#F9F9F9',
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#636366',
          800: '#48484A',
          900: '#1C1C1E',
        },

        // Age-specific Colors (Apple-inspired)
        'young-primary': '#FFCC00',      // Apple Yellow
        'young-secondary': '#34C759',    // Apple Green
        'young-accent': '#FF9500',       // Apple Orange
        'young-danger': '#FF3B30',       // Apple Red
        'young-success': '#34C759',      // Apple Green

        'mid-primary': '#007AFF',        // Apple Blue
        'mid-secondary': '#AF52DE',      // Apple Purple
        'mid-accent': '#5AC8FA',         // Apple Teal
        'mid-danger': '#FF3B30',         // Apple Red
        'mid-success': '#34C759',        // Apple Green

        'old-primary': '#5856D6',        // Apple Indigo
        'old-secondary': '#5AC8FA',      // Apple Teal
        'old-accent': '#FF9500',         // Apple Orange
        'old-danger': '#FF3B30',         // Apple Red
        'old-success': '#34C759',        // Apple Green
      },
      fontFamily: {
        'apple': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'young': ['SF Pro Rounded', 'SF Compact Rounded', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mid': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'old': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'young-base': '24px',
        'mid-base': '20px',
        'old-base': '18px',
      },
      spacing: {
        'touch-young': '64px',
        'touch-mid': '48px',
        'touch-old': '40px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'success-bounce': 'success-bounce 0.5s ease-out',
        'slide-up': 'slideInUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-down': 'slideInDown 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(74, 144, 226, 0.5), 0 0 20px rgba(74, 144, 226, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(74, 144, 226, 0.8), 0 0 40px rgba(74, 144, 226, 0.5)' 
          },
        },
        'success-bounce': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(0.9)' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-young': 'linear-gradient(135deg, #FFCC00 0%, #FF9500 50%, #34C759 100%)',
        'gradient-mid': 'linear-gradient(135deg, #007AFF 0%, #AF52DE 50%, #5AC8FA 100%)',
        'gradient-old': 'linear-gradient(135deg, #5856D6 0%, #5AC8FA 50%, #FF9500 100%)',
        'apple-mesh': 'radial-gradient(at 40% 20%, #007AFF 0px, transparent 50%), radial-gradient(at 80% 0%, #AF52DE 0px, transparent 50%), radial-gradient(at 0% 50%, #34C759 0px, transparent 50%), radial-gradient(at 80% 50%, #FF9500 0px, transparent 50%), radial-gradient(at 0% 100%, #5AC8FA 0px, transparent 50%), radial-gradient(at 80% 100%, #FF2D92 0px, transparent 50%), radial-gradient(at 0% 0%, #FFCC00 0px, transparent 50%)',
      },
      boxShadow: {
        'apple-xs': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'apple-sm': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'apple-md': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'apple-lg': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'apple-xl': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      borderRadius: {
        'apple-xs': '4px',
        'apple-sm': '6px',
        'apple-md': '8px',
        'apple-lg': '12px',
        'apple-xl': '16px',
        'apple-2xl': '20px',
        'apple-3xl': '24px',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-strong': '25px',
        'apple-subtle': '15px',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(bg|text|border)-(young|mid|old)-(primary|secondary|accent|danger|success)/,
    },
    {
      pattern: /^(bg|text|border)-system-(blue|green|indigo|orange|pink|purple|red|teal|yellow|gray)/,
    },
    {
      pattern: /^(bg|text|border)-apple-gray-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /^font-(apple|young|mid|old)/,
    },
    {
      pattern: /^text-(young|mid|old)-base/,
    },
    {
      pattern: /^(w|h|min-h|min-w)-(touch-young|touch-mid|touch-old)/,
    },
    {
      pattern: /^(rounded|shadow)-(apple)-(xs|sm|md|lg|xl|2xl|3xl)/,
    },
    {
      pattern: /^backdrop-blur-(apple|apple-strong|apple-subtle)/,
    },
    {
      pattern: /^animate-(slide-up|slide-down|scale-in|bounce-in|pulse-glow|shimmer)/,
    },
    'glass',
    'glass-strong',
    'glass-subtle',
    'shadow-apple-xs',
    'shadow-apple-sm',
    'shadow-apple-md',
    'shadow-apple-lg',
    'shadow-apple-xl',
  ],
};