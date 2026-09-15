import type { Config } from 'tailwindcss';

/**
 * Palette is locked to the official EarthLink mark:
 *   signature orange #F58B21  ·  wordmark charcoal #53555A
 * Dark surfaces use a deep navy/slate drawn from the same charcoal family so the
 * orange stays the only accent on the page.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ee',
          100: '#ffefdd',
          200: '#ffe1bd',
          300: '#ffce8f',
          400: '#ffb454',
          500: '#f58b21', // EarthLink signature orange
          600: '#e2760f',
          700: '#c25e08',
          800: '#9a4b0b',
          900: '#7c3d0d',
        },
        charcoal: {
          DEFAULT: '#53555a', // EarthLink wordmark charcoal
          light: '#6b6e75',
          dark: '#3d3f44',
        },
        navy: {
          700: '#1e2937',
          800: '#151d28',
          900: '#0f151d', // deep navy for dark sections
        },
        ink: '#1f2937',
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f8fafc', // soft slate card background
          line: '#e2e8f0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { container: '1200px' },
      boxShadow: {
        card: '0 1px 2px rgba(15, 21, 29, 0.04), 0 4px 16px rgba(15, 21, 29, 0.06)',
        lift: '0 12px 32px rgba(15, 21, 29, 0.10)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: { rise: 'rise 0.42s cubic-bezier(0.22,1,0.36,1) both' },
    },
  },
  plugins: [],
};

export default config;
