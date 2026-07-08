import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        aura: "0 12px 28px rgba(0, 0, 0, 0.06)",
        soft: "0 8px 18px rgba(0, 0, 0, 0.055)",
      },
    },
  },
  plugins: [],
};

export default config;
