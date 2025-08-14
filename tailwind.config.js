/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          100: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        accent: {
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
        },
        success: {
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          100: '#fef3c7',
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}