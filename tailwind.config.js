
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.slate,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
        amber: colors.amber,
        orange: colors.orange,
        slate: colors.slate,
        accent: colors.violet, // Added for specific accent usages
        tangerine: colors.orange, // Added for specific usages
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'pulse-badge': 'pulse 2s infinite',
        'mark-complete': 'markComplete 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        markComplete: {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)', color: '#10b981' }, // emerald-500
            '100%': { transform: 'scale(1)' },
        }
      },
    },
  },
  plugins: [],
}
