/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── MediMind Brand Core ───
        // Source of truth: medimind-brand/04-colors/tokens.css
        primary: '#1a365d',         // deep navy
        secondary: '#2b6cb0',       // medium blue
        accent: '#3182ce',          // bright blue
        'light-accent': '#bee3f8',  // very light blue
        navy: '#1a365d',            // alias for primary

        // ─── Semantic ───
        success: '#38a169',
        warning: '#dd6b20',
        error: '#e53e3e',
        info: '#3182ce',

        // ─── Surface (theme-aware via CSS vars in brand-tokens.css) ───
        // Light mode defaults live in :root; dark mode overrides live in :root.dark
        surface: {
          DEFAULT: 'var(--emr-bg-page)',
          page: 'var(--emr-bg-page)',
          card: 'var(--emr-bg-card)',
          hover: 'var(--emr-bg-hover)',
          border: 'var(--emr-border-color)',
          section: 'var(--emr-bg-section)',
        },

        // ─── Text (theme-aware) ───
        text: {
          DEFAULT: 'var(--emr-text-primary)',
          muted: 'var(--emr-text-secondary)',
          subtle: 'var(--emr-text-tertiary)',
          inverse: 'var(--emr-text-inverse)',
        },

        // ─── Border (theme-aware) ───
        'border-default': 'var(--emr-border-color)',
        'border-subtle': 'var(--emr-border-subtle)',
      },
      backgroundImage: {
        // Primary CTA gradient — brandbook light-mode ramp. Kept hardcoded
        // so CTAs stay bright/legible in both themes (dark-mode brandbook
        // ramp is muted slate, which reads weak on action buttons).
        'brand-gradient': 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 50%, #3182ce 100%)',
        'brand-gradient-on-dark': 'linear-gradient(135deg, #3182ce 0%, #bee3f8 100%)',
        'brand-gradient-text': 'linear-gradient(135deg, #3182ce 0%, #bee3f8 100%)',
        'gradient-conic': 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      ringOffsetColor: {
        navy: '#0f172a',
        'surface-page': 'var(--emr-bg-page)',
      },
    },
  },
  plugins: [],
};
