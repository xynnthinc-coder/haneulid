import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFB7C5",
          "pink-light": "#FFD6DF",
          "pink-deep": "#FF8FAB",
          cream: "#FFF5E4",
          "cream-dark": "#FFE8CC",
          blue: "#B8E0FF",
          "blue-light": "#D6EEFF",
          "blue-deep": "#7EC8E3",
          purple: "#E5C4FF",
          mint: "#C4F5E0",
          yellow: "#FFF1C1",
        },
      },
      fontFamily: {
        display: ["var(--font-nunito)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        cute: "0 8px 32px rgba(255, 143, 171, 0.25)",
        "cute-blue": "0 8px 32px rgba(126, 200, 227, 0.25)",
        "cute-lg": "0 16px 48px rgba(255, 143, 171, 0.3)",
        card: "0 4px 20px rgba(255, 183, 197, 0.3)",
        "card-hover": "0 12px 40px rgba(255, 143, 171, 0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounce_gentle: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.02)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px) rotate(-2deg)" },
          "75%": { transform: "translateX(8px) rotate(2deg)" },
        },
        open_box: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.1) rotate(-5deg)" },
          "50%": { transform: "scale(1.15) rotate(5deg)" },
          "75%": { transform: "scale(0.9) rotate(-2deg)" },
          "100%": { transform: "scale(0) rotate(10deg)", opacity: "0" },
        },
        reveal_card: {
          "0%": { transform: "scale(0) rotateY(180deg)", opacity: "0" },
          "60%": { transform: "scale(1.15) rotateY(10deg)", opacity: "1" },
          "80%": { transform: "scale(0.95) rotateY(-5deg)" },
          "100%": { transform: "scale(1) rotateY(0deg)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        slide_up: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 143, 171, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 143, 171, 0.8)" },
        },
        confetti_fall: {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        bounce_gentle: "bounce_gentle 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        open_box: "open_box 0.6s ease-in-out forwards",
        reveal_card: "reveal_card 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        slide_up: "slide_up 0.5s ease-out forwards",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
        confetti_fall: "confetti_fall linear forwards",
      },
    },
  },
  plugins: [],
};
export default config;
