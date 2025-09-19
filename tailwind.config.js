/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Age 3-5 color palette
        'young-primary': '#FFD700',      // Golden Yellow
        'young-secondary': '#4A90E2',    // Sky Blue
        'young-accent': '#7ED321',       // Grass Green
        'young-danger': '#FF6B6B',       // Soft Red
        'young-success': '#4CAF50',      // Success Green
        
        // Age 6-8 color palette
        'mid-primary': '#5856D6',        // Purple
        'mid-secondary': '#FF6B6B',      // Coral
        'mid-accent': '#4ECDC4',         // Teal
        'mid-danger': '#E74C3C',         // Danger Red
        'mid-success': '#27AE60',        // Success Green
        
        // Age 9 color palette
        'old-primary': '#2C3E50',        // Navy
        'old-secondary': '#E74C3C',      // Red
        'old-accent': '#F39C12',         // Orange
        'old-danger': '#C0392B',         // Dark Red
        'old-success': '#16A085',        // Dark Teal
      },
      fontFamily: {
        'young': ['Comic Neue', 'cursive'],
        'mid': ['Quicksand', 'sans-serif'],
        'old': ['Poppins', 'sans-serif'],
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
        'gradient-young': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-mid': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-old': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(bg|text|border)-(young|mid|old)-(primary|secondary|accent|danger|success)/,
    },
    {
      pattern: /^font-(young|mid|old)/,
    },
    {
      pattern: /^text-(young|mid|old)-base/,
    },
    {
      pattern: /^(w|h|min-h|min-w)-(touch-young|touch-mid|touch-old)/,
    },
  ],
};