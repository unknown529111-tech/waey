import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        body: ["Alexandria", "sans-serif"],
        heading: ["Alexandria", "sans-serif"],
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
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          faint: "hsl(var(--ink-faint))",
        },
        leaf: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--leaf-light))",
        },
        sun: {
          DEFAULT: "hsl(var(--accent))",
          warm: "hsl(var(--sun-warm))",
        },
        sand: {
          DEFAULT: "hsl(var(--background))",
          deep: "hsl(var(--sand-deep))",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "22px",
        "2rem": "2rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(93, 112, 82, 0.15)",
        float: "0 10px 40px -10px rgba(193, 140, 93, 0.2)",
        "soft-lg": "0 20px 40px -10px rgba(93, 112, 82, 0.15)",
        "float-lg": "0 20px 50px -12px rgba(193, 140, 93, 0.25)",
        "moss": "0 4px 20px -2px rgba(93, 112, 82, 0.15)",
        "moss-lg": "0 6px 24px -4px rgba(93, 112, 82, 0.25)",
        "clay": "0 10px 40px -10px rgba(193, 140, 93, 0.2)",
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