import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#050505",
          white: "#ffffff",
          charcoal: "#171717",
          ash: "#f5f3ef",
          line: "#e7e3dc",
          muted: "#73706a",
          orange: "#f05a1a",
          orangeSoft: "#fff1e9",
        },
      },
      boxShadow: {
        brand: "0 24px 80px rgba(5, 5, 5, 0.08)",
      },
      borderRadius: {
        brand: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
