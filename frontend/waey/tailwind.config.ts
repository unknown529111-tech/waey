import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        alexandria: ["Alexandria", "sans-serif"],
        body: ["Nunito", "Alexandria", "sans-serif"],
        heading: ["Fraunces", "Amiri", "serif"],
        display: ["Fraunces", "Amiri", "Alexandria", "serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        footer: "hsl(var(--footer))",
        leaf: {
          light: "hsl(var(--leaf-light))",
        },
        sun: {
          warm: "hsl(var(--sun-warm))",
        },
        water: {
          DEFAULT: "hsl(var(--water))",
          soft: "hsl(var(--water-soft))",
        },
        field: {
          health: {
            DEFAULT: "hsl(var(--field-health) / <alpha-value>)",
            soft: "hsl(var(--field-health-soft) / <alpha-value>)",
            tint: "hsl(var(--field-health-tint) / <alpha-value>)",
          },
          finance: {
            DEFAULT: "hsl(var(--field-finance) / <alpha-value>)",
            soft: "hsl(var(--field-finance-soft) / <alpha-value>)",
            tint: "hsl(var(--field-finance-tint) / <alpha-value>)",
          },
          environment: {
            DEFAULT: "hsl(var(--field-environment) / <alpha-value>)",
            soft: "hsl(var(--field-environment-soft) / <alpha-value>)",
            tint: "hsl(var(--field-environment-tint) / <alpha-value>)",
          },
          education: {
            DEFAULT: "hsl(var(--field-education) / <alpha-value>)",
            soft: "hsl(var(--field-education-soft) / <alpha-value>)",
            tint: "hsl(var(--field-education-tint) / <alpha-value>)",
          },
          current: {
            DEFAULT: "hsl(var(--field-current) / <alpha-value>)",
            soft: "hsl(var(--field-current-soft) / <alpha-value>)",
            tint: "hsl(var(--field-current-tint) / <alpha-value>)",
          },
        },
        moss: {
          DEFAULT: "hsl(var(--primary))",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
          bright: "hsl(var(--success-bright) / <alpha-value>)",
          soft: "hsl(var(--success-soft) / <alpha-value>)",
          dark: "hsl(var(--success-dark) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
          bright: "hsl(var(--warning-bright) / <alpha-value>)",
          soft: "hsl(var(--warning-soft) / <alpha-value>)",
          dark: "hsl(var(--warning-dark) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
          bright: "hsl(var(--danger-bright) / <alpha-value>)",
          soft: "hsl(var(--danger-soft) / <alpha-value>)",
          dark: "hsl(var(--danger-dark) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
          bright: "hsl(var(--info-bright) / <alpha-value>)",
          soft: "hsl(var(--info-soft) / <alpha-value>)",
          dark: "hsl(var(--info-dark) / <alpha-value>)",
        },
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "24px",
        "2xl": "32px",
        "2rem": "2rem",
        "3xl": "32px",
        "4xl": "40px",
        "5xl": "48px",
        card: "var(--radius-card)",
        pill: "9999px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        float: "var(--shadow-float)",
        "soft-lg": "var(--shadow-lift)",
        "float-lg": "0 20px 50px -12px rgba(193, 140, 93, 0.25)",
        "moss": "var(--shadow-soft)",
        "moss-lg": "var(--shadow-soft-hover)",
        "clay": "var(--shadow-float)",
        "clay-lg": "0 20px 50px -12px rgba(193, 140, 93, 0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-slow": {
          "0%": { transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05) rotate(2deg)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95) rotate(-1deg)" },
          "100%": { transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5px, -5px)" },
          "20%": { transform: "translate(-10px, 5px)" },
          "30%": { transform: "translate(5px, -10px)" },
          "40%": { transform: "translate(-5px, 10px)" },
          "50%": { transform: "translate(10px, 5px)" },
          "60%": { transform: "translate(5px, -5px)" },
          "70%": { transform: "translate(-10px, -5px)" },
          "80%": { transform: "translate(10px, 10px)" },
          "90%": { transform: "translate(-5px, 5px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "gentle-pulse": "gentle-pulse 4s ease-in-out infinite",
        blob: "blob 8s ease-in-out infinite",
        "blob-slow": "blob-slow 12s ease-in-out infinite",
        "grain-shift": "grain-shift 20s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;