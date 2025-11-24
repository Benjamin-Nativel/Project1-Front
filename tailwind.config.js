/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#10b981", // emerald-500
        "background-light": "#f8fafc", // slate-50
        "background-dark": "#0f172a", // slate-900
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b", // slate-800
        "text-light": "#1e293b", // slate-800
        "text-dark": "#e2e8f0", // slate-200
        "text-secondary-light": "#64748b", // slate-500
        "text-secondary-dark": "#94a3b8", // slate-400
        "destructive": "#ef4444", // red-500
      },
      fontFamily: {
        "display": ["Work Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.75rem", // rounded-lg
        "lg": "1rem", // rounded-xl
        "xl": "1.5rem", // rounded-2xl
        "2xl": "2rem", // rounded-3xl
        "full": "9999px",
      },
      boxShadow: {
        'soft': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        'fab': '0 8px 20px 0 rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
