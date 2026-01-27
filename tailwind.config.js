/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // CaringUp brand colors - using CSS variables
        black: "#0F172A",
        lightGray: "#E2E8F0",
        caringup: {
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          "primary-light": "var(--color-primary-light)",
          "primary-dark": "var(--color-primary-dark)",
          green: "var(--color-green)",
          "green-hover": "var(--color-green-hover)",
          yellow: "var(--color-yellow)",
          "yellow-hover": "var(--color-yellow-hover)",
          orange: "var(--color-orange)",
          "orange-hover": "var(--color-orange-hover)",
          "light-blue": "var(--color-light-blue)",
          "light-blue-hover": "var(--color-light-blue-hover)",
          // Semantic colors
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          info: "var(--color-info)",
          action: "var(--color-action)",
          // Neutral colors
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          "text-primary": "var(--color-text-primary)",
          "text-secondary": "var(--color-text-secondary)",
          border: "var(--color-border)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        geometric: ["Inter", "system-ui", "sans-serif"], // Large geometric sans
        heading: ["Geist", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-mobile": [
          "2.5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        32: "8rem",
        64: "16rem",
      },
      borderWidth: {
        3: "3px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flow: "flow 8s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        flow: {
          "0%, 100%": { transform: "translateY(0px) scale(1)", opacity: "0.6" },
          "50%": { transform: "translateY(-20px) scale(1.05)", opacity: "0.8" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(30, 90, 168, 0.5), 0 0 10px rgba(30, 90, 168, 0.3)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(30, 90, 168, 0.8), 0 0 30px rgba(30, 90, 168, 0.5)",
          },
        },
      },
    },
  },
  plugins: [],
};
