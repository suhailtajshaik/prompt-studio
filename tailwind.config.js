/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: 'var(--color-bg)', secondary: 'var(--color-bg-secondary)' },
        surface: { DEFAULT: 'var(--color-surface)', hover: 'var(--color-surface-hover)', alt: 'var(--color-surface-alt)', glass: 'var(--color-surface-glass)' },
        border: { DEFAULT: 'var(--color-border)', light: 'var(--color-border-light)', focus: 'var(--color-border-focus)' },
        text: { DEFAULT: 'var(--color-text)', secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)', inverse: 'var(--color-text-inverse)' },
        accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)', light: 'var(--color-accent-light)', text: 'var(--color-accent-text)' },
        'accent-2': 'var(--color-accent-2)',
        'accent-3': 'var(--color-accent-3)',
        success: { DEFAULT: 'var(--color-success)', light: 'var(--color-success-light)' },
        warning: { DEFAULT: 'var(--color-warning)', light: 'var(--color-warning-light)' },
        danger: { DEFAULT: 'var(--color-danger)', light: 'var(--color-danger-light)' },
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '14px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
        accent: 'var(--shadow-accent)',
      },
      fontFamily: {
        display: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
